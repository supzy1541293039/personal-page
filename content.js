/* ============================================================
   content.js —— 全站唯一内容数据源
   ------------------------------------------------------------
   三个页面（index / works / resume）的所有文字都从这里读。
   你只需要改这个文件，不用碰 HTML。

   带 TODO 的地方是需要你填真实内容的。
   删掉 TODO 注释不影响运行。
   ============================================================ */

window.SITE = {

  /* ---------- 0. 媒体资源根（视频 / 封面图） -------------------
     决定视频和封面图从哪里加载。字体、图标等小文件不受影响，
     始终跟着网页走（GitHub Pages），无需上传 COS。

     两种用法：
     A. 本地 / GitHub Pages 自带资源（默认）
        assetBase: ''
        下面各 video / poster 字段保持 'assets/videos/xxx.mp4' 即可。

     B. 视频放腾讯云 COS（推荐用于大视频）
        assetBase: 'https://你的桶名-1234567890.cos.ap-guangzhou.myqcloud.com'
        —— 末尾不要加斜杠。
        —— 上传时保持 assets/ 目录结构（assets/videos/、assets/images/），
           代码会自动拼成 桶域名 + / + assets/videos/xxx.mp4。

     另外：任何字段如果直接写完整 http(s) 链接，会原样使用、
     不受 assetBase 影响。适合只有个别文件放 COS 的情况。
  ------------------------------------------------------------ */
  assetBase: '',

  /* ---------- 1. 身份与定位 ---------------------------------- */
  profile: {
    // TODO: 换成你的真名
    name: '你的名字',
    // 页眉左上角的小标记，建议用姓名首字母，2 个字符最好看
    mark: 'YN',
    // 首屏大标题 —— 这是全站最重要的一句话。
    // 原则：说你能交付什么，而不是你是谁。HR 前 3 秒只看这句。
    // TODO: 按你的真实强项改写
    headline: '把 brief 做成<em>能投的片子</em>',
    // 副标题：一句话说清你的方法和边界
    subline: '我用 AI 生成 + 传统剪辑调色的混合流程做广告片和短剧。从脚本、分镜、镜头生成到成片交付，一个人能跑完整条链路。',
    // 职位定位，会出现在页眉下方和简历页
    positioning: 'AIGC 视频创作 · 广告 / 短剧',
    // 首屏底部的关键词，用 · 分隔的短标签
    keywords: ['广告片', '竖屏短剧', 'AI 分镜', '人物一致性', '成片调色'],
    // 求职状态，显示在联系区
    availability: '开放机会 · 可即时到岗',
  },

  /* ---------- 2. 数据条 -------------------------------------
     换掉了原来「10+项目 / 3年经验」这类不可验证的写法。
     value 里的数字会做 count-up 动画；unit 是数字后面的单位。
     TODO: 全部换成你的真实数字，宁少勿虚。
  ---------------------------------------------------------- */
  stats: [
    { value: 12, unit: '支', label: '已交付成片', note: '广告 6 / 短剧 4 / 实验 2' },
    { value: 26, unit: '分钟', label: '累计成片时长', note: '含竖屏与横屏' },
    { value: 9, unit: '个', label: '打通的工具链', note: '生成到后期全流程' },
    { value: 48, unit: '小时', label: '最快交付周期', note: '从 brief 到可投放' },
  ],

  /* ---------- 3. 自述 --------------------------------------- */
  statement: {
    eyebrow: '我怎么工作',
    title: '模型只负责出画面，<em>片子好不好是判断力的事。</em>',
    // TODO: 用你自己的话重写，这段决定对方觉得你是"会用工具的人"还是"能做片子的人"
    body: 'AI 让出画面变得很便宜，也让平庸的画面变得更多。我的工作重心不在抽卡，而在抽卡之前和之后：先把 brief 拆成能拍的镜头，再从几十条素材里挑出情绪对得上的那几条，最后靠剪辑节奏和调色把它们缝成一支完整的片子。',
    quote: '我对最终成片负责，不只对我那一段负责。',
    // TODO: 换成你的邮箱
    email: 'your@email.com',
  },

  /* ---------- 4. 工作流 ------------------------------------
     这个板块是给广告公司看的：他们真正关心的不是你会几个模型，
     而是你能不能稳定产能、能不能配合他们的流程。
     TODO: 按你的真实流程调整步骤和工具
  ---------------------------------------------------------- */
  workflow: {
    eyebrow: '生产流程',
    title: '一条能重复跑的链路，<em>不靠运气。</em>',
    aside: '每一步都有明确的产出物和判断标准，中途可以插入客户反馈，不用推翻重来。',
    steps: [
      { no: '01', title: '拆 brief', out: '一页策略 + 卖点排序', tool: '文档' },
      { no: '02', title: '写脚本', out: '分场景台本 + 时长预算', tool: 'GPT / 人工改写' },
      { no: '03', title: '出分镜', out: '关键帧参考图 + 镜头表', tool: 'Midjourney / 即梦' },
      { no: '04', title: '生成镜头', out: '每镜 3—5 条候选', tool: '可灵 / 即梦 / Runway' },
      { no: '05', title: '筛选与剪辑', out: '粗剪 + 节奏定版', tool: 'Premiere / 剪映' },
      { no: '06', title: '后期交付', out: '调色 + 声音 + 多尺寸导出', tool: '达芬奇 / AE' },
    ],
  },

  /* ---------- 5. 作品分类 ----------------------------------
     id 要和下面每个作品的 category 对应。
  ---------------------------------------------------------- */
  categories: [
    { id: 'all', label: '全部', note: '' },
    { id: 'ad', label: '广告', note: '品牌与产品片，看转化和过审' },
    { id: 'drama', label: '短剧', note: '连续叙事，看人物一致性与情绪节奏' },
    { id: 'lab', label: '实验', note: '技术验证与风格探索' },
  ],

  /* ---------- 6. 作品 --------------------------------------
     现在挂的是占位素材（stock 视频），真作品到位后：
       1) 把 mp4 放到 assets/videos/ 或改成 COS 外链
       2) 改 video 字段 + 文字，不用动 HTML
     duration 留空会自动从视频元数据读取真实时长，建议留空。
     featured: true 的作品在首页会占双倍宽度，只设一支。

     process 是弹窗里的「制作链路」，prompts 是关键提示词。
     ⚠️ 敢把 prompt 和分镜贴出来，是 AIGC 岗最有效的可信度证明。
        这是你和"只会抽卡的人"的分水岭，强烈建议认真填。
  ---------------------------------------------------------- */
  works: [
    {
      id: 'work-01',
      title: '仿实拍风格短片',
      category: 'drama',
      featured: true,
      year: '2026',
      client: '自主命题',
      role: '导演 / 分镜 / 生成 / 剪辑 / 调色',
      video: 'assets/videos/work-01.mp4',
      poster: '',
      duration: '',
      summary: '围绕人物关系和场景氛围组织画面，用镜头节奏和情绪衔接完成一段完整表达。全片无实拍素材。',
      brief: 'TODO：这支片子要解决什么问题？给谁看？想让人看完记住什么？一到两句写清。',
      result: 'TODO：可验证的结果。比如完播率、平台推荐、客户复购、比稿结果。没有数据就写成片规格和交付周期。',
      tools: ['可灵', 'Midjourney', 'Premiere', '达芬奇'],
      tags: ['代表作', '仿实拍', '人物一致性'],
      process: [
        { no: '01', title: '角色锁定', body: 'TODO：怎么保证同一个人在不同镜头里长得一样？用了什么参考图/垫图/换脸策略？' },
        { no: '02', title: '分镜与运镜', body: 'TODO：镜头表怎么排的？为什么这样切？' },
        { no: '03', title: '生成与筛选', body: 'TODO：一共生成多少条，留了几条，筛选标准是什么？' },
        { no: '04', title: '后期缝合', body: 'TODO：调色统一了什么？声音怎么处理的？' },
      ],
      prompts: [
        // TODO: 贴 1—2 条真实的关键 prompt，这比任何形容词都有说服力
        { model: '可灵 1.6', text: 'TODO: 把你真实用过的关键提示词贴在这里，包括镜头运动、光线、镜头焦段等描述。' },
      ],
      gallery: [
        { src: 'assets/images/hero-poster.jpg', caption: '占位图 · TODO：换成分镜表或关键帧对比' },
      ],
    },
    {
      id: 'work-02',
      title: 'TODO：广告片名称',
      category: 'ad',
      featured: false,
      year: '2026',
      client: 'TODO：品牌方或自主命题',
      role: 'TODO：你在这支片里做了什么',
      video: 'assets/videos/work-02.mp4',
      poster: '',
      duration: '',
      summary: 'TODO：一句话说清这支片卖什么、用什么方式卖。',
      brief: 'TODO：客户诉求 / 命题。',
      result: 'TODO：投放数据或交付结果。',
      tools: ['即梦', 'AE'],
      tags: ['产品片'],
      process: [
        { no: '01', title: 'TODO：步骤名', body: 'TODO：这一步你做了什么，判断标准是什么。' },
      ],
      prompts: [],
      gallery: [],
    },
    {
      id: 'work-03',
      title: 'TODO：作品名称',
      category: 'lab',
      featured: false,
      year: '2026',
      client: '技术验证',
      role: 'TODO',
      video: 'assets/videos/work-03.mp4',
      poster: '',
      duration: '',
      summary: 'TODO：验证了什么技术问题，结论是什么。',
      brief: '',
      result: '',
      tools: ['Runway'],
      tags: ['实验'],
      process: [],
      prompts: [],
      gallery: [],
    },
    {
      id: 'work-04',
      title: 'TODO：作品名称',
      category: 'ad',
      featured: false,
      year: '2025',
      client: 'TODO',
      role: 'TODO',
      video: 'assets/videos/work-04.mp4',
      poster: '',
      duration: '',
      summary: 'TODO：一句话描述。',
      brief: '',
      result: '',
      tools: ['即梦'],
      tags: [],
      process: [],
      prompts: [],
      gallery: [],
    },
    {
      id: 'work-05',
      title: 'TODO：作品名称',
      category: 'drama',
      featured: false,
      year: '2025',
      client: 'TODO',
      role: 'TODO',
      video: 'assets/videos/work-05.mp4',
      poster: '',
      duration: '',
      summary: 'TODO：一句话描述。',
      brief: '',
      result: '',
      tools: ['可灵'],
      tags: [],
      process: [],
      prompts: [],
      gallery: [],
    },
    {
      id: 'work-06',
      title: 'TODO：作品名称',
      category: 'lab',
      featured: false,
      year: '2025',
      client: 'TODO',
      role: 'TODO',
      video: 'assets/videos/work-06.mp4',
      poster: '',
      duration: '',
      summary: 'TODO：一句话描述。',
      brief: '',
      result: '',
      tools: ['Midjourney'],
      tags: [],
      process: [],
      prompts: [],
      gallery: [],
    },
  ],

  /* ---------- 7. 简历 -------------------------------------- */
  resume: {
    // TODO: 全部换成真实信息
    facts: [
      { k: '所在地', v: 'TODO：城市' },
      { k: '求职意向', v: 'AIGC 视频创作（广告 / 短剧）' },
      { k: '到岗时间', v: 'TODO：随时 / 具体日期' },
      { k: '邮箱', v: 'your@email.com' },
    ],
    // 工具矩阵分三级，比一排平铺的标签可信得多
    // level: 1=熟练（能独立出活） 2=掌握（能配合） 3=了解（能上手）
    toolMatrix: [
      { group: '视频生成', items: [
        { name: '可灵', level: 1 }, { name: '即梦', level: 1 },
        { name: 'Runway', level: 2 }, { name: 'Vidu', level: 3 },
      ]},
      { group: '图像与分镜', items: [
        { name: 'Midjourney', level: 1 }, { name: 'Stable Diffusion', level: 2 },
        { name: 'Nano Banana', level: 2 },
      ]},
      { group: '剪辑与后期', items: [
        { name: 'Premiere', level: 1 }, { name: '剪映专业版', level: 1 },
        { name: 'After Effects', level: 2 }, { name: 'DaVinci Resolve', level: 2 },
      ]},
      { group: '声音', items: [
        { name: 'ElevenLabs', level: 2 }, { name: 'Audition', level: 3 },
      ]},
    ],
    // TODO: 换成真实经历。没有正式工作经历就写项目经历，不要编年限。
    experience: [
      {
        period: '2025 — 至今',
        title: 'TODO：项目 / 公司名称',
        role: 'TODO：你的角色',
        body: 'TODO：你负责什么、怎么做的、结果如何。用具体动作和数字，避免"参与了"这种模糊表述。',
        tags: ['TODO'],
      },
      {
        period: '2024 — 2025',
        title: 'TODO：项目 / 公司名称',
        role: 'TODO：你的角色',
        body: 'TODO：同上。',
        tags: ['TODO'],
      },
    ],
    // 简历 PDF 放到 assets/ 下，没有就留空字符串，按钮会自动隐藏
    pdf: '',
  },

  /* ---------- 8. 联系方式 ---------------------------------- */
  contact: {
    eyebrow: '联系',
    title: '想聊片子，<em>随时找我。</em>',
    body: '广告、短剧、或者只是想问问某个镜头怎么做出来的，都欢迎。工作日一般当天回。',
    methods: [
      // TODO: 换成真实信息。不想公开手机号可以整条删掉。
      { label: '邮箱', value: 'your@email.com', copy: 'your@email.com' },
      { label: '微信', value: 'your_wechat', copy: 'your_wechat' },
      { label: '手机', value: '138-0000-0000', copy: '13800000000' },
    ],
  },
};
