export interface Skill {
  name: string;
  displayName: string; // 卡片标题（中文名 + slug）
  description: string; // 解决什么问题（统一句式）
  url: string;
  source: 'github' | 'clawhub';
  install?: string;
  caseUrl?: string;
  updated: string;
  stars: number;
  downloads?: number; // ClawHub 分项下载量（官方 API）
}

export interface SiteStats {
  skillCount: number;
  totalDownloads: number;
  dataDate: string; // 数据截至（构建日期）
  live: boolean; // GitHub/ClawHub API 是否拉取成功
}

const USERNAME = 'bonniegeng-max';

// 精选展示文案：统一「解决什么问题」句式。
// caseUrl 挂案例链接；install 不写则按 ClawHub 规则自动推导。
const CURATED: Record<
  string,
  { displayName: string; description: string; caseUrl?: string; install?: string }
> = {
  'poetry-resonance': {
    displayName: '诗遇 · poetry-resonance',
    description:
      '解决「学了诗却用不上」的问题：把唐诗宋词和真实生活场景连起来——朋友圈 / 小红书诗词文案、诗句拆解、节气日签、遗忘曲线背诗。',
  },
  'md-out-of-chat': {
    displayName: 'md-out-of-chat',
    description:
      '解决「AI 写的 .md 在微信 / 飞书里排版崩」的问题：一键把 Markdown 转成手机能看、能复制、能分享的网页或长图，表格不再错位。',
  },
  'text-to-comic': {
    displayName: 'text-to-comic',
    description:
      '解决「文字没有画面感」的问题：把口述文字变成漫画 / 绘本 / 信息图——自动判断内容类型、匹配 11 种风格，还管主角一致性、分镜与合成。日记、游记都能画。',
    install: 'openclaw skills install @bonniegeng-max/text-to-comic',
  },
  'emoji-sticker-cn': {
    displayName: 'emoji-sticker-cn',
    description:
      '解决「想做表情包但怕踩红线」的问题：微信 / 小红书 / 抖音的尺寸硬约束、违禁词校验、规则巡检更新，外加零成本程序化动画 GIF——中文平台合规表情包的完整链路。',
  },
  'priority-coach': {
    displayName: 'priority-coach',
    description:
      '解决「忙但空、找不到重点」的问题：一个温和不压迫的个人成长教练，用 5 个问题收敛出当前最该优先的 3 件事——时间管理的核心不是做更多，是定优先级。',
  },
  'weread-socrates': {
    displayName: 'weread-socrates',
    description:
      '解决「读完就忘、划了一堆线却没读进去」的问题：对接微信读书的 AI 伴读教练——全书结构思维导图（非虚构拆框架 / 虚构理人物关系）、万人热门划线对照，再用苏格拉底式 5 轮追问把一本书读透，笔记一键导出。',
  },
  'museum-explorer': {
    displayName: 'museum-explorer',
    description:
      '解决「看展走马观花、看完就忘」的问题：行前核验票价与开放时间、生成重点展品策展卡；行中极简核对清单；行后文物打卡印章 + 可打印电子手帐。展品史实双来源交叉核验，平时积累、下次看展直接复用。',
  },
  'future-journal': {
    displayName: '未来日记 · future-journal',
    description:
      '解决「日记写着写着变成流水账」的问题：每天三分钟，先描一句引导句，再用过去时写下希望发生的事——49 天一轮的暖纸手账，单文件离线可用，可选端到端加密跨设备同步。',
  },
  'concept-radar-skill': {
    displayName: 'concept-radar-skill',
    description:
      '解决「追概念追成 FOMO」的问题：用证据支撑做概念发现——反 FOMO 过滤、说人话简报、范式对比卡，每个结论都带来源引用，帮你在追不追之间做判断。',
  },
  'stoic-coach': {
    displayName: 'stoic-coach',
    description:
      '解决「被焦虑、反刍、自我怀疑困住」的问题：一分钟斯多葛控制圈自检，分清哪些是自己能控制的；晨间预演、晚间复盘与情境练习，慢慢积累出属于自己的困境地图。',
  },
};

// 纯 ClawHub-only 的 skill（GitHub 上没有同名仓库）的手写兜底文案。
// 展示名 / 摘要优先用 ClawHub API 返回值，这里只作 API 失败时的兜底。
const CLAWHUB: Record<string, { displayName: string; description: string; caseUrl?: string }> = {
  'stoic-coach': {
    displayName: 'stoic-coach',
    description:
      '解决「被焦虑、反刍、自我怀疑困住、想分清哪些是自己能控制的」的问题：教练式逐问引导完成 26 项斯多葛刻意练习，长期记录与「看清」，慢慢积累出属于自己的困境地图。',
  },
    'text-to-infographic': {
    displayName: 'text-to-infographic',
    description:
      '解决「复杂信息说不清」的问题：把工作流、框架、分析笔记一键转成可嵌入飞书文档的单页信息图——输出结构化 plan，渲染自包含 HTML，也可导出 PNG/SVG。',
  },

};

// ClawHub 全量 slug 清单。ClawHub 没有 publisher 级公开列表 API，slug 需手工登记，
// 新发布 skill 后要来这里补一行（对照 clawhub.ai/<username> 主页的 Skills 数）。
// 2026-09-12 与 dashboard 核对 18 个；2026-09-13 新增 xiaohongshu-prohibited-words（第 19 个）；
// 2026-09-21 新增 future-journal（第 20 个）。
const CLAWHUB_SLUGS: string[] = [
  'beauty-offer-auditor',
  'poetry-resonance',
  'github-actions-clawhub-doctor',
  'text-to-comic',
  'text-to-infographic',
  'md-out-of-chat',
  'museum-explorer',
  'skill-portfolio-growth-audit',
  'skill-positioning-audit',
  'skill-publish-readiness',
  'release-proof-builder',
  'emoji-sticker-cn',
  'stoic-coach',
  'skill-summary-rewriter',
  'weread-socrates',
  'free-course-share',
  'priority-coach',
  'video-digest',
  'xiaohongshu-prohibited-words',
  'future-journal',
];

// 非 skill / 非作品的仓库：站点自身源码、profile 仓库、GitHub Pages 仓库，
// 以及暂不展示的仓库（price-gap-map / token-optimizer，Bonnie 2026-09-12 定：描述补齐后再上）
function isExcludedRepo(name: string, username: string): boolean {
  return (
    name === username ||
    name === 'bonnie-personal-site' ||
    name.endsWith('.github.io') ||
    name === 'price-gap-map' ||
    name === 'token-optimizer'
  );
}

// 构建时拉 GitHub 公开仓库
async function getGitHubSkills(username: string): Promise<Skill[]> {
  try {
    const r = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      { headers: { Accept: 'application/vnd.github+json', 'User-Agent': username } }
    );
    if (!r.ok) throw new Error('github ' + r.status);
    const repos: any[] = await r.json();
    return repos
      .filter((x) => !isExcludedRepo(x.name, username) && x.size > 0)
      .map((x) => {
        const cur = CURATED[x.name];
        return {
          name: x.name,
          displayName: cur?.displayName ?? x.name,
          description: cur?.description ?? x.description ?? 'AI 小工具 / skill。',
          url: x.html_url,
          source: 'github' as const,
          install: cur?.install ?? `openclaw skills install @${username}/${x.name}`,
          caseUrl: cur?.caseUrl,
          updated: (x.pushed_at || '').slice(0, 10),
          stars: x.stargazers_count || 0,
        };
      });
  } catch {
    return [];
  }
}

// 从手写 slug 表生成 ClawHub skill 列表（安装命令按规则推导，无需联网）
function clawHubList(username: string): { slug: string; skill: Skill }[] {
  return Object.entries(CLAWHUB).map(([slug, v]) => {
    const cur = CURATED[slug];
    return {
      slug,
      skill: {
        name: slug,
        displayName: cur?.displayName ?? v.displayName,
        description: cur?.description ?? v.description,
        url: `https://clawhub.ai/${username}/${slug}`,
        source: 'clawhub' as const,
        install: cur?.install ?? `openclaw skills install @${username}/${slug}`,
        caseUrl: cur?.caseUrl ?? v.caseUrl,
        updated: '—',
        stars: 0,
      },
    };
  });
}

// ClawHub 官方分项接口：每个 skill 的展示名、摘要与下载量（公开端点，无需鉴权）。
// 一次拉全量 slug，返回目录 + 累计下载；构建进程内用缓存避免 getSkills/getStats 重复请求。
async function fetchClawHubCatalog(
  username: string
): Promise<{ skills: Skill[]; totalDownloads: number }> {
  const skills: Skill[] = [];
  await Promise.all(
    CLAWHUB_SLUGS.map(async (slug) => {
      const cur = CURATED[slug];
      const fb = CLAWHUB[slug];
      const base: Skill = {
        name: slug,
        displayName: cur?.displayName ?? fb?.displayName ?? slug,
        description: cur?.description ?? fb?.description ?? 'AI 小工具 / skill。',
        url: `https://clawhub.ai/${username}/${slug}`,
        source: 'clawhub',
        install: cur?.install ?? `openclaw skills install @${username}/${slug}`,
        caseUrl: cur?.caseUrl ?? fb?.caseUrl,
        updated: '—',
        stars: 0,
      };
      try {
        const r = await fetch(`https://clawhub.ai/api/v1/skills/${slug}`, {
          headers: { Accept: 'application/json', 'User-Agent': username },
        });
        if (!r.ok) throw new Error('clawhub ' + r.status);
        const d = await r.json();
        const s = d?.skill ?? {};
        const st = s.stats ?? {};
        const updated =
          typeof s.updatedAt === 'number' ? new Date(s.updatedAt).toISOString().slice(0, 10) : '—';
        skills.push({
          ...base,
          displayName: cur?.displayName ?? fb?.displayName ?? s.displayName ?? slug,
          description: cur?.description ?? fb?.description ?? s.summary ?? base.description,
          updated,
          stars: st.stars || 0,
          downloads: typeof st.downloads === 'number' ? st.downloads : 0,
        });
      } catch {
        // 单个失败用兜底文案，下载量计 0，不影响其他
        skills.push(base);
      }
    })
  );
  const totalDownloads = skills.reduce((a, s) => a + (s.downloads || 0), 0);
  return { skills, totalDownloads };
}

let catalogCache: Promise<{ skills: Skill[]; totalDownloads: number }> | null = null;
function getClawHubCatalog(username: string) {
  if (!catalogCache) catalogCache = fetchClawHubCatalog(username);
  return catalogCache;
}

// 排序：ClawHub 下载数倒序；无下载数的按更新时间倒序垫底
function sortSkills(list: Skill[]): Skill[] {
  return [...list].sort((a, b) => {
    const da = a.downloads || 0;
    const db = b.downloads || 0;
    if (da !== db) return db - da;
    return (b.updated || '').localeCompare(a.updated || '');
  });
}

// 合并 GitHub + ClawHub；同名 skill 以 GitHub 为准去重，ClawHub 下载量补给 GitHub 条目
export async function getSkills(username = USERNAME): Promise<Skill[]> {
  const [{ skills: chAll }, ghRaw] = await Promise.all([
    getClawHubCatalog(username),
    getGitHubSkills(username),
  ]);
  const gh = ghRaw;
  const ghNames = new Set(gh.map((s) => s.name.toLowerCase()));
  for (const s of gh) {
    const match = chAll.find((c) => c.name.toLowerCase() === s.name.toLowerCase());
    if (match?.downloads) s.downloads = match.downloads;
    // GitHub 仓库没写描述时，借用 ClawHub 的摘要（避免站点出现占位文案）
    const placeholder = 'AI 小工具 / skill。';
    if ((!s.description || s.description === placeholder) && match?.description) {
      s.description = match.description;
    }
  }
  const ch = chAll.filter((s) => !ghNames.has(s.name.toLowerCase()));
  const merged = [...gh, ...ch];
  if (!merged.length) return sortSkills(fallback(username));
  return sortSkills(merged);
}

// 站点统计：skill 数、累计下载（ClawHub 全量 18 项之和）、数据截至日期
export async function getStats(username = USERNAME): Promise<SiteStats> {
  const [{ skills, totalDownloads }, gh] = await Promise.all([
    getClawHubCatalog(username),
    getGitHubSkills(username),
  ]);
  const mergedCount = new Set([
    ...gh.map((s) => s.name.toLowerCase()),
    ...skills.map((s) => s.name.toLowerCase()),
  ]).size;
  return {
    skillCount: mergedCount,
    totalDownloads,
    dataDate: new Date().toISOString().slice(0, 10),
    live: true,
  };
}

// 离线兜底：GitHub API 不可用时，仍展示精选 skill，保证站点永远能构建
function fallback(username: string): Skill[] {
  const ghFallback: Skill[] = Object.entries(CURATED).map(([name, v]) => ({
    name,
    displayName: v.displayName,
    description: v.description,
    url: `https://github.com/${username}/${name}`,
    source: 'github' as const,
    install: v.install ?? `openclaw skills install @${username}/${name}`,
    caseUrl: v.caseUrl,
    updated: '2026-08-29',
    stars: 0,
  }));
  const chFallback = clawHubList(username).map(({ skill }) => skill);
  const seen = new Set<string>();
  return [...ghFallback, ...chFallback].filter((s) => {
    const k = s.name.toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
