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
  {
  date: '2026-09-01',
  tag: '公众号 · skill 实录',
  title: '忙但空的时候，我给 AI 写了一个不催我的教练',
  desc: '番茄钟和 Notion 的隐含假设是「你还不够努力」。照着《会赚时间的妈妈》的 6×2 优先级法，做了一个反着来的教练 skill：不排满一天、先接住人——温柔不是装饰，是功能。',
  url: 'https://mp.weixin.qq.com/s/dAGTVmv3QnLlRi3bdNP2fQ',
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
    title: '拼车不是顿悟出来的，是被预算逼出来的结构创新',
    body: '后补贴时代毛利卡严、预算少仍要增长，一分钱掰两半花——被迫想不靠钱的辙。\n\n• 机制本质：售卖单位从「一车一单」拆成「一车一座位」；但上帝视角的顺路 ≠ 用户体感的绕路，兑现全看匹配机制\n• 弯路一：照搬 Uber 拼车的一口价（拼成拼不成都是一口价）——司机不愿接、乘客不愿拼成、平台不赚钱；国外跑得通靠人力成本高，国内客单低、车型差异小，照搬必死\n• 弯路二：早期两口价只能便宜几块，确定性却差很多，价差打不出来\n• 迭代出解法：未拼成＝快车基线不亏，拼成＝确定低价——损失厌恶消不掉，但能决定它朝哪个方向想\n• 战区验证：对手纯补贴亏本，我们的补贴走拼车形态发出——拼成价格越低 → 用的人越多 → 拼成率越高 → 计费比越低，飞轮转起来\n• 推广打法：不正面硬碰，按城市结构找适配场景——密度高、网络效应强的城市才是拼车主场，做 showcase 再复制',
    takeaway: '低价分两种：挤压型停在价格战，效率型靠结构优化转起飞轮。',
  },
  {
    era: '治理期 · 批量起号与生态 hack 治理',
    title: '打掉一个账号没用，要看见「这一窝」',
    body: '现象：一批伪装成普通用户的账号在批量发布低质内容。它们不是孤立违规——背后是有组织地批量起号、统一供给内容。\n\n• 定性：设备/IP 关联这类硬手段只能覆盖一小波职业黑产；更大的主体混在正常用户里，破案钥匙是聚集性\n• 视角切换：单点打不干净——打掉一个号，相似的一批还在发。把「对内容的理解」翻译成机器可执行的判据，按内容聚集的维度去识别和处置，再对账号分层处理\n• 难点：合规创作（如影视二创）和违规群控在内容层面高度相似——内容相似 ≠ 动机相同。打击力度与误伤风险之间的分寸，才是这类治理真正的功夫所在\n• 边界：「组织性」的认定是最难的部分，项目后期争议加剧，最终由新的治理形态接棒。复盘：易混淆的细分场景，本可在立项早期识别出来',
    takeaway: '「违不违规」看单条内容，「打多重」看簇背后的动机与手段。',
  },
  {
    era: '当前 · 治理业务里的 AI 协作',
    title: '把整条治理工作流，重做成三条自动流水线',
    body: '双链路分工：大模型管语义理解，小模型管精确执行。策略评估、Prompt 迭代、小模型训练三条流水线各自闭环又互相喂养——评审数据回流为训练正例。机审只作人审的辅助信号；Prompt 改动全部结构化可回溯；模型在高精度硬约束下自动准入，发布后先空跑再送处置。',
    takeaway: '以评促建、以建带评——流水线不替代人，是把人从执行挪到决策。',
    diagram: 'pipelines',
  },
];

// 「专业资质」：能佐证专业能力的硬证书，正经展示（数据驱动 · 叙事偏能力）。
// 文案延续"自驱力 / 学习力"叙事——考证不是为了挂证，是为了把某套框架装进脑子。
export interface Credential {
  name: string; // 证书名称
  issuer: string; // 发证机构
  date: string; // 发证 / 批准日期
  img: string; // 马赛克打码后的证书图
  story: string; // 一句话：为什么考、学到什么（自驱力叙事）
  takeaway: string; // 一句话方法论 / 价值落点
}

export const CREDENTIALS: Credential[] = [
  {
    name: 'Project Management Professional (PMP)',
    issuer: 'Project Management Institute · PMI',
    date: '2023-08',
    img: '/certs/cert-pmp.png',
    story: '十年项目管理实战下来，很多动作是"手感"不是"章法"。2023 年考下这张国际证，把散落的手感补成 PMI 的体系框架——经验先于证书，证书把经验校准成体系。',
    takeaway: '经验是散点，体系是把散点连成线的那根绳。',
  },
  {
    name: '信息系统项目管理师（高级）',
    issuer: '人力资源和社会保障部 · 工业和信息化部',
    date: '2024-05',
    img: '/certs/ruankao-project-manager.jpg',
    story: '花半年啃下国家软考高项——不为挂证，为把项目管理的完整框架装进脑子。范围、进度、风险、干系人，那套体系后来在带项目时成了底气。',
    takeaway: '软技能也可以"系统地学"——知识不落地，不叫掌握。',
  },
  {
    name: '大模型应用开发工程师（中级）',
    issuer: '工业和信息化部人才交流中心 · IITC',
    date: '2026-05',
    img: '/certs/llm-app-engineer.jpg',
    story: 'AI 迭代太快，与其等工具变得好用，不如主动去摸它背后的工程逻辑。从 prompt 工程到 RAG 到评测，这个证是过程证明，不是终点。',
    takeaway: '等风口不如自己先站上去——学习力是比技能更稳的护城河。',
  },
  {
    name: '数字化数据分析师（中级）',
    issuer: '工业和信息化部人才交流中心 · IITC',
    date: '2025-01',
    img: '/certs/data-analyst.jpg',
    story: '从 Excel 到 SQL 再到业务指标体系，考这个证是为了让"用数据说话"不只是口头禅——拿数据推结论，和拿经验拍脑袋，是两种决策。',
    takeaway: '"用数据说话"不是立场，是一套可习得的动作。',
  },
];

// 「证照收藏」：与工作无关、纯因好奇去考的，放页面尾部轻松呈现。
// 文案走"学习痕迹"的轻松叙事，体现自驱力与好奇心，但不过度自夸。
export interface CollectionItem {
  name: string; // 证书 / 认证名称
  issuer: string;
  date: string;
  img: string;
  story: string; // 轻松版文案，带人味
}

export const COLLECTION: CollectionItem[] = [
  {
    name: '人工智能训练师（初级）',
    issuer: '百度智能云',
    date: '2024-08',
    img: '/certs/ai-trainer-baidu.jpg',
    story: '大模型刚火起来那阵，别人都在问"这玩意儿能干嘛"，我在查"怎么训练一个"。虽是入门级，但确实记录了那段追风日子的好奇心。',
  },
];
