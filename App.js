import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import HotScreen from './src/screens/HotScreen';
import StarListScreen from './src/screens/StarListScreen';
import StarScreen from './src/screens/StarScreen';
import MallScreen from './src/screens/MallScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ContentDetailScreen from './src/screens/ContentDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import MemberScreen from './src/screens/MemberScreen';
import OrderListScreen from './src/screens/OrderListScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import GoodsDetailScreen from './src/screens/GoodsDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import ChatRoomScreen from './src/screens/ChatRoomScreen';
import QAScreen from './src/screens/QAScreen';
import QAAskScreen from './src/screens/QAAskScreen';
import VoteListScreen from './src/screens/VoteListScreen';
import VoteDetailScreen from './src/screens/VoteDetailScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = { home: '🏠', hot: '🔥', mall: '🛒', profile: '👤' };
  const titles = { home: '首页', hot: '热门', mall: '商城', profile: '我的' };
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>{icons[label] || '●'}</Text>
      <Text style={{
        fontSize: 10, marginTop: 2,
        color: focused ? '#d96c4c' : '#8d7f73',
        fontWeight: focused ? '600' : '400',
      }}>{titles[label]}</Text>
    </View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#fffdfb', borderTopColor: '#eadfd7',
        height: 56 + insets.bottom, paddingBottom: insets.bottom, paddingTop: 4,
      },
      tabBarShowLabel: false,
    }}>
      <Tab.Screen name="HomeTab" component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="home" focused={focused} /> }} />
      <Tab.Screen name="HotTab" component={HotScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="hot" focused={focused} /> }} />
      <Tab.Screen name="MallTab" component={MallScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="mall" focused={focused} /> }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="profile" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: '#fff8f3' },
        headerTintColor: '#201d1a',
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f6f2ee' },
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Star" component={StarScreen} options={({ route }) => ({ title: route.params?.starName || '明星空间' })} />
        <Stack.Screen name="StarList" component={StarListScreen} options={{ title: '明星列表' }} />
        <Stack.Screen name="ContentDetail" component={ContentDetailScreen} options={{ title: '内容详情' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: '搜索' }} />
        <Stack.Screen name="Member" component={MemberScreen} options={{ title: '开通会员' }} />
        <Stack.Screen name="OrderList" component={OrderListScreen} options={{ title: '我的订单' }} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: '订单详情' }} />
        <Stack.Screen name="GoodsDetail" component={GoodsDetailScreen} options={{ title: '商品详情' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: '我的私信' }} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: '聊天室' }} />
        <Stack.Screen name="QA" component={QAScreen} options={{ title: '翻牌问答' }} />
        <Stack.Screen name="QAAsk" component={QAAskScreen} options={{ title: '提问' }} />
        <Stack.Screen name="VoteList" component={VoteListScreen} options={{ title: '投票打投' }} />
        <Stack.Screen name="VoteDetail" component={VoteDetailScreen} options={{ title: '投票详情' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: '我的收藏' }} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
