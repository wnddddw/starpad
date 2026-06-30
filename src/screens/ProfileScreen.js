import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';

const MENUS = [
  ['📦 我的订单', 'OrderList'], ['🔔 消息通知', 'Chat'],
  ['💎 我的会员', 'Member'], ['❤️ 我的关注', 'StarList'],
  ['⭐ 我的收藏', 'Favorites'], ['🗳️ 投票打投', 'VoteList'],
  ['💌 翻牌问答', 'QA'], ['🎫 优惠券', null],
  ['💬 客服中心', null], ['⚙️ 设置', null],
];

export default function ProfileScreen() {
  const nav = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [autoOpen, setAutoOpen] = useState(false);

  function onLogout() {
    Alert.alert('退出登录', '确定退出？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', onPress: () => setIsLoggedIn(false) },
    ]);
  }

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      {/* User card */}
      {isLoggedIn ? (
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}><Text style={{fontSize:24,color:'#fff'}}>☺</Text></View>
          <View style={{flex:1}}>
            <Text style={styles.userName}>演示用户</Text>
            <Text style={styles.userSub}>已登录，解锁全部追星体验</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.loginCard} onPress={() => setIsLoggedIn(true)}>
          <Text style={{fontSize:32}}>☺</Text>
          <Text style={styles.loginTitle}>登录 / 注册</Text>
        </TouchableOpacity>
      )}

      {/* Auto-open preference */}
      {isLoggedIn && (
        <View style={styles.prefCard}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View>
              <Text style={{fontSize:14,fontWeight:'600',color:colors.text}}>自动打开上次明星主页</Text>
              <Text style={{fontSize:11,color:colors.textMuted,marginTop:2}}>下次进入时直接跳转到你常看的明星</Text>
            </View>
            <Switch value={autoOpen} onValueChange={setAutoOpen} trackColor={{false:colors.border,true:colors.hpPink}} />
          </View>
        </View>
      )}

      {/* Menu grid */}
      <View style={styles.menuGrid}>
        {MENUS.map(([title, screen]) => (
          <TouchableOpacity key={title} style={styles.menuItem}
            onPress={() => screen ? nav.navigate(screen) : Alert.alert('', '功能开发中')}>
            <Text style={{fontSize:24}}>{title.slice(0,2)}</Text>
            <Text style={styles.menuLabel}>{title.slice(2)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoggedIn && (
        <TouchableOpacity style={styles.logout} onPress={onLogout}>
          <Text style={{color:colors.textMuted,fontSize:13}}>退出登录</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  userCard: { flexDirection:'row',alignItems:'center',gap:14,backgroundColor:'#fff',margin:12,borderRadius:16,padding:16 },
  avatarCircle: { width:52,height:52,borderRadius:26,backgroundColor:colors.hpPink,alignItems:'center',justifyContent:'center' },
  userName: { fontSize:16,fontWeight:'700',color:colors.text },
  userSub: { fontSize:12,color:colors.textMuted,marginTop:4 },
  loginCard: { alignItems:'center',backgroundColor:'#fff',margin:12,borderRadius:16,padding:24 },
  loginTitle: { fontSize:15,fontWeight:'600',color:colors.hpPink,marginTop:8 },
  prefCard: { backgroundColor:'#fff',marginHorizontal:12,borderRadius:16,padding:16,marginBottom:8 },
  menuGrid: { flexDirection:'row',flexWrap:'wrap',marginHorizontal:12,gap:8 },
  menuItem: { width:'18%',backgroundColor:'#fff',borderRadius:14,padding:10,alignItems:'center' },
  menuLabel: { fontSize:10,color:colors.textSecondary,marginTop:4,textAlign:'center' },
  logout: { alignItems:'center',padding:24 },
});
