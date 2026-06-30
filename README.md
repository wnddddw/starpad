# StarPad — 明星粉丝互动平台 (React Native + Expo)

跨平台原生 App（iOS + Android），对标微信小程序版 `mingxing`。

## 技术栈

- **框架**: React Native 0.76 + Expo SDK 52
- **导航**: React Navigation 7 (Native Stack + Bottom Tabs)
- **动画**: React Native Reanimated 3
- **渐变**: Expo Linear Gradient
- **后端**: 复用 mingxing 云函数 API

## 快速开始

```bash
npm install
npx expo start
```

- 手机安装 Expo Go，扫码预览
- 或按 `i` 启动 iOS 模拟器 / `a` 启动 Android 模拟器

## 项目结构

```
src/
├── api/index.js          # API 层（对标云函数）
├── theme/index.js        # 粉蓝品牌 Design Tokens
├── screens/              # 16 个原生页面
│   ├── HomeScreen         # 首页：双列明星卡片
│   ├── StarScreen         # 明星主页：Hero + 快捷功能
│   ├── ContentDetail      # 内容详情：点赞/收藏/分享
│   ├── ChatScreen         # 私信聊天室列表
│   ├── ChatRoomScreen     # Bubble 风格聊天
│   ├── VoteListScreen     # 投票列表
│   ├── VoteDetailScreen   # 投票详情 + 进度条
│   ├── QAScreen           # 翻牌问答
│   ├── QAAskScreen        # 提问表单
│   ├── MallScreen         # 商城商品网格
│   ├── GoodsDetailScreen  # 商品详情
│   ├── SearchScreen       # 搜索
│   ├── FavoritesScreen    # 我的收藏
│   ├── MemberScreen       # 会员订阅
│   ├── OrderListScreen    # 订单列表
│   └── ProfileScreen      # 个人中心
└── components/           # 可复用组件（待建设）
```

## 后端 API

API 层定义在 `src/api/index.js`，调用 mingxing 云函数。
部署前需将 `API_BASE` 替换为实际的云函数网关地址。

## 发布

```bash
# 构建 Android
eas build --platform android

# 构建 iOS
eas build --platform ios

# 提交审核
eas submit --platform ios
eas submit --platform android
```

## 许可证

Private — 仅供团队内部使用
