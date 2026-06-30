// StarPad API Layer — mirrors miniprogram cloud functions
const API_BASE = 'https://your-cloud-function-domain.apigw.tencentcs.com';

async function request(path, data = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (e) {
    console.warn('API fallback (mock):', path);
    return null;
  }
}

export const api = {
  // Auth
  login: () => request('/login'),

  // Feed & Content
  getFeed: (page) => request('/getFeed', { page, pageSize: 20 }),
  getContentDetail: (contentId) => request('/getContentDetail', { contentId }),
  getComments: (contentId, sort = 'hot', page = 1) =>
    request('/getComments', { contentId, sort, page, pageSize: 20 }),
  postComment: (contentId, text, replyTo = '') =>
    request('/postComment', { contentId, text, replyTo }),

  // Stars
  getStar: (starId) => request('/getStar', { starId }),
  getStarList: (keyword = '', page = 1) =>
    request('/getStarList', { keyword, page }),
  toggleFollow: (starId, action) => request('/toggleFollow', { starId, action }),

  // Engagement
  toggleLike: (contentId, action) => request('/toggleLike', { contentId, action }),
  getFavorites: (page = 1) => request('/getFavorites', { page, pageSize: 20 }),
  shareReport: (contentId, shareTo) => request('/shareReport', { contentId, shareTo }),

  // Chat
  getChatRooms: () => request('/getChatRooms'),
  getStarMessages: (starId, page = 1) =>
    request('/getStarMessages', { starId, page }),
  replyToStar: (messageId, starId, text) =>
    request('/replyToStar', { messageId, starId, text }),

  // Vote
  getVotes: (page = 1) => request('/getVotes', { page }),
  getVoteDetail: (voteId) => request('/getVoteDetail', { voteId }),
  castVote: (voteId, optionIndex, count = 1) =>
    request('/castVote', { voteId, optionIndex, count }),

  // Q&A
  getQuestions: (starId, filter = 'answered', page = 1) =>
    request('/getQuestions', { starId, filter, page }),
  askQuestion: (starId, question, price = 1000) =>
    request('/askQuestion', { starId, question, price }),

  // Mall & Orders
  getGoodsList: (category = '', page = 1) =>
    request('/getGoodsList', { category, page }),
  getGoodsDetail: (goodsId) => request('/getGoodsDetail', { goodsId }),
  createMallOrder: (items, address) => request('/createMallOrder', { items, address }),
  getOrders: (status = '', page = 1) => request('/getOrders', { status, page }),

  // Member
  createMemberOrder: (starId, plan) => request('/createMemberOrder', { starId, plan }),
  getGroupLink: (starId) => request('/getGroupLink', { starId }),
};