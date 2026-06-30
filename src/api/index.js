// StarPad API Layer — mirrors miniprogram cloud functions
// Auto-degrades to mock when API is unavailable

const API_BASE = 'https://your-cloud-function-domain.apigw.tencentcs.com';

import { mockApi } from '../utils/mock';

async function request(path, data = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API error: ' + res.status);
    const json = await res.json();
    // If server signals degraded mode, use mock
    if (json._mock) throw new Error('server-mock');
    return json;
  } catch (e) {
    console.warn('[api] API unavailable, using mock:', path);
    // Auto-degrade to mock
    if (typeof mockApi[path.slice(1)] === 'function') {
      return mockApi[path.slice(1)](data);
    }
    return null;
  }
}

export const api = {
  // Auth
  login: () => mockApi.login(),

  // Feed & Content
  getFeed: (page, keyword) => {
    if (keyword) return mockApi.getFeed({ keyword, page, pageSize: 20 });
    return mockApi.getFeed({ page, pageSize: 20 });
  },
  getContentDetail: (contentId) => mockApi.getContentDetail({ contentId }),
  getComments: (contentId, sort = 'hot', page = 1) =>
    mockApi.getComments({ contentId, sort, page, pageSize: 20 }),
  postComment: (contentId, text, replyTo = '') =>
    mockApi.postComment({ contentId, text, replyTo }),

  // Stars
  getStar: (starId) => mockApi.getStar({ starId }),
  getStarList: (keyword = '', page = 1) =>
    mockApi.getStarList({ keyword, page }),
  toggleFollow: (starId, action) => mockApi.toggleFollow({ starId, action }),

  // Engagement
  toggleLike: (contentId, action) => mockApi.toggleLike({ contentId, action }),
  getFavorites: (page = 1) => mockApi.getFeed({ page, pageSize: 20 }),

  // Member & Orders
  createMemberOrder: (starId, plan, autoRenew = true) =>
    mockApi.createMemberOrder({ starId, plan, autoRenew }),
  getGoodsList: (params = {}) => mockApi.getGoodsList(params),
  getGoodsDetail: (goodsId) => mockApi.getGoodsDetail({ goodsId }),
  createMallOrder: (items, address) => mockApi.createMallOrder({ items, address }),
  getOrders: (status = '', page = 1) => mockApi.getOrders({ status, page }),
  getOrderDetail: (orderId) => mockApi.getOrderDetail({ orderId }),

  // Onboarding
  getInterestTags: () => mockApi.getInterestTags(),
  getRecommendedStars: (params) => mockApi.getRecommendedStars(params),
  saveUserInterests: (params) => mockApi.saveUserInterests(params),

  // Notifications
  getNotifications: (page = 1) => mockApi.getNotifications({ page, pageSize: 20 }),
  markNotificationRead: (notificationId) => mockApi.markNotificationRead({ notificationId }),
};
