import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize } from '../theme';
import { useAuth } from '../store/auth';

const MENUS = [
  ['💬', '我的私信', 'Chat'],
  ['📦', '我的订单', 'OrderList'],
  ['💎', '我的会员', 'Member'],
  ['❤️', '我的关注', 'StarList'],
  ['⭐', '我的收藏', 'Favorites'],
  ['🗳️', '投票打投', 'VoteList'],
  ['💌', '翻牌问答', 'QA'],
  ['🎫', '优惠福利', null],
  ['💬', '客服中心', null],
];

export default function ProfileScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, userInfo, checkLogin, logout, autoOpenLastStar, saveAutoOpenPreference } = useAuth();

  return (
    <ScrollView style={[styles.page, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      {isLoggedIn ? (
        <View style={styles.userCard}>
          <View style={styles.avatar}><Text style={{ fontSize: 24, color: '#fff' }}>☺</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{userInfo?.nickname || '演示用户'}</Text>
            <Text style={styles.userSub}>已登录，解锁全部追星体验</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.loginCard} onPress={checkLogin}>
          <Text style={{ fontSize: 32 }}>☺</Text>
          <Text style={styles.loginTitle}>登录 / 注册</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>登录后可查看会员、订单等功能</Text>
        </TouchableOpacity>
      )}

      <View style={styles.prefCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>启动时自动回到上次明星主页</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>适合持续追更同一位明星的动态与会员内容</Text>
          </View>
          <Switch value={autoOpenLastStar} onValueChange={saveAutoOpenPreference} trackColor={{ false: colors.border, true: colors.hpPink }} />
        </View>
      </View>

      {isLoggedIn && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>我的会员</Text>
          <View style={styles.memberRow}>
            <View style={styles.memberAvatar}><Text style={{ color: '#fff', fontSize: 14 }}>S</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>最近浏览明星</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>年卡会员 · 30 天后到期</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.menuGrid}>
        {MENUS.map(([icon, title, screen]) => (
          <TouchableOpacity key={title} style={styles.menuItem}
            onPress={() => screen ? nav.navigate(screen) : Alert.alert('', '功能开发中')}>
            <Text style={{ fontSize: 22 }}>{icon}</Text>
            <Text style={styles.menuLabel}>{title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoggedIn && (
        <TouchableOpacity style={styles.logout} onPress={() => {
          Alert.alert('退出登录', '确定退出？', [{ text: '取消', style: 'cancel' }, { text: '退出', onPress: logout }]);
        }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>退出登录</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '700', color: colors.text },
  userSub: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  loginCard: { alignItems: 'center', backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 24 },
  loginTitle: { fontSize: 15, fontWeight: '600', color: colors.hpPink, marginTop: 8 },
  prefCard: { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 14, padding: 16, marginBottom: 8 },
  section: { backgroundColor: '#fff', marginHorizontal: 12, borderRadius: 14, padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 12, gap: 8 },
  menuItem: { width: '18%', backgroundColor: '#fff', borderRadius: 14, padding: 10, alignItems: 'center' },
  menuLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  logout: { alignItems: 'center', padding: 24 },
});
