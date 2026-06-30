// Mock data layer — ported from WeChat miniprogram starfan-platform
// Provides offline demo data when API is unavailable

const NOW = Date.now();
const DAY = 86400000;

// ========== Stars ==========
export const MOCK_STARS = [
  { _id:'star_001', name:'张艺兴', avatar:'', cover:'', intro:'歌手、演员、音乐制作人。代表作《SHEEP》《莲》等。', category:'歌手', followerCount:12345, memberCount:890, contentCount:56, status:'active',
    memberPlans:{ month:{price:1990,name:'月度会员'}, quarter:{price:5990,name:'季度会员'}, year:{price:19900,name:'年度会员'} },
    memberBenefits:['解锁全部独家内容','专属会员徽章','商城享95折优惠'], createdAt: NOW-50*DAY },
  { _id:'star_002', name:'王一博', avatar:'', cover:'', intro:'歌手、演员、职业摩托车赛车手。UNIQ组合成员。', category:'歌手', followerCount:9876, memberCount:654, contentCount:42, status:'active',
    memberPlans:{ month:{price:1990,name:'月度会员'}, quarter:{price:5990,name:'季度会员'}, year:{price:19900,name:'年度会员'} },
    memberBenefits:['解锁全部独家内容','专属会员徽章','商城享95折优惠'], createdAt: NOW-45*DAY },
  { _id:'star_003', name:'杨幂', avatar:'', cover:'', intro:'演员、制片人。代表作《三生三世十里桃花》《宫》等。', category:'演员', followerCount:8234, memberCount:432, contentCount:38, status:'active',
    memberPlans:{ month:{price:1990,name:'月度会员'}, quarter:{price:5990,name:'季度会员'}, year:{price:19900,name:'年度会员'} },
    memberBenefits:['解锁全部独家内容','专属会员徽章','商城享9折优惠'], createdAt: NOW-40*DAY },
  { _id:'star_004', name:'肖战', avatar:'', cover:'', intro:'歌手、演员。X玖少年团成员。代表作《陈情令》《斗罗大陆》等。', category:'歌手', followerCount:15678, memberCount:1200, contentCount:67, status:'active',
    memberPlans:{ month:{price:2990,name:'月度会员'}, quarter:{price:7990,name:'季度会员'}, year:{price:26900,name:'年度会员'} },
    memberBenefits:['解锁全部独家内容','专属会员徽章','商城享85折优惠','会员专享群'], createdAt: NOW-55*DAY },
  { _id:'star_005', name:'洛天依', avatar:'', cover:'', intro:'Vsinger旗下虚拟歌手。世界首位中文VOCALOID虚拟偶像。', category:'虚拟IP', followerCount:5432, memberCount:321, contentCount:29, status:'active',
    memberPlans:{ month:{price:990,name:'月度会员'}, quarter:{price:2990,name:'季度会员'}, year:{price:9900,name:'年度会员'} },
    memberBenefits:['解锁全部独家内容','专属虚拟勋章','商城享95折优惠'], createdAt: NOW-20*DAY }
];

// ========== Content Feed ==========
const CONTENT_TEMPLATES = [
  { title:'今日份练习打卡', body:'今天录音棚里度过了很棒的一天！新歌的编曲已经完成了80%，期待与大家见面🎵' },
  { title:'后台花絮来啦', body:'分享一些今天拍摄的后台花絮，感谢所有工作人员的努力付出！' },
  { title:'早安！新的一天', body:'早上好！今天也要元气满满哦～记得吃早餐☀️' },
  { title:'新歌预告', body:'下周五，新歌即将上线各大音乐平台。这次尝试了全新的风格，希望大家喜欢！' },
  { title:'粉丝见面会回顾', body:'上周的见面会太开心了！感谢每一位到场的你们，你们的支持是我最大的动力❤️' },
  { title:'日常分享', body:'今天休息日，在家看了一部很棒的电影。推荐给大家～' },
  { title:'练习室ver.', body:'新舞蹈的练习室版本，先给大家看一小段。完整版只有会员能看到哦😉' },
  { title:'感谢大家的生日祝福', body:'收到了好多祝福和礼物，感动ing...爱你们！' },
  { title:'拍摄日', body:'新代言的拍摄花絮，这次合作的品牌真的很棒' },
  { title:'晚安', body:'工作结束！大家晚安，明天见🌙' }
];

function buildContents() {
  const list = [];
  for (let i = 0; i < 30; i++) {
    const star = MOCK_STARS[i % MOCK_STARS.length];
    const tpl = CONTENT_TEMPLATES[i % CONTENT_TEMPLATES.length];
    list.push({
      _id: 'content_' + String(i+1).padStart(3,'0'),
      starId: star._id, starName: star.name, starAvatar: star.avatar,
      type: i%3===0?'video':(i%3===1?'text':'image'),
      title: tpl.title, body: tpl.body, media: [],
      isMemberOnly: i%4===0, isReviewPassed: true,
      viewCount: Math.floor(Math.random()*5000)+100,
      likeCount: Math.floor(Math.random()*500)+10,
      commentCount: Math.floor(Math.random()*50),
      isLiked: i%5===0, isCollected: i%7===0,
      createdAt: new Date(NOW - (30-i)*DAY).toISOString()
    });
  }
  return list;
}
export const MOCK_CONTENTS = buildContents();

// ========== Goods ==========
export const MOCK_GOODS = [
  { _id:'goods_001', starId:'star_001', starName:'张艺兴', name:'明星联名T恤', image:'', images:[], price:9900, memberPrice:9405, stock:200, sales:134, category:'服装', desc:'限量300件，官方正版授权。100%棉，S/M/L/XL可选。', status:'on' },
  { _id:'goods_002', starId:'star_002', starName:'王一博', name:'限定手办', image:'', images:[], price:29900, memberPrice:26900, stock:50, sales:89, category:'手办', desc:'高度还原，限量500体。含独立编号收藏证书。', status:'on' },
  { _id:'goods_003', starId:'star_003', starName:'杨幂', name:'签名海报套装', image:'', images:[], price:5900, memberPrice:5600, stock:500, sales:412, category:'海报', desc:'高清印刷海报套装（6张），含亲笔签名复制版。', status:'on' },
  { _id:'goods_004', starId:'star_004', starName:'肖战', name:'纪念徽章', image:'', images:[], price:3900, memberPrice:3700, stock:0, sales:1023, category:'徽章', desc:'珐琅工艺纪念徽章，直径3cm。', status:'soldout' },
  { _id:'goods_005', starId:'star_005', starName:'洛天依', name:'限量专辑', image:'', images:[], price:19900, memberPrice:17900, stock:100, sales:67, category:'专辑', desc:'精装版专辑，含写真集+歌词本+小卡2张。', status:'off' },
  { _id:'goods_006', starId:'star_001', starName:'张艺兴', name:'应援棒', image:'', images:[], price:14900, memberPrice:12900, stock:300, sales:56, category:'应援', desc:'官方应援棒，蓝牙中控联动，演唱会必备。', status:'on' },
  { _id:'goods_007', starId:'star_002', starName:'王一博', name:'帆布包', image:'', images:[], price:7900, memberPrice:6900, stock:150, sales:201, category:'包包', desc:'原创设计帆布包，大容量，日常百搭。', status:'on' },
  { _id:'goods_008', starId:'star_004', starName:'肖战', name:'文创笔记本', image:'', images:[], price:4900, memberPrice:3900, stock:400, sales:178, category:'文具', desc:'精装笔记本，内含明星手写寄语。', status:'on' }
];

// ========== Orders ==========
const ORDER_STATUSES = ['paid','paid','shipped','done','refunded'];
function buildOrders() {
  const list = [];
  for (let i = 1; i <= 10; i++) {
    const star = MOCK_STARS[i % MOCK_STARS.length];
    const goods = MOCK_GOODS[i % MOCK_GOODS.length];
    list.push({
      _id: 'order_' + String(i).padStart(3,'0'),
      userId: 'demo_user',
      type: i%3===0?'member':'goods',
      starId: star._id,
      items: i%3===0
        ? [{ starId:star._id, starName:star.name, plan:'month', planName:'月度会员', price:1990 }]
        : [{ goodsId:goods._id, name:goods.name, price:goods.price, qty:1, image:goods.image }],
      totalAmount: i%3===0?1990:goods.price,
      status: ORDER_STATUSES[i%5],
      address: { name:'用户'+i, phone:'138****'+String(i).padStart(4,'0'), detail:'北京市朝阳区xxx路xxx号' },
      express: i%5===2||i%5===3?{ company:'顺丰速运', no:'SF'+NOW+i }:undefined,
      paidAt: new Date(NOW - i*DAY).toISOString(),
      createdAt: new Date(NOW - i*DAY - 3600000).toISOString()
    });
  }
  return list;
}
export const MOCK_ORDERS = buildOrders();

// ========== Comments ==========
function buildComments() {
  const list = [];
  const names = ['小星星','博迷小王','蜜蜂侠','战哥的铁粉','天依酱','路人甲','热心粉丝'];
  const texts = ['期待已久！','太棒了！😍','来了来了！','支持！永远爱你！','好好看','什么时候出新歌','已下单支持','会员真香','打卡','感动哭了','加油！','❤️'];
  for (let i = 0; i < 12; i++) {
    list.push({
      _id: 'comment_' + (i+1),
      contentId: 'content_001',
      userId: 'user_' + i,
      nickname: names[i % names.length],
      avatar: '',
      text: texts[i],
      likeCount: Math.floor(Math.random()*50),
      isReviewPassed: true,
      createdAt: new Date(NOW - i*3600000).toISOString()
    });
  }
  return list;
}
const COMMENTS = buildComments();

// ========== Notifications ==========
export const MOCK_NOTIFICATIONS = [
  { _id:'noti_1', type:'like', title:'张艺兴赞了你的评论', desc:'', contentId:'content_001', isRead:false, createdAt: new Date(NOW-3600000).toISOString() },
  { _id:'noti_2', type:'comment', title:'王一博回复了你的评论', desc:'谢谢支持！', contentId:'content_003', isRead:false, createdAt: new Date(NOW-7200000).toISOString() },
  { _id:'noti_3', type:'system', title:'欢迎加入明星粉丝互动平台', desc:'开启你的追星之旅吧✨', isRead:true, createdAt: new Date(NOW-3*DAY).toISOString() },
];

// ========== Interest Tags ==========
export const MOCK_INTEREST_TAGS = {
  primaryTags: [
    { _id:'music', name:'音乐', sortOrder:1, enabled:true, children:[
      { _id:'music_vocal', parentId:'music', name:'歌手', sortOrder:1, enabled:true },
      { _id:'music_stage', parentId:'music', name:'舞台', sortOrder:2, enabled:true },
      { _id:'music_idol', parentId:'music', name:'偶像', sortOrder:3, enabled:true }
    ]},
    { _id:'screen', name:'影视', sortOrder:2, enabled:true, children:[
      { _id:'screen_actor', parentId:'screen', name:'演员', sortOrder:1, enabled:true },
      { _id:'screen_drama', parentId:'screen', name:'剧集', sortOrder:2, enabled:true }
    ]},
    { _id:'sports', name:'体育', sortOrder:3, enabled:true, children:[
      { _id:'sports_dance', parentId:'sports', name:'舞蹈', sortOrder:1, enabled:true },
      { _id:'sports_race', parentId:'sports', name:'赛车', sortOrder:2, enabled:true }
    ]},
    { _id:'acg', name:'二次元', sortOrder:4, enabled:true, children:[
      { _id:'acg_vocaloid', parentId:'acg', name:'虚拟歌手', sortOrder:1, enabled:true },
      { _id:'acg_cosplay', parentId:'acg', name:'Cosplay', sortOrder:2, enabled:true }
    ]}
  ]
};

// ========== Mock API Implementation ==========
function clone(obj) { return JSON.parse(JSON.stringify(obj)); }

let mockUser = {
  _id: 'demo_user',
  openid: 'demo_user',
  nickname: '演示用户',
  avatar: '',
  subscribeStars: ['star_001','star_004'],
  memberSubscriptions: [
    { starId:'star_001', level:'month', expireAt: new Date(NOW + 20*DAY).toISOString(), autoRenew: true }
  ],
  interestProfile: { primaryTagId:'music', secondaryTagIds:['music_vocal','music_stage'] },
  onboarding: { followDiscoveryStatus:'completed', updatedAt: new Date(NOW-3*DAY).toISOString() },
  under14: false
};
let likeState = {};

export const mockApi = {
  login() {
    return Promise.resolve({ openid:'demo_user', userInfo: clone(mockUser), onboarding: mockUser.onboarding, isLoggedIn: true });
  },

  getFeed(data = {}) {
    const page = data.page || 1;
    const pageSize = data.pageSize || 20;
    const keyword = data.keyword || '';
    if (keyword) {
      const searchList = MOCK_CONTENTS.filter(c => c.title.includes(keyword) || c.body.includes(keyword));
      const start = (page-1)*pageSize;
      return Promise.resolve({ list: clone(searchList.slice(start, start+pageSize)), hasMore: start+pageSize < searchList.length });
    }
    const subscribed = mockUser.subscribeStars;
    let list = MOCK_CONTENTS.filter(c => subscribed.includes(c.starId));
    if (list.length === 0) {
      list = [...MOCK_CONTENTS].sort((a,b) => b.likeCount - a.likeCount);
    }
    const start = (page-1)*pageSize;
    const result = list.slice(start, start+pageSize);
    if (result.length < pageSize && page === 1 && subscribed.length > 0) {
      const hot = [...MOCK_CONTENTS].filter(c => !subscribed.includes(c.starId)).sort((a,b)=>b.likeCount-a.likeCount);
      for (const item of hot) {
        if (result.length >= pageSize) break;
        if (!result.find(r => r._id === item._id)) result.push({...item, _recommendReason:'热门发现'});
      }
    }
    const isHot = subscribed.length === 0;
    return Promise.resolve({
      list: clone(result), hasMore: start+pageSize < list.length,
      isHotRecommend: isHot, hint: isHot ? '关注你喜欢的明星，获取专属动态' : ''
    });
  },

  getStar(data = {}) {
    const starId = data.starId || '';
    const star = MOCK_STARS.find(s => s._id === starId) || MOCK_STARS[0];
    const contents = MOCK_CONTENTS.filter(c => c.starId === starId).slice(0, 20);
    return Promise.resolve({ star: clone(star), contents: clone(contents), isFollowing: mockUser.subscribeStars.includes(starId) });
  },

  getStarList(data = {}) {
    const keyword = data.keyword || '';
    const page = data.page || 1;
    let list = MOCK_STARS.filter(s => s.status === 'active');
    if (keyword) list = list.filter(s => s.name.includes(keyword));
    const pageSize = 20;
    const start = (page-1)*pageSize;
    return Promise.resolve({ list: clone(list.slice(start, start+pageSize)), total: list.length });
  },

  getContentDetail(data = {}) {
    const contentId = data.contentId || '';
    const content = MOCK_CONTENTS.find(c => c._id === contentId);
    if (!content) return Promise.resolve({ code: 404, msg: 'content not found' });
    if (content.isMemberOnly) {
      const hasAccess = mockUser.memberSubscriptions.some(s => s.starId === content.starId && new Date(s.expireAt).getTime() > NOW);
      if (!hasAccess) return Promise.resolve({ code: 403, msg: 'member subscription required', starId: content.starId });
    }
    return Promise.resolve({ ...clone(content), isLiked: !!likeState[contentId+'_like'], isCollected: !!likeState[contentId+'_collect'] });
  },

  getComments(data = {}) {
    const contentId = data.contentId || 'content_001';
    const sort = data.sort || 'hot';
    const page = data.page || 1;
    const pageSize = data.pageSize || 20;
    let list = COMMENTS.filter(c => c.contentId === contentId);
    if (sort === 'hot' || sort !== 'time') list.sort((a,b) => b.likeCount - a.likeCount);
    else list.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const start = (page-1)*pageSize;
    return Promise.resolve({ list: clone(list.slice(start, start+pageSize)), hasMore: start+pageSize < list.length });
  },

  toggleLike(data = {}) {
    const contentId = data.contentId || '';
    const action = data.action || 'like';
    const key = contentId + '_' + (action === 'collect' || action === 'uncollect' ? 'collect' : 'like');
    if (action === 'like' || action === 'collect') likeState[key] = true;
    else delete likeState[key];
    const content = MOCK_CONTENTS.find(c => c._id === contentId) || { likeCount: 10 };
    const likeDelta = (action === 'like' ? 1 : action === 'unlike' ? -1 : 0);
    return Promise.resolve({ likeCount: content.likeCount + likeDelta, isLiked: action==='like'||!!likeState[contentId+'_like'] });
  },

  postComment(data = {}) {
    return Promise.resolve({ commentId: 'comment_new', needReview: true });
  },

  toggleFollow(data = {}) {
    const starId = data.starId || '';
    const action = data.action || 'follow';
    if (action === 'follow' && !mockUser.subscribeStars.includes(starId)) {
      mockUser.subscribeStars.push(starId);
    } else if (action === 'unfollow') {
      mockUser.subscribeStars = mockUser.subscribeStars.filter(id => id !== starId);
    }
    const star = MOCK_STARS.find(s => s._id === starId) || { followerCount: 100 };
    return Promise.resolve({ followerCount: star.followerCount + (action==='follow'?1:0) });
  },

  createMemberOrder() {
    return Promise.reject(new Error('Mock: 微信支付需云开发环境'));
  },

  getGoodsList(data = {}) {
    let list = [...MOCK_GOODS];
    if (data.starId) list = list.filter(g => g.starId === data.starId);
    if (data.category) list = list.filter(g => g.category === data.category);
    const pageSize = data.pageSize || 20;
    const page = data.page || 1;
    const start = (page-1)*pageSize;
    return Promise.resolve({ list: clone(list.slice(start, start+pageSize)), hasMore: start+pageSize < list.length });
  },

  getGoodsDetail(data = {}) {
    const goodsId = data.goodsId || '';
    const goods = MOCK_GOODS.find(g => g._id === goodsId);
    return Promise.resolve({ goods: goods ? clone(goods) : null });
  },

  createMallOrder() {
    return Promise.reject(new Error('Mock: 微信支付需云开发环境'));
  },

  getOrders(data = {}) {
    const status = data.status || '';
    const page = data.page || 1;
    let list = [...MOCK_ORDERS];
    if (status) list = list.filter(o => o.status === status);
    const pageSize = 20;
    const start = (page-1)*pageSize;
    return Promise.resolve({ list: clone(list.slice(start, start+pageSize)), hasMore: start+pageSize < list.length });
  },

  getOrderDetail(data = {}) {
    const orderId = data.orderId || '';
    const order = MOCK_ORDERS.find(o => o._id === orderId) || MOCK_ORDERS[0];
    return Promise.resolve({ order: clone(order) });
  },

  getInterestTags() {
    return Promise.resolve(clone(MOCK_INTEREST_TAGS));
  },

  getRecommendedStars() {
    const list = MOCK_STARS.filter(s => s.status === 'active').slice(0, 12);
    return Promise.resolve({ list: clone(list.map(s => ({...s, isSelected: false}))) });
  },

  saveUserInterests(data = {}) {
    if (data.status) mockUser.onboarding.followDiscoveryStatus = data.status;
    mockUser.onboarding.updatedAt = new Date().toISOString();
    return Promise.resolve({ ok: true });
  },

  getNotifications() {
    return Promise.resolve({ list: clone(MOCK_NOTIFICATIONS), unreadCount: MOCK_NOTIFICATIONS.filter(n=>!n.isRead).length, hasMore: false });
  },

  markNotificationRead() {
    return Promise.resolve({ ok: true });
  },
};
