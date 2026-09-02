// 站点内容数据：公众号文章、一条主线时间线、方法论案例。
// 简历数据脱敏补充进来时，改 TIMELINE 各项的 note 字段即可。

export interface Article {
  date: string;
  tag: string;
  title: string;
  desc: string;
  url: string;
  featured?: boolean; // 旗舰：合作方信任的关键证据，置顶
}

export const ARTICLES: Article[] = [
  {
    date: '2026-08-04',
    tag: '公众号 · Context Engineering',
    title: '给 AI 助手做了一次体检，发现体检仪器是坏的',
    desc: '一个非工程师运营，用 378 次模型调用给 AI 助手的上下文文件做消融测试，揪出三个「长得像真结论」的假结论。核心一句：你塞进上下文的东西，模型真的在用吗？',
    url: 'https://mp.weixin.qq.com/s/Trr6g7fA32nSuYXp3Rvi0g',
    featured: true,
  },
  {
    date: '2026-08-24',
    tag: '公众号 · skill 实录',
    title: '一本翻出来的李白，变成了每晚九点响的闹钟',
    desc: '从翻出一本旧李白诗集，到用 AI 把「生活场景」和「学过的诗」连起来——记录「诗遇」从一个 nightly routine 长成可发布 skill 的全过程。',
    url: 'https://mp.weixin.qq.com/s/6cjNWyjWlha-ZuqsNeXY7A',
  },
];

export interface TimelineItem {
  yr: string;
  tx: string;
  note?: string; // 脱敏量级数据（待简历补充后填入，如"亿级 DAU 平台"）
  current?: boolean;
}

export const TIMELINE: TimelineItem[] = [
  {
    yr: '入行',
    tx: '市场营销科班出身，进入运营',
  },
  {
    yr: '前 6 年',
    tx: '增长策略 · 本地生活平台（美团点评 → 滴滴）：成熟期平台的精细化 / 差异化运营——数据到位之后，靠人的隐性经验继续拿增长',
    note: '亿级 DAU 生活服务平台 · 独立负责全国近 1/4 区域，年复合增长远超大盘',
  },
  {
    yr: '近 4 年',
    tx: '内容平台 · 内容治理（生态调控）：把「对内容的理解」翻译成机器懂的语言——描述场景 → 特征组合 → 识别',
    note: '头部内容平台 · 主导大模型接入治理链路，处置覆盖率从不足 1% 提至 85% 量级 · 机器批量识别释放 20+ 人力',
  },
  {
    yr: '近 1–2 年',
    tx: '系统尝试 AI 协作，把十年运营经验用 AI 重新做一遍',
  },
  {
    yr: '当前',
    tx: '把运营经验做成可复用的 skill · 内容系统化写作 · 本站持续迭代',
    current: true,
  },
];

// 「正在学」条目（learn in public：过程也可见，想到就补一条）
export interface LearningItem {
  what: string; // 在学什么
  why: string; // 为什么学 / 想解决什么
  status: string; // 进度或当前状态
}

export const LEARNING: LearningItem[] = [
  {
    what: '模型评估体系',
    why: 'LLM 特有的那套评估：幻觉率、有用性、human eval——正好接着消融测试那篇往下写',
    status: '搭框架中',
  },
  {
    what: 'RAG 应用开发',
    why: '接真实数据源的知识库问答，把「人↔机器翻译」从治理场景搬到自己的项目里',
    status: '筹备中',
  },
  {
    what: '部署与发布链路',
    why: 'Docker、域名、上线——本站就是练习场',
    status: '边做边学',
  },
];

// 「在这里找到我」渠道矩阵：每卡一句"这里发什么"
export interface Channel {
  name: string;
  what: string; // 这个渠道发什么
  action: string; // CTA 文案
  url?: string;
  qr?: boolean; // 走二维码
  qrSrc?: string; // 自定义二维码图片路径（默认公众号 /qrcode-wechat.png）
}

export const CHANNELS: Channel[] = [
  {
    name: '公众号 · 巴扎嘿的探索记录',
    what: 'AI 实操长文：消融测试、做 skill 的全过程，写「怎么想的」',
    action: '微信扫码关注',
    qr: true,
  },
  {
    name: '小红书 · 巴扎嘿',
    what: '日用 AI 场景与结果：「我用 AI 做了 X」系列',
    action: '扫码关注',
    qr: true,
    qrSrc: '/xiaohongshu-qr.jpg',
    url: 'https://www.xiaohongshu.com/user/profile/101502465',
  },
  {
    name: 'GitHub · bonniegeng-max',
    what: '全部开源 skill 源码，ClawHub 可一键安装',
    action: '看仓库',
    url: 'https://github.com/bonniegeng-max',
  },
  {
    name: '邮箱',
    what: '合作咨询、经验交流，通常两个工作日内回复',
    action: '写封邮件',
    url: 'mailto:littlebonnie.geng@qq.com',
  },
];

// 「更多面」兴趣小卡（works 子页尾部，轻量呈现）
export interface InterestItem {
  name: string;
  desc: string;
  note?: string;
  url?: string;
}

export const INTERESTS: InterestItem[] = [
  {
    name: '读书',
    desc: '读得杂：绘本漫画、杂文散文小说，不装专业',
    note: '书评将陆续沉淀在这里',
  },
  {
    name: '漫画日记',
    desc: '用自己做的 text-to-comic skill 把生活画成漫画',
    url: 'https://clawhub.ai/bonniegeng-max/text-to-comic',
  },
  {
    name: '小游戏',
    desc: 'Q 萌麻将 · 消消乐——练编程顺手的副产品',
  },
  {
    name: '像素冒险主页',
    desc: '跟着老师做的 RPG 打卡主页——把日常任务接成冒险，完成 +20 EXP，攒满 100 升级',
    url: 'https://workbuddy.link/p/4KfGsZ4mEo8vxNTi2bw8Py',
  },
];

export interface MethodCase {
  era: string;
  title: string;
  body: string;
  takeaway: string; // 一句话方法论
  diagram?: 'pipelines'; // 第三卡：三条流水线示意图（通栏卡，左文右图）
}

// 方法论案例卡（已按简历素材脱敏增强：去指标名、数字取量级；工作内工具不展示，只讲逻辑）
export const METHOD_CASES: MethodCase[] = [
  {
    era: '增长期 · 成熟业务的机制迭代',
    title: '双边都不愿接的单，症结不在价格，在确定性',
    body: '拼车单增长停滞，诊断下来：问题不在补贴力度，在司乘两端的确定性。\n\n• 乘客要的是低价、不是拼——盼着「最好别拼上、白享低价」，平台越推越亏\n• 司机一次接两三单只赚一单的钱，没有多劳多得，自然不接\n• 解法：司机端让利、多拼多得；乘客端两种一口价——拼上更便宜，没拼上也不比快车吃亏\n• 关键翻转：把「怕拼不上」的损失厌恶，变成「拼上就是赚」',
    takeaway: '双边市场的瓶颈，往往不是补贴力度，是两端的确定性设计。',
  },
  {
    era: '治理期 · 大模型接入内容治理链路',
    title: '把「人的判断」翻译成「机器的规则」，再用大模型重做一遍',
    body: '内容生态面对海量内容与人工覆盖的天花板。\n\n• 翻译链路：描述场景 → 特征组合 → 识别策略\n• 大模型管语义理解，小模型管精确执行\n• 覆盖率从不足 1% 到 85% 量级，释放 20+ 人力\n• 再把治理流程本身用 AI 重做：抽样→评估→归档自动化',
    takeaway: '这条「人↔机器翻译」的肌肉，正是今天做 AI 协作的底子。',
  },
  {
    era: '当前 · 治理业务里的 AI 协作',
    title: '把整条治理工作流，重做成三条自动流水线',
    body: '策略评估、Prompt 迭代、小模型训练，各自闭环又互相喂养——评审数据回流为训练正例。机审只作人审的辅助信号；Prompt 改动全部结构化可回溯；模型在高精度硬约束下自动准入，发布后先空跑再送处置。',
    takeaway: '以评促建、以建带评——流水线不替代人，是把人从执行挪到决策。',
    diagram: 'pipelines',
  },
];
