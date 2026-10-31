#!/usr/bin/env node
/**
 * 公众号文章 → 个人站 content.ts
 *
 * 用法：
 *   node scripts/add-article.mjs <公众号文章链接> --tag "公众号 · 书评"
 *   node scripts/add-article.mjs <链接> --desc "自己写的摘要"      # 覆盖自动摘要
 *   node scripts/add-article.mjs <链接> --dry                     # 只看抓到了什么，不写文件
 *   node scripts/add-article.mjs <链接> --no-build                # 改完不跑构建
 *
 * 行为：
 *   1. 抓 og:title / createTime / og:description / 正文首段
 *   2. url 已存在 → 原地更新那条（tag/摘要保留手写值）；不存在 → 必须显式 --tag，插到最前面
 *      （--tag 只能取站点已有的那几类，避免标签越加越散）
 *   3. 默认跑一次 astro build（--no-build 可跳过）
 * 抓不到标题（多半是公众号返回了验证页）会直接报错退出，不会写坏文件。
 */
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULTS = { tag: '公众号 · 随笔', descMax: 110 };
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

function parseArgs(argv) {
  const out = { url: null, tag: DEFAULTS.tag, tagGiven: false, desc: null, dry: false, build: true, file: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tag') { out.tag = argv[++i]; out.tagGiven = true; }
    else if (a === '--desc') out.desc = argv[++i];
    else if (a === '--dry') out.dry = true;
    else if (a === '--no-build') out.build = false;
    else if (a === '--file') out.file = argv[++i];
    else if (!a.startsWith('--')) out.url = a;
  }
  if (!out.url) {
    console.error('用法: node scripts/add-article.mjs <公众号文章链接> [--tag ...] [--desc ...] [--dry] [--no-build]');
    process.exit(2);
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

const tidy = (s) => decode(s).replace(/\s+/g, ' ').trim();

/** 正文转纯文本，用来看摘要兜底和字数 */
function bodyText(html) {
  const m = html.match(/<div[^>]*id="js_content"[^>]*>([\s\S]*?)<\/div>\s*<script/i) ||
    html.match(/<div[^>]*id="js_content"[^>]*>([\s\S]*)<\/div>/);
  if (!m) return '';
  return tidy(
    m[1]
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

async function fetchArticle(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://mp.weixin.qq.com/' } });
  if (!res.ok) throw new Error(`请求失败 HTTP ${res.status}`);
  const html = await res.text();

  const title = html.match(/og:title"\s*content="([^"]*)"/)?.[1] ||
    html.match(/<h1[^>]*id="activity-name"[^>]*>([\s\S]*?)<\/h1>/)?.[1];
  if (!title || !title.trim()) {
    throw new Error('没抓到标题——公众号可能返回了验证页，稍后重试，或用 --desc 手动指定后重跑');
  }

  const createTime = html.match(/var\s+createTime\s*=\s*'(\d{4}-\d{2}-\d{2})/)?.[1];
  let date = createTime;
  if (!date) {
    const ct = html.match(/var\s+ct\s*=\s*"(\d{10})"/)?.[1];
    if (ct) {
      // 公众号 ct 是北京时间戳，直接按 +8 折算
      const d = new Date((Number(ct) + 8 * 3600) * 1000);
      date = d.toISOString().slice(0, 10);
    }
  }
  if (!date) throw new Error('没抓到发布日期');

  const ogDesc = html.match(/property="og:description"\s*content="([\s\S]*?)"\s*\/?>/)?.[1];
  const body = bodyText(html);
  const desc = tidy(ogDesc || body).slice(0, DEFAULTS.descMax);

  return { title: tidy(title), date, desc, bodyChars: body.length };
}

/** 只替换匹配到的字段，避免手写摘要被自动摘要冲掉 */
function objectBlock(indent, item, featured = false) {
  return `${indent}{
${indent}  date: '${item.date}',
${indent}  tag: '${item.tag}',
${indent}  title: '${item.title}',
${indent}  desc: '${item.desc}',
${indent}  url: '${item.url}',
${featured ? `${indent}  featured: true,\n` : ''}${indent}},`;
}

function upsert(src, item, opts = {}) {
  const keepDesc = opts.keepDesc !== false;
  const keepTag = opts.keepTag === true;
  const eUrl = item.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const existing = new RegExp(
    `\\n([ \\t]*)\\{\\s*date: '[^']*',\\s*tag: '((?:[^'\\\\]|\\\\.)*)',\\s*title: '[^']*',\\s*desc: '((?:[^'\\\\]|\\\\.)*)',\\s*url: '${eUrl}',\\s*(featured: true,\\s*)?\\},`
  );

  const hit = src.match(existing);
  if (hit) {
    // 只覆盖显式给的字段：featured 角标、手写摘要、已定的 tag 都保留
    const [indent, oldTag, oldDesc, feat] = [hit[1], hit[2], hit[3], !!hit[4]];
    const finalItem = {
      ...item,
      ...(keepTag ? { tag: oldTag } : {}),
      ...(keepDesc ? { desc: oldDesc } : {}),
    };
    return {
      src: src.replace(existing, () => `\n${objectBlock(indent, finalItem, feat)}`),
      mode: 'updated',
      keptDesc: keepDesc,
      keptTag: keepTag,
    };
  }

  const anchor = 'export const ARTICLES: Article[] = [';
  const i = src.indexOf(anchor);
  if (i === -1) throw new Error('content.ts 里找不到 ARTICLES 数组');
  const insertAt = i + anchor.length;
  return {
    src: src.slice(0, insertAt) + '\n' + objectBlock('  ', item) + src.slice(insertAt),
    mode: 'inserted',
  };
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

/** 公众号链接常带 scene / poc_token 跟踪参数，去掉后才是同一篇 */
const canonical = (u) => u.split('?')[0].replace(/\/+$/, '');

const args = parseArgs(process.argv.slice(2));
const file = resolve(ROOT, args.file || 'src/lib/content.ts');

const art = await fetchArticle(args.url);
const item = {
  date: art.date,
  tag: args.tag,
  title: esc(art.title),
  desc: esc(args.desc || art.desc),
  url: canonical(args.url),
};

console.log(`标题: ${art.title}`);
console.log(`日期: ${art.date}`);
console.log(`摘要(${item.desc.length}字): ${item.desc}`);
console.log(`正文字数: ${art.bodyChars}`);

if (args.dry) {
  console.log('\n[--dry] 只看结果，未写文件');
  process.exit(0);
}

const before = readFileSync(file, 'utf8');

// 新文章必须显式给 tag，且只能用站点已有的那几类
const isDup = before.includes(`url: '${item.url}'`);
if (!isDup && !args.tagGiven) {
  const a = before.indexOf('export const ARTICLES: Article[] = [');
  const seg = before.slice(a, before.indexOf('];', a));
  const tags = [...new Set([...seg.matchAll(/tag: '([^']+)'/g)].map((m) => m[1]))];
  console.error(`\n新文章要指定 --tag，现有分类：\n${tags.map((t) => `  --tag "${t}"`).join('\n')}`);
  process.exit(2);
}

const { src, mode, keptDesc, keptTag } = upsert(before, item, {
  keepDesc: !args.desc,
  keepTag: !args.tagGiven,
});
if (src === before) {
  console.log('\n内容无变化，跳过写入');
  process.exit(0);
}
copyFileSync(file, `${file}.bak`);
writeFileSync(file, src, 'utf8');
console.log(`\n${mode === 'inserted' ? '已插入新文章' : '已更新已有文章'} → ${file}（旧文件备份为 .bak）`);
if (mode === 'updated' && (keptDesc || keptTag)) {
  console.log(`已有内容保留未覆盖：${[keptTag && 'tag', keptDesc && '摘要'].filter(Boolean).join(' / ')}（要改显式传 --tag / --desc）`);
}

if (args.build) {
  console.log('\n构建中…');
  execSync('npx astro build', { cwd: ROOT, stdio: 'inherit' });
  console.log('\n构建完成，可以用发布流程上线了');
}
