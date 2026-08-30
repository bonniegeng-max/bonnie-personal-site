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
      '解决「学了诗却用不上」的问题：把唐诗宋词和真实生活场景连起来——朋友圈 / 小红书诗词文案、诗句拆解、节气日签、遗忘曲线背诗。首发 GitHub + ClawHub，上线首周即获几十次下载。',
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
    caseUrl: 'https://www.xiaohongshu.com/discovery/item/6a6ff035000000003300f3c3',
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
};

// 纯 ClawHub-only 的 skill（GitHub 上没有同名仓库）在此手写登记。
const CLAWHUB: Record<string, { displayName: string; description: string; caseUrl?: string }> = {
  'stoic-coach': {
    displayName: 'stoic-coach',
    description:
      '解决「被焦虑、反刍、自我怀疑困住、想分清哪些是自己能控制的」的问题：教练式逐问引导完成 26 项斯多葛刻意练习，长期记录与「看清」，慢慢积累出属于自己的困境地图。',
  },
};

// 非 skill / 非作品的仓库：站点自身源码、profile 仓库、GitHub Pages 仓库
function isExcludedRepo(name: string, username: string): boolean {
  return name === username || name === 'bonnie-personal-site' || name.endsWith('.github.io');
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

// ClawHub 官方 API：查询每个 skill 的分项下载量（公开端点，无需鉴权）。
async function getClawHubDownloads(
  username: string,
  slugs: string[]
): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  await Promise.all(
    slugs.map(async (slug) => {
      try {
        const r = await fetch(`https://clawhub.ai/api/v1/skills/${slug}`, {
          headers: { Accept: 'application/json', 'User-Agent': username },
        });
        if (!r.ok) return;
        const d = await r.json();
        const dl = d?.skill?.stats?.downloads;
        if (typeof dl === 'number' && dl > 0) out[slug] = dl;
      } catch {
        // 单个失败跳过，不影响其他
      }
    })
  );
  return out;
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

// 合并 GitHub + ClawHub；同名 skill 以 GitHub 为准去重
export async function getSkills(username = USERNAME): Promise<Skill[]> {
  const gh = await getGitHubSkills(username);
  const ghNames = new Set(gh.map((s) => s.name.toLowerCase()));
  const ch = clawHubList(username)
    .filter(({ slug }) => !ghNames.has(slug))
    .map(({ skill }) => skill);
  const merged = [...gh, ...ch];
  if (!merged.length) return sortSkills(fallback(username));
  const dl = await getClawHubDownloads(username, [
    ...Object.keys(CURATED),
    ...Object.keys(CLAWHUB),
  ]);
  for (const s of merged) {
    if (dl[s.name] !== undefined) s.downloads = dl[s.name];
  }
  return sortSkills(merged);
}

// 站点统计：skill 数、累计下载、数据截至日期（用于首屏数字行与页脚）
export async function getStats(username = USERNAME): Promise<SiteStats> {
  const skills = await getSkills(username);
  const totalDownloads = skills.reduce((a, s) => a + (s.downloads || 0), 0);
  return {
    skillCount: skills.length,
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
