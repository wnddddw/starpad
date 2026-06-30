import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';

const MENUS = [
  { icon: '💬', title: '我的私信', screen: 'Chat' },
  { icon: '📦', title: '我的订单', screen: 'OrderList' },
  { icon: '💎', title: '我的会员', screen: 'Member' },
  { icon: '⭐', title: '我的收藏', screen: 'Favorites' },
  { icon: '🗳️', title: '投票打投', screen: 'VoteList' },
];

export default function ProfileScreen() {
  const nav = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User card */}
      {isLoggedIn ? (
        <LinearGradient colors={['#fff8f3', '#f4f7ff']} style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 28, color: '#fff' }}>😊</Text>
          </View>
          <Text style={styles.userName}>微信用户</Text>
          <Text style={styles.userSub}>已登录，可进入完整追星体验</Text>
        </LinearGradient>
      ) : (
        <TouchableOpacity style={styles.loginCard}>
          <Text style={{ fontSize: 32 }}>☺</Text>
          <Text style={styles.loginTitle}>登录 / 注册</Text>
        </TouchableOpacity>
      )}

      {/* Menu grid */}
      <View style={styles.menuGrid}>
        {MENUS.map(m => (
          <TouchableOpacity key={m.title} style={styles.menuItem} onPress={() => nav.navigate(m.screen)}>
            <Text style={styles.menuIcon}>{m.icon}</Text>
            <Text style={styles.menuLabel}>{m.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>退出登录</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  userCard: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  userName: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },
  userSub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4 },
  loginCard: { alignItems: 'center', padding: spacing.xxl, backgroundColor: '#fff', marginHorizontal: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.lg },
  loginTitle: { fontSize: fontSize.md, color: colors.pink, marginTop: spacing.sm },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: spacing.lg, gap: spacing.md },
  menuItem: { width: '30%', backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.sm },
  menuIcon: { fontSize: 28, marginBottom: spacing.sm },
  menuLabel: { fontSize: fontSize.sm, color: colors.textPrimary },
  logoutBtn: { alignItems: 'center', padding: spacing.lg, marginTop: spacing.xl },
});