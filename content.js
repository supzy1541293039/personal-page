/* ============================================================
   content.js —— 全站唯一内容数据源
   ------------------------------------------------------------
   三个页面（index / works / resume）的所有文字都从这里读。
   你只需要改这个文件，不用碰 HTML。

   带 TODO 的地方是需要你填真实内容的。
   删掉 TODO 注释不影响运行。
   ============================================================ */

window.SITE = {

  /* ---------- 0. 媒体资源根（视频 / 封面 / 工作流图） ---------
     决定视频和封面从哪里加载。字体、图标等小文件不受影响，
     始终跟着网页走（GitHub Pages），无需上传 OSS。

     两种用法：
     A. 本地 / GitHub Pages 自带资源（默认）
        assetBase: ''
        下面各 video / cover / workflow 字段保持相对路径即可。

     B. 视频放阿里云 OSS（推荐用于大视频）
        assetBase: 'https://supzy-portfolio-assets.oss-cn-hangzhou.aliyuncs.com'
        —— 末尾不要加斜杠。
        —— 上传时保持 assets/ 目录结构（assets/videos/、assets/works/{slug}/、assets/images/），
           代码会自动拼成 桶域名 + / + 相对路径。

     任何字段如果直接写完整 http(s) 链接，会原样使用、不受 assetBase 影响。
     注：OSS 默认域名会返回 Content-Disposition: attachment，<video> 标签
     仍能播放（浏览器忽略该头直接拉流），但右键保存会弹下载框。
     后续可绑自定义域名消除该行为（需 ICP 备案）。
  ------------------------------------------------------------ */
  assetBase: 'https://supzy-portfolio-assets.oss-cn-hangzhou.aliyuncs.com',

  /* ---------- 1. 身份与定位 ---------------------------------- */
  profile: {
    // TODO: 换成你的真名
    name: '你的名字',
    // 页眉左上角的小标记，建议用姓名首字母
    mark: 'YN',
    // 首屏大标题 —— 全站最重要的一句话
    // TODO: 按你的真实强项改写
    headline: '把 brief 做成<em>能投的片子</em>',
    // 副标题：一句话说清你的方法和边界
    subline: '我用 AI 生成 + 传统剪辑调色的混合流程做广告片和短剧。从脚本、分镜、镜头生成到成片交付，一个人能跑完整条链路。',
    positioning: 'AIGC 视频创作 · 广告 / 短剧',
    keywords: ['广告片', '竖屏短剧', 'AI 分镜', '人物一致性', '成片调色'],
    availability: '开放机会 · 可即时到岗',
    // 首屏轮播：作品封面横屏版，缓慢缩放 + 交叉淡入淡出自动播放。
    // 纯图片无视频，合计约 700KB，加载很快。改顺序或增减直接编辑这个数组。
    heroSlides: [
      'assets/images/hero/01-changye.jpg',       // 古装权谋
      'assets/images/hero/04-zero-echo.jpg',     // 赛博科幻
      'assets/images/hero/06-ad-chocolate.jpg',  // 德芙广告 KV
      'assets/images/hero/02-qingqing.jpg',      // 都市言情
      'assets/images/hero/05-you-are-great.jpg', // 家庭暖光
      'assets/images/hero/07-ad-perfume.jpg',    // 香水广告 KV
      'assets/images/hero/03-stranger.jpg',      // 都市悬疑
    ],
  },

  /* ---------- 2. 数据条 ------------------------------------- */
  stats: [
    { value: 7, unit: '支', label: '已交付成片', note: '短剧 3 / 短片 2 / 广告 2' },
    { value: 13, unit: '分钟', label: '累计成片时长', note: '含竖屏与横屏' },
    { value: 9, unit: '个', label: '打通的工具链', note: '生成到后期全流程' },
    { value: 48, unit: '小时', label: '最快交付周期', note: '从 brief 到可投放' },
  ],

  /* ---------- 3. 自述 --------------------------------------- */
  statement: {
    eyebrow: '我怎么工作',
    title: '模型只负责出画面，<em>片子好不好是判断力的事。</em>',
    body: 'AI 让出画面变得很便宜，也让平庸的画面变得更多。我的工作重心不在抽卡，而在抽卡之前和之后：先把 brief 拆成能拍的镜头，再从几十条素材里挑出情绪对得上的那几条，最后靠剪辑节奏和调色把它们缝成一支完整的片子。',
    quote: '我对最终成片负责，不只对我那一段负责。',
    // TODO: 换成你的邮箱
    email: 'your@email.com',
  },

  /* ---------- 4. 工作流轨道 ---------------------------------- */
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
    { id: 'film', label: '短片', note: '完整故事，看叙事能力' },
  ],

  /* ---------- 6. 作品 --------------------------------------
     slug 与文件路径约定：
       assets/works/{slug}/video.mp4
       assets/works/{slug}/cover.jpg   （可选，没有就用视频首帧）
       assets/works/{slug}/workflow.png（可选，工作流原图，会在弹窗「完整工作流」区展示）
     aspect 决定卡片比例：9:16（竖屏短剧）/ 16:9（其他）
  ---------------------------------------------------------- */
  works: [

    {
      id: 'changye', slug: 'changye',
      video: 'assets/works/changye/video.mp4',
      title: '长夜有灯', en: 'In the Long Night, There Is a Lamp',
      category: 'drama', featured: true, aspect: '9:16',
      year: '2025', client: '自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑 / 调色',
      duration: '01:37', resolution: '2160 × 3840 · 竖屏',
      summary: '古装权谋爱情短剧。红袍女将携血诏入宫，与冷面君王在乱局中对峙又相守。全片 AI 生成，靠人物一致性和情绪节奏撑起完整叙事。',
      brief: 'TODO：一两句话说清这支短剧想讲什么。',
      result: 'TODO：可验证结果。比如发布平台、完播率、客户反馈；没数据就写交付规格和周期。',
      tools: ['可灵', 'Midjourney', 'Premiere', '达芬奇'],
      tags: ['古装', '权谋', '爱情', '代表作'],
      process: [
        { no: '01', title: '角色锁定', body: 'TODO：怎么保证女主在不同镜头里脸一样？用了什么参考图/垫图策略？' },
        { no: '02', title: '分镜与运镜', body: 'TODO：古装场景的镜头表怎么排？' },
        { no: '03', title: '生成与筛选', body: 'TODO：每镜生成多少条、筛选标准是什么？' },
        { no: '04', title: '后期缝合', body: 'TODO：调色做了什么统一？对白/配乐/音效怎么处理的？' },
      ],
      prompts: [
        { model: '可灵', text: 'TODO: 把真实用过的关键提示词贴在这里。' },
      ],
    },

    {
      id: 'qingqing', slug: 'qingqing',
      video: 'assets/works/qingqing/video.mp4',
      title: '倾倾之夜', en: 'Tender Night',
      category: 'drama', featured: false, aspect: '9:16',
      year: '2025', client: '自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑',
      duration: '02:10', resolution: '2160 × 3840 · 竖屏',
      summary: '都市言情短剧。轮椅男主与守护他的女主，在奢华公寓和雨夜里展开一段关于脆弱与依赖的关系。紫红金调性。',
      brief: 'TODO', result: 'TODO',
      tools: ['可灵', 'Midjourney', '剪映'],
      tags: ['都市', '言情', '轮椅'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
    },

    {
      id: 'zero-echo', slug: 'zero-echo',
      video: 'assets/works/zero-echo/video.mp4',
      title: '零号回声', en: 'ZERO ECHO',
      category: 'film', featured: false, aspect: '16:9',
      year: '2025', client: '自主命题',
      role: '导演 / 编剧 / AI 生成 / 剪辑',
      duration: '01:21', resolution: '3840 × 2160 · 横屏',
      summary: '赛博科幻短片。银发女孩从 CORE 00 实验舱逃出，红发男子在废墟中等她——她逃出去是为了活，她回来是为了夺回一切。',
      brief: 'TODO', result: 'TODO',
      tools: ['可灵', 'Midjourney', 'Premiere'],
      tags: ['科幻', '动作', '赛博'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
    },

    {
      id: 'you-are-great', slug: 'you-are-great',
      video: 'assets/works/you-are-great/video.mp4',
      title: '你，很棒', en: 'You, Very Good',
      category: 'film', featured: false, aspect: '16:9',
      year: '2025', client: '自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑',
      duration: '03:49', resolution: '3840 × 2160 · 横屏',
      summary: '家庭亲情短片。一段关于"责备里藏着爱"的代际故事，最终以一句最想说的肯定收尾。暖光调性。',
      brief: 'TODO', result: 'TODO',
      tools: ['可灵', 'Midjourney', 'Premiere'],
      tags: ['家庭', '亲情', '成长'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
    },

    {
      id: 'stranger', slug: 'stranger',
      video: 'assets/works/stranger/video.mp4',
      title: '婚姻里的陌生人', en: 'A Stranger in Our Marriage',
      category: 'drama', featured: false, aspect: '9:16',
      year: '2025', client: '自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑',
      duration: '01:44', resolution: '2160 × 3840 · 竖屏',
      summary: '现代都市悬疑短剧。婚礼上的四个女人、一枚婚戒、一只珍珠耳环——"She wasn\'t the one I feared. He was."',
      brief: 'TODO', result: 'TODO',
      tools: ['可灵', 'Midjourney', 'Premiere'],
      tags: ['都市', '悬疑', '婚姻'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
    },

    {
      id: 'ad-chocolate', slug: 'ad-chocolate',
      video: 'assets/works/ad-chocolate/video.mp4',
      title: '巧克力广告', en: 'Chocolate Spot',
      category: 'ad', featured: false, aspect: '16:9',
      year: '2025', client: 'TODO：品牌方或自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑',
      duration: '01:11', resolution: '3840 × 2160 · 横屏',
      summary: '法式田园调性广告。雨后木屋、薄荷绿衬衫、一杯咖啡和一段静谧时光。',
      brief: 'TODO', result: 'TODO',
      tools: ['即梦', 'AE'],
      tags: ['广告', '食品', '田园'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
    },

    {
      id: 'ad-perfume', slug: 'ad-perfume',
      video: 'assets/works/ad-perfume/video.mp4',
      title: '香水广告', en: 'Perfume Spot',
      category: 'ad', featured: false, aspect: '16:9',
      year: '2025', client: 'TODO：品牌方或自主命题',
      role: '导演 / 分镜 / AI 生成 / 剪辑',
      duration: '01:20', resolution: '2880 × 2160 · 横屏',
      summary: '柔粉调性香水广告。"会希望有人看见我的脆弱"——紫色花瓣、粉墙、薰衣草座椅上的女性独白。',
      brief: 'TODO', result: 'TODO',
      tools: ['即梦', 'AE'],
      tags: ['广告', '美妆', '柔粉'],
      process: [{ no: '01', title: 'TODO', body: 'TODO' }],
      prompts: [],
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
    experience: [
      {
        period: '2025 — 至今',
        title: 'TODO：项目 / 公司名称',
        role: 'TODO：你的角色',
        body: 'TODO：你负责什么、怎么做的、结果如何。',
        tags: ['TODO'],
      },
    ],
    pdf: '',
  },

  /* ---------- 8. 联系方式 ---------------------------------- */
  contact: {
    eyebrow: '联系',
    title: '想聊片子，<em>随时找我。</em>',
    body: '广告、短剧、或者只是想问问某个镜头怎么做出来的，都欢迎。工作日一般当天回。',
    methods: [
      { label: '邮箱', value: 'your@email.com', copy: 'your@email.com' },
      { label: '微信', value: 'your_wechat', copy: 'your_wechat' },
      { label: '手机', value: '138-0000-0000', copy: '13800000000' },
    ],
  },
};
