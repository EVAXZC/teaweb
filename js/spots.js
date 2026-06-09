/*
 * 景点数据 —— 大同镇西乡茶园
 *
 * 名称提取自景区导览图 map.jpg。intro / images 当前为占位内容，
 * 后续把每个景点的真实介绍文字和照片替换进来即可：
 *   - intro：一段或多段介绍文字（数组中每一项为一段）。
 *   - images：图片地址数组，可换成真实照片，如 "assets/photos/foshou-hu-1.jpg"。
 *   - coords：景点在导览图上的位置，{x, y} 为相对图片宽/高的百分比（0-100），
 *            用于在地图上叠加可点击的圆形标记；可用 editor/index.html 可视化调整。
 *
 * 二维码指向 index.html?spot=<id>，因此 id 不要随意更改。
 */
const SPOTS = [
  {
    id: "youke-zhongxin",
    name: "游客中心",
    intro: [
      "游客中心是西乡茶园的服务枢纽，提供咨询、导览、票务、休息与失物招领等服务。",
      "建议从这里开始您的茶园之旅，领取纸质地图或扫码获取电子导览。"
    ],
    images: ["assets/placeholders/youke-zhongxin-1.svg", "assets/placeholders/youke-zhongxin-2.svg"],
    coords: { x: 53.3, y: 45.4 }
  },
  {
    id: "baocha-zhongxin",
    name: "苞茶中心",
    intro: [
      "苞茶中心展示大同苞茶的采摘、炒制与品鉴全过程，是了解本地茶文化的窗口。",
      "可在此体验手工制茶、品一杯刚出锅的新茶。"
    ],
    images: ["assets/placeholders/baocha-zhongxin-1.svg", "assets/placeholders/baocha-zhongxin-2.svg"],
    coords: { x: 49.0, y: 47.3 }
  },
  {
    id: "foshou-hu",
    name: "佛手湖",
    intro: [
      "佛手湖因湖形似佛手而得名，湖水清碧，环湖步道绿树成荫，是园区的核心景观。",
      "清晨薄雾与傍晚夕照各有韵味，适合环湖漫步与拍照。"
    ],
    images: ["assets/placeholders/foshou-hu-1.svg", "assets/placeholders/foshou-hu-2.svg"],
    coords: { x: 45.3, y: 62.3 }
  },
  {
    id: "wanfu-si",
    name: "万福寺",
    intro: [
      "万福寺依山而建，古木参天，钟声悠远，是景区内的人文古迹。",
      "寺前可俯瞰茶山层叠，是祈福与静心的好去处。"
    ],
    images: ["assets/placeholders/wanfu-si-1.svg", "assets/placeholders/wanfu-si-2.svg"],
    coords: { x: 37.8, y: 36.7 }
  },
  {
    id: "datong-laojie",
    name: "大同老街",
    intro: [
      "大同老街保留着传统街巷格局，青石板路两侧是茶馆、小吃与手作店铺。",
      "在这里可以品尝地道小吃，感受古镇市井烟火气。"
    ],
    images: ["assets/placeholders/datong-laojie-1.svg", "assets/placeholders/datong-laojie-2.svg"],
    coords: { x: 60.0, y: 26.7 }
  },
  {
    id: "caihong-tianti",
    name: "彩虹天梯",
    intro: [
      "彩虹天梯是依山而上的彩色阶梯步道，拾级而上可饱览整片茶园风光。",
      "色彩明快，是热门的打卡拍照点。"
    ],
    images: ["assets/placeholders/caihong-tianti-1.svg", "assets/placeholders/caihong-tianti-2.svg"],
    coords: { x: 40.0, y: 54.8 }
  },
  {
    id: "shiguang-shuba",
    name: "拾光书吧·观景台",
    intro: [
      "拾光书吧坐落于观景台之上，可一边阅读一边远眺茶山云海。",
      "提供咖啡、茶饮与书籍，是放慢脚步的歇脚地。"
    ],
    images: ["assets/placeholders/shiguang-shuba-1.svg", "assets/placeholders/shiguang-shuba-2.svg"],
    coords: { x: 46.1, y: 54.8 }
  },
  {
    id: "yunqi-chaba",
    name: "云栖茶坝",
    intro: [
      "云栖茶坝地势开阔，茶垄沿坡铺展，常有云雾在此停驻，故名云栖。",
      "是观赏茶园梯田与日出云海的绝佳位置。"
    ],
    images: ["assets/placeholders/yunqi-chaba-1.svg", "assets/placeholders/yunqi-chaba-2.svg"],
    coords: { x: 52.8, y: 58.4 }
  },
  {
    id: "taotian-lin",
    name: "桃天林",
    intro: [
      "桃天林春日桃花盛开，灼灼其华，与翠绿茶园相映成趣。",
      "花期是踏青赏花的好时节。"
    ],
    images: ["assets/placeholders/taotian-lin-1.svg", "assets/placeholders/taotian-lin-2.svg"],
    coords: { x: 55.4, y: 59.6 }
  },
  {
    id: "yingxue-lin",
    name: "樱雪林",
    intro: [
      "樱雪林以成片樱花得名，花开时如雪覆枝头，落英缤纷。",
      "林间设有步道与休憩点，适合慢行赏景。"
    ],
    images: ["assets/placeholders/yingxue-lin-1.svg", "assets/placeholders/yingxue-lin-2.svg"],
    coords: { x: 50.7, y: 65.8 }
  },
  {
    id: "guixiang-lin",
    name: "桂香林",
    intro: [
      "桂香林金秋时节桂花飘香，沁人心脾，是秋日里最受欢迎的去处之一。",
      "可在此品桂花茶、赏满园金黄。"
    ],
    images: ["assets/placeholders/guixiang-lin-1.svg", "assets/placeholders/guixiang-lin-2.svg"],
    coords: { x: 55.4, y: 63.2 }
  },
  {
    id: "chaye-yingdi",
    name: "茶野营地",
    intro: [
      "茶野营地坐落于茶山之间，提供露营、野餐与户外休闲空间。",
      "夜晚可在此观星，享受茶园里的静谧时光。"
    ],
    images: ["assets/placeholders/chaye-yingdi-1.svg", "assets/placeholders/chaye-yingdi-2.svg"],
    coords: { x: 40.0, y: 60.2 }
  },
  {
    id: "chaqi-leyuan",
    name: "茶憩亲水乐园",
    intro: [
      "茶憩亲水乐园依溪而建，是夏日戏水纳凉的亲子乐园。",
      "浅滩清澈，适合带孩子玩水嬉戏。"
    ],
    images: ["assets/placeholders/chaqi-leyuan-1.svg", "assets/placeholders/chaqi-leyuan-2.svg"],
    coords: { x: 41.3, y: 63.5 }
  },
  {
    id: "jingling-matou",
    name: "精灵滩码头",
    intro: [
      "精灵滩码头是水上游览的起点，可乘船游溪、欣赏两岸茶山风光。",
      "滩涂浅水处生机盎然，名字里的精灵指的便是这里的小生灵。"
    ],
    images: ["assets/placeholders/jingling-matou-1.svg", "assets/placeholders/jingling-matou-2.svg"],
    coords: { x: 44.3, y: 60.5 }
  },
  {
    id: "chaxiangu-suxi",
    name: "茶仙谷溯溪",
    intro: [
      "茶仙谷溯溪线路沿山涧而上，溪水清凉，怪石嶙峋，是亲近自然的探险体验。",
      "建议穿防滑鞋，结伴而行。"
    ],
    images: ["assets/placeholders/chaxiangu-suxi-1.svg", "assets/placeholders/chaxiangu-suxi-2.svg"],
    coords: { x: 25.7, y: 67.0 }
  },
  {
    id: "moyu-diaotai",
    name: "摸鱼钓台",
    intro: [
      "摸鱼钓台是亲水垂钓与摸鱼体验区，适合大人小孩一同参与。",
      "在潺潺溪水边感受田园野趣。"
    ],
    images: ["assets/placeholders/moyu-diaotai-1.svg", "assets/placeholders/moyu-diaotai-2.svg"],
    coords: { x: 36.4, y: 77.4 }
  },
  {
    id: "hongjian-ting",
    name: "鸿渐亭",
    intro: [
      "鸿渐亭取意茶圣陆羽（字鸿渐），是临湖而立的观景凉亭。",
      "亭中小憩，可品茶论道，远望佛手湖全景。"
    ],
    images: ["assets/placeholders/hongjian-ting-1.svg", "assets/placeholders/hongjian-ting-2.svg"],
    coords: { x: 48.2, y: 61.1 }
  },
  {
    id: "dongpo-ting",
    name: "东坡亭",
    intro: [
      "东坡亭以苏东坡命名，亭周茶香与林荫相伴，是文人雅趣的体现。",
      "适合在此驻足，品味山水之间的诗意。"
    ],
    images: ["assets/placeholders/dongpo-ting-1.svg", "assets/placeholders/dongpo-ting-2.svg"],
    coords: { x: 40.0, y: 65.0 }
  },
  {
    id: "yuchuan-ting",
    name: "玉川亭",
    intro: [
      "玉川亭取意茶仙卢仝（号玉川子），坐落于步道之间，可供游人歇脚赏景。",
      "亭外茶垄连绵，景致清幽。"
    ],
    images: ["assets/placeholders/yuchuan-ting-1.svg", "assets/placeholders/yuchuan-ting-2.svg"],
    coords: { x: 40.0, y: 72.4 }
  },
  {
    id: "muyun-guanjingtai",
    name: "暮云揽山·观景台",
    intro: [
      "暮云揽山观景台是园区制高点之一，傍晚云霞漫天，群山尽收眼底。",
      "是观赏日落与晚霞的最佳位置。"
    ],
    images: ["assets/placeholders/muyun-guanjingtai-1.svg", "assets/placeholders/muyun-guanjingtai-2.svg"],
    coords: { x: 52.3, y: 69.7 }
  },
  {
    id: "chunshui-chapu",
    name: "春水茶铺",
    intro: [
      "春水茶铺是一处临水茶歇，提供本地茶饮与点心。",
      "听水声、品香茗，是旅途中的惬意一站。"
    ],
    images: ["assets/placeholders/chunshui-chapu-1.svg", "assets/placeholders/chunshui-chapu-2.svg"],
    coords: { x: 55.4, y: 61.1 }
  },
  {
    id: "chaye-keting",
    name: "茶野会客厅",
    intro: [
      "茶野会客厅是集接待、茶艺展示与文创于一体的复合空间。",
      "可在此了解茶园品牌故事，选购特色伴手礼。"
    ],
    images: ["assets/placeholders/chaye-keting-1.svg", "assets/placeholders/chaye-keting-2.svg"],
    coords: { x: 49.7, y: 63.5 }
  },
  {
    id: "nongchuangke-zhongxin",
    name: "农创客研学中心",
    intro: [
      "农创客研学中心是面向青少年与亲子家庭的农业研学基地。",
      "提供茶艺、农耕等体验课程，寓教于乐。"
    ],
    images: ["assets/placeholders/nongchuangke-zhongxin-1.svg", "assets/placeholders/nongchuangke-zhongxin-2.svg"],
    coords: { x: 56.1, y: 30.3 }
  },
  {
    id: "daomeng-kongjian",
    name: "云淡明田外·稻梦空间",
    intro: [
      "稻梦空间是大片稻田景观区，四季田色不同，稻浪翻涌如梦。",
      "设有观景与休闲设施，是田园风光的代表。"
    ],
    images: ["assets/placeholders/daomeng-kongjian-1.svg", "assets/placeholders/daomeng-kongjian-2.svg"],
    coords: { x: 60.0, y: 38.1 }
  },
  {
    id: "chayuan-mijing",
    name: "云淡明田外·茶园秘境",
    intro: [
      "茶园秘境隐于山林之间，茶垄与自然景观交融，环境清幽。",
      "是远离喧嚣、沉浸茶山的静谧角落。"
    ],
    images: ["assets/placeholders/chayuan-mijing-1.svg", "assets/placeholders/chayuan-mijing-2.svg"],
    coords: { x: 50.9, y: 42.9 }
  },
  {
    id: "chashan-yunjing",
    name: "云淡明田外·茶山云境",
    intro: [
      "茶山云境地处高处，常年云雾缭绕，茶山在云海中若隐若现。",
      "是观赏云海与高山茶园的绝佳之地。"
    ],
    images: ["assets/placeholders/chashan-yunjing-1.svg", "assets/placeholders/chashan-yunjing-2.svg"],
    coords: { x: 36.4, y: 67.3 }
  }
];

// 兼容浏览器直接引用与可能的模块化使用
if (typeof window !== "undefined") {
  window.SPOTS = SPOTS;
}
