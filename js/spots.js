/*
 * 景点数据 —— 大同镇西乡茶园
 * 由 editor/index.html 生成。intro / images 为占位内容，可替换为真实文案与照片。
 *   - coords：景点在导览图上的位置（相对图片宽/高的百分比 0-100）。
 * 二维码指向 index.html?spot=<id>，因此 id 不要随意更改。
 */
const SPOTS = [
  {
    "id": "youke-zhongxin",
    "name": "游客中心",
    "intro": [
      "西乡茶园的服务枢纽，提供咨询、导览、票务、休息与失物招领等服务，同时配套餐饮接待服务功能。"
    ],
    "images": [
      "assets/placeholders/youke-zhongxin-1.svg",
      "assets/placeholders/youke-zhongxin-2.svg"
    ],
    "coords": {
      "x": 42.9,
      "y": 46.3
    }
  },
  {
    "id": "baocha-zhongxin",
    "name": "苞茶中心",
    "intro": [
      "在茶香中了解苞茶的特色与制作故事，感受从茶叶到茶杯之间的细致过程。不只是一个景点，更像是走进一段关于传统、生活与地方文化的故事。"
    ],
    "images": [
      "assets/placeholders/baocha-zhongxin-1.svg",
      "assets/placeholders/baocha-zhongxin-2.svg"
    ],
    "coords": {
      "x": 42.3,
      "y": 47.3
    }
  },
  {
    "id": "foshou-hu",
    "name": "佛手湖",
    "intro": [
      "因湖形似佛手而得名，湖水清碧，环湖步道绿树成荫，是茶园的核心景观之一。清晨薄雾与傍晚夕照各有韵味，适合环湖漫步与拍照。"
    ],
    "images": [
      "assets/placeholders/foshou-hu-1.svg",
      "assets/placeholders/foshou-hu-2.svg"
    ],
    "coords": {
      "x": 38.1,
      "y": 62.7
    }
  },
  {
    "id": "caihong-tianti",
    "name": "彩虹天梯",
    "intro": [
      "茶山中间依山而上的彩色阶梯步道，拾级而上可饱览整片茶园风光。色彩明快，是热门的打卡拍照点。"
    ],
    "images": [
      "assets/placeholders/caihong-tianti-1.svg",
      "assets/placeholders/caihong-tianti-2.svg"
    ],
    "coords": {
      "x": 34.8,
      "y": 56.8
    }
  },
  {
    "id": "shiguang-shuba",
    "name": "茶野书吧·观景台",
    "intro": [
      "茶园最适合静心停留的地方，也是观赏日出与俯瞰整个景区的最佳位置。可一边阅读一边远眺茶山云海，拾起一段属于自然、阅读与生活的温柔时光。"
    ],
    "images": [
      "assets/placeholders/shiguang-shuba-1.svg",
      "assets/placeholders/shiguang-shuba-2.svg"
    ],
    "coords": {
      "x": 36.2,
      "y": 56
    }
  },
  {
    "id": "yunqi-chaba",
    "name": "云栖茶坝",
    "intro": [
      "佛手湖的坝上，云雾停留在此处，茶香生长在水畔，让人仿佛走进一处远离喧嚣的慢生活空间。云栖茶坝，不只是一座大坝，更是一处被山水与茶香收藏起来的悠然空间。"
    ],
    "images": [
      "assets/placeholders/yunqi-chaba-1.svg",
      "assets/placeholders/yunqi-chaba-2.svg"
    ],
    "coords": {
      "x": 41.4,
      "y": 57.4
    }
  },
  {
    "id": "taotian-lin",
    "name": "桃夭林",
    "intro": [
      "逃之夭夭，灼灼其华，春日桃花与翠绿茶园相映成趣，正是踏青赏花的好时节。"
    ],
    "images": [
      "assets/placeholders/taotian-lin-1.svg",
      "assets/placeholders/taotian-lin-2.svg"
    ],
    "coords": {
      "x": 42.1,
      "y": 59.2
    }
  },
  {
    "id": "yingxue-lin",
    "name": "樱雪林",
    "intro": [
      "以成片樱花得名，花开时如雪覆枝头，落英缤纷。樱雪林的魅力在于它的短暂与惊艳，花期虽不长，却正因为如此，每一次相遇都显得格外珍贵。"
    ],
    "images": [
      "assets/placeholders/yingxue-lin-1.svg",
      "assets/placeholders/yingxue-lin-2.svg"
    ],
    "coords": {
      "x": 41.2,
      "y": 66.6
    }
  },
  {
    "id": "guixiang-lin",
    "name": "桂香林",
    "intro": [
      "桂花飘香，沁人心脾，是秋日里最受欢迎的去处之一。走进林间，浓荫密布，最先感受到的不是视觉上的热烈，而是空气中慢慢散开的芳香。"
    ],
    "images": [
      "assets/placeholders/guixiang-lin-1.svg",
      "assets/placeholders/guixiang-lin-2.svg"
    ],
    "coords": {
      "x": 43.6,
      "y": 62.4
    }
  },
  {
    "id": "chaye-yingdi",
    "name": "茶园星空营地",
    "intro": [
      "坐落于茶山之间，提供星空露营、美食烧烤、音乐派对、户外休闲等空间。夜晚可在此观星，享受茶园里的静谧时光。"
    ],
    "images": [
      "assets/placeholders/chaye-yingdi-1.svg",
      "assets/placeholders/chaye-yingdi-2.svg"
    ],
    "coords": {
      "x": 34.5,
      "y": 60.1
    }
  },
  {
    "id": "chaqi-leyuan",
    "name": "茶憨憨水乐园",
    "intro": [
      "这是茶园的快乐能量站。竹筏、皮划艇、电动游船、碰碰船等体验项目一应俱全，划着彩色浆板穿行在碧波上，远处是层层茶山，随手一拍即是风景。"
    ],
    "images": [
      "assets/placeholders/chaqi-leyuan-1.svg",
      "assets/placeholders/chaqi-leyuan-2.svg"
    ],
    "coords": {
      "x": 35.7,
      "y": 61.5
    }
  },
  {
    "id": "jingling-matou",
    "name": "精灵湾码头",
    "intro": [
      "精灵滩码头是快乐精灵的集聚地，也是水上游览项目的起点，可乘船游湖、欣赏两岸旖旎风光。"
    ],
    "images": [
      "assets/placeholders/jingling-matou-1.svg",
      "assets/placeholders/jingling-matou-2.svg"
    ],
    "coords": {
      "x": 36.5,
      "y": 61
    }
  },
  {
    "id": "chaxiangu-suxi",
    "name": "茶仙谷溯溪",
    "intro": [
      "浅滩清澈，适合带孩子玩水嬉戏，是夏日戏水纳凉的亲子乐园。在浅浅的水道中嬉水纳凉、踩着石阶亲近溪流，也可以在溪边天幕下休憩，感受山风、水声与茶园景色交织出的清凉与惬意。"
    ],
    "images": [
      "assets/placeholders/chaxiangu-suxi-1.svg",
      "assets/placeholders/chaxiangu-suxi-2.svg"
    ],
    "coords": {
      "x": 25.6,
      "y": 69.9
    }
  },
  {
    "id": "chaxiangu-matou",
    "name": "茶仙谷码头",
    "intro": [
      "从这里登陆茶仙谷溯溪，开启一段欢乐之旅。"
    ],
    "images": [],
    "coords": {
      "x": 29.4,
      "y": 67.6
    }
  },
  {
    "id": "moyu-diaotai",
    "name": "摸鱼钓台",
    "intro": [
      "在此垂钓，可享山水之幽，得闲静之趣。"
    ],
    "images": [
      "assets/placeholders/moyu-diaotai-1.svg",
      "assets/placeholders/moyu-diaotai-2.svg"
    ],
    "coords": {
      "x": 31.9,
      "y": 75.5
    }
  },
  {
    "id": "zhuoxia-diaotai",
    "name": "捉虾钓台",
    "intro": [
      "在此垂钓，可享山水之幽，得闲静之趣。"
    ],
    "images": [],
    "coords": {
      "x": 41.6,
      "y": 60
    }
  },
  {
    "id": "huobite-leyuan",
    "name": "霍比特乐园",
    "intro": [
      "充满童话感与亲子趣味的游玩空间。仿佛走进一个藏在茶山里的奇幻小村落，在这里玩耍探索，感受纯真的童话世界。"
    ],
    "images": [],
    "coords": {
      "x": 29.2,
      "y": 76.6
    }
  },
  {
    "id": "hongjian-ting",
    "name": "鸿渐亭",
    "intro": [
      "取意“茶圣”陆羽（字鸿渐），是临湖而立的观景凉亭。陆羽著有《茶经》，被后人视为中国茶文化的重要奠基者，因此鸿渐亭是连接茶园风光与千年茶文化的一处精神坐标。"
    ],
    "images": [
      "assets/placeholders/hongjian-ting-1.svg",
      "assets/placeholders/hongjian-ting-2.svg"
    ],
    "coords": {
      "x": 39.8,
      "y": 59.3
    }
  },
  {
    "id": "dongpo-ting",
    "name": "东坡亭",
    "intro": [
      "取意于宋代文豪苏东坡。苏东坡一生爱茶、懂茶，也常以茶入诗，把品茶写成一种清雅从容的生活态度。东坡亭，让茶香与诗意都多了一份人生滋味。"
    ],
    "images": [
      "assets/placeholders/dongpo-ting-1.svg",
      "assets/placeholders/dongpo-ting-2.svg"
    ],
    "coords": {
      "x": 33.8,
      "y": 65
    }
  },
  {
    "id": "yuchuan-ting",
    "name": "玉川亭",
    "intro": [
      "取意于唐代诗人卢仝之号“玉川子”。卢仝曾在《七碗茶歌》中写出品茶后的畅快与超然，把一杯茶从日常饮品升华为精神享受，因此被后人称为“茶仙”。"
    ],
    "images": [
      "assets/placeholders/yuchuan-ting-1.svg",
      "assets/placeholders/yuchuan-ting-2.svg"
    ],
    "coords": {
      "x": 34.3,
      "y": 70
    }
  },
  {
    "id": "muyun-guanjingtai",
    "name": "暮云揽山·观景台",
    "intro": [
      "站在这里，远处群山层层铺展，近处茶园顺着山势起伏，水面倒映着天光与云影，整个景区在暮色中显得格外宁静开阔。傍晚的云霞轻轻环绕山间，仿佛把茶山、湖水与远方群峰一同揽入怀中。"
    ],
    "images": [
      "assets/placeholders/muyun-guanjingtai-1.svg",
      "assets/placeholders/muyun-guanjingtai-2.svg"
    ],
    "coords": {
      "x": 41.9,
      "y": 70.5
    }
  },
  {
    "id": "chunshui-chapu",
    "name": "春水茶铺",
    "intro": [
      "取自元代散曲家张可久名句中的“春水煎茶”，听水声、品香茗，是旅途中的惬意一站。"
    ],
    "images": [
      "assets/placeholders/chunshui-chapu-1.svg",
      "assets/placeholders/chunshui-chapu-2.svg"
    ],
    "coords": {
      "x": 42.4,
      "y": 60.6
    }
  },
  {
    "id": "chaye-keting",
    "name": "茶野会客厅",
    "intro": [
      "茶园内集接待、会议、茶艺展示、文创体验于一体的复合空间，这里不只是休憩停留的地方，更是茶园中的一处文化客厅。"
    ],
    "images": [
      "assets/placeholders/chaye-keting-1.svg",
      "assets/placeholders/chaye-keting-2.svg"
    ],
    "coords": {
      "x": 39.9,
      "y": 63.9
    }
  },
  {
    "id": "yisuoyanyu-budao",
    "name": "一蓑烟雨步道",
    "intro": [
      "取意于苏轼名句“一蓑烟雨任平生”，带有一种从容、洒脱、自在前行的意境，像是一段把诗意、茶香与生活节奏连接起来的慢行旅程。来到一蓑烟雨步道，走过的是湖边小径，留下的是一份从容自在的记忆。"
    ],
    "images": [],
    "coords": {
      "x": 31.4,
      "y": 72.4
    }
  },
  {
    "id": "yinxiao-xuxing-lvdao",
    "name": "吟啸徐行绿道",
    "intro": [
      "取意于苏轼《定风波》中的“何妨吟啸且徐行”，表达的是一种不急不躁、从容前行的人生态度。沿着吟啸徐行绿道慢慢穿行在茶山、林木与水岸之间，感受山风拂面、茶香相伴的清新与自在。"
    ],
    "images": [],
    "coords": {
      "x": 35.6,
      "y": 70
    }
  }
];

if (typeof window !== "undefined") {
  window.SPOTS = SPOTS;
}
