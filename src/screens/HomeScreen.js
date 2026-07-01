import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, RefreshControl, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount } from '../utils';
import { useAuth } from '../store/auth';

const { width: W } = Dimensions.get('window');
const TAGS = ['热搜', '新晋顶流', '舞台高光', '会员专享', '粉丝活动', '本周上新'];

const MOCK_ALL = [
  { _id: 'mock-1', name: '顶流艺人 A', avatar: 'https://picsum.photos/seed/star1/200/200', badgeText: 'HOT · 舞台焦点', isHot: true, heatText: '98.6 万', fansText: '24.8 万', intro: '最新动态：直播预告已上线，今晚 8 点开启粉丝问答。', isFollowing: false, tag: '热搜' },
  { _id: 'mock-2', name: '人气歌手 B', avatar: 'https://picsum.photos/seed/star2/200/200', badgeText: 'NEW · 站内上新', isHot: false, heatText: '86.3 万', fansText: '18.2 万', intro: '最新动态：新专辑封面公开，评论区已开放粉丝打卡。', isFollowing: false, tag: '新晋顶流' },
  { _id: 'mock-3', name: '演员 C', avatar: 'https://picsum.photos/seed/star3/200/200', badgeText: 'LIVE · 正在连载', isHot: true, heatText: '75.4 万', fansText: '12.6 万', intro: '最新动态：幕后花絮更新，参与投票可解锁专属壁纸。', isFollowing: false, tag: '舞台高光' },
  { _id: 'mock-4', name: '偶像 D', avatar: 'https://picsum.photos/seed/star4/200/200', badgeText: 'VIP · 会员专享', isHot: false, heatText: '64.9 万', fansText: '9.1 万', intro: '最新动态：专属粉丝福利已发布，限时预约入口已开启。', isFollowing: false, tag: '会员专享' },
  { _id: 'mock-5', name: '实力唱将 E', avatar: 'https://picsum.photos/seed/star5/200/200', badgeText: 'HOT · 粉丝活动', isHot: true, heatText: '55.2 万', fansText: '15.3 万', intro: '最新动态：粉丝见面会即将开启，速来报名参加！', isFollowing: false, tag: '粉丝活动' },
  { _id: 'mock-6', name: '新锐偶像 F', avatar: 'https://picsum.photos/seed/star6/200/200', badgeText: 'NEW · 本周上新', isHot: false, heatText: '42.1 万', fansText: '8.7 万', intro: '最新动态：本周新人推荐，来认识一下新面孔吧。', isFollowing: false, tag: '本周上新' },
];

export default function HomeScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, checkLogin } = useAuth();
  const [activeTag, setActiveTag] = useState('热搜');
  const [stars, setStars] = useState(MOCK_ALL);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const filterStars = useCallback((tag) => {
    setLoading(true);
    setTimeout(() => {
      setStars(tag === '热搜' ? MOCK_ALL : MOCK_ALL.filter(s => s.tag === tag));
      setLoading(false);
    }, 400);
  }, []);

  function onSelectTag(tag) {
    setActiveTag(tag);
    filterStars(tag);
  }

  function onRefresh() {
    setRefreshing(true);
    setTimeout(() => {
      filterStars(activeTag);
      setRefreshing(false);
    }, 600);
  }

  function onFollow(item) {
    const next = !item.isFollowing;
    setStars(prev => prev.map(s => s._id === item._id ? { ...s, isFollowing: next } : s));
    Alert.alert('', next ? '已关注' : '已取消关注');
  }

  return (
    <ScrollView style={[styles.page, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.hpPink} />}>
      {/* Decorative orbs */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />

      {/* Brand row */}
      <View style={styles.brandRow}>
        <View style={styles.brand}>
          <LinearGradient colors={['#da97bc', '#5a8dff']} style={styles.brandBadge}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>★</Text>
          </LinearGradient>
          <Text style={styles.brandText}>星光主场</Text>
        </View>
        <TouchableOpacity style={[styles.loginEntry, isLoggedIn && styles.loginEntryActive]}
          onPress={async () => { if (!isLoggedIn) { await checkLogin(); nav.navigate('Search'); } }}>
          <Text style={{ fontSize: 13 }}>☺</Text>
          <Text style={[styles.loginText, isLoggedIn && { color: 'rgba(27,33,64,0.64)' }]}>{isLoggedIn ? '已登录' : '登录 / 注册'}</Text>
        </TouchableOpacity>
      </View>

      {/* Headline */}
      <View style={styles.headline}>
        <Text style={styles.kicker}>STAR FAN ZONE</Text>
        <Text style={styles.headlineTitle}>搜索你想追的明星，</Text>
        <Text style={styles.headlineTitle}>一键直达主场</Text>
        <Text style={styles.headlineDesc}>热门推荐标签与明星直达同时展示，先看热度，再直接选择你喜欢的人。</Text>
      </View>

      {/* Search shell */}
      <TouchableOpacity style={styles.searchShell} activeOpacity={0.9} onPress={() => nav.navigate('Search')}>
        <View style={styles.searchBox}>
          <View style={styles.searchIcon}><Text style={{ fontSize: 16, color: '#0f1430' }}>⌕</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.searchTitle}>搜索明星、昵称、IP</Text>
            <Text style={styles.searchHint}>输入关键词，快速找到你正在关注的那一位</Text>
          </View>
          <LinearGradient colors={[colors.hpPink, colors.hpBlue]} style={styles.searchAction}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>搜索</Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>

      {/* Tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll} contentContainerStyle={styles.tagRow}>
        {TAGS.map(t => (
          <TouchableOpacity key={t} style={[styles.tag, activeTag === t && styles.tagActive]} onPress={() => onSelectTag(t)}>
            <Text style={[styles.tagText, activeTag === t && styles.tagTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Hot strip */}
      <View style={styles.hotStrip}>
        <View style={{ flex: 1 }}>
          <Text style={styles.hotStripTitle}>热门推荐标签正在发光</Text>
          <Text style={styles.hotStripDesc}>点选后立即筛选下方明星列表</Text>
        </View>
        <Text style={styles.hotStripAction}>Trending</Text>
      </View>

      {/* Star grid */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>明星直达</Text>
          </View>
          <TouchableOpacity onPress={() => nav.navigate('StarList')}>
            <Text style={styles.sectionMore}>查看更多</Text>
          </TouchableOpacity>
        </View>

        {loading && <Text style={styles.statusText}>加载中...</Text>}
        {!loading && stars.length === 0 && <Text style={styles.statusText}>暂无明星数据</Text>}

        <View style={styles.starGrid}>
          {stars.map((item, index) => (
            <View key={item._id} style={[styles.starCard, index % 2 === 1 && styles.starCardAlt]}>
              <View style={[styles.cardBadge, item.isHot && styles.cardBadgeHot]}>
                <Text style={[styles.cardBadgeText, item.isHot && { color: '#6a4a00' }]}>{item.badgeText}</Text>
              </View>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.cardNameSub}>{index % 2 === 0 ? '艺人' : '歌手'}</Text>
                </View>
                <View style={[styles.cardAvatar, index % 2 === 1 && { backgroundColor: 'rgba(90,141,255,0.92)' }]}>
                  {item.avatar ? <Image source={{ uri: item.avatar }} style={{ width: '100%', height: '100%', borderRadius: 17 }} />
                    : <Text style={styles.cardAvatarInit}>{item.name[0]}</Text>}
                </View>
              </View>
              <Text style={styles.cardMeta} numberOfLines={2}>{item.intro}</Text>
              <View style={styles.cardStats}>
                <Text style={styles.cardStat}>热度 {item.heatText}</Text>
                <Text style={styles.cardStat}>粉丝团 {item.fansText}</Text>
              </View>
              <View style={styles.cardCta}>
                <TouchableOpacity style={styles.cardBtnPrimary} onPress={() => nav.navigate('Star', { starId: item._id, starName: item.name })}>
                  <Text style={styles.cardBtnPrimaryText}>进入主页</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cardBtnSecondary} onPress={() => onFollow(item)}>
                  <Text style={styles.cardBtnSecondaryText}>{item.isFollowing ? '已关注' : '关注'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fffaf6', paddingBottom: 20 },
  orb: { position: 'absolute', borderRadius: 999, opacity: 0.7 },
  orb1: { width: 130, height: 130, left: -38, top: 80, backgroundColor: 'rgba(255,95,184,0.10)' },
  orb2: { width: 160, height: 160, right: -68, top: 140, backgroundColor: 'rgba(90,141,255,0.10)' },
  orb3: { width: 180, height: 180, left: '50%', marginLeft: -90, bottom: 90, backgroundColor: 'rgba(246,195,95,0.08)' },
  brandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandBadge: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  brandText: { fontSize: 17, fontWeight: '800', color: colors.hpText, letterSpacing: 0.3 },
  loginEntry: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,95,184,0.10)' },
  loginEntryActive: { backgroundColor: 'rgba(255,255,255,0.72)' },
  loginText: { fontSize: 11, fontWeight: '600', color: colors.hpText },
  headline: { alignItems: 'center', paddingHorizontal: 16, paddingTop: 8 },
  kicker: { fontSize: 11, color: 'rgba(27,33,64,0.55)', letterSpacing: 2.5, marginBottom: 9 },
  headlineTitle: { fontSize: 28, fontWeight: '800', color: colors.hpText, lineHeight: 32, letterSpacing: -1 },
  headlineDesc: { fontSize: 13, color: colors.hpMuted, textAlign: 'center', marginTop: 9, lineHeight: 20, maxWidth: 280 },
  searchShell: { marginHorizontal: 11, marginTop: 15, padding: 10, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.88)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.10)', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.98)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.96)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3 },
  searchIcon: { width: 28, height: 28, borderRadius: 10, backgroundColor: 'rgba(255,95,184,0.14)', alignItems: 'center', justifyContent: 'center' },
  searchTitle: { fontSize: 15, fontWeight: '600', color: '#11162a' },
  searchHint: { fontSize: 11, color: 'rgba(17,22,42,0.56)', marginTop: 3 },
  searchAction: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 999 },
  tagScroll: { marginTop: 11 },
  tagRow: { flexDirection: 'row', gap: 7, paddingHorizontal: 11 },
  tag: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.70)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.10)' },
  tagActive: { backgroundColor: colors.hpPink, borderColor: 'transparent' },
  tagText: { fontSize: 12, color: 'rgba(27,33,64,0.86)' },
  tagTextActive: { color: '#fff', fontWeight: '600' },
  hotStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 11, marginTop: 9, marginBottom: 11, padding: 10, paddingHorizontal: 12, borderRadius: 15, backgroundColor: 'rgba(255,95,184,0.10)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.08)' },
  hotStripTitle: { fontSize: 13, fontWeight: '700', color: colors.hpText },
  hotStripDesc: { fontSize: 11, color: colors.hpMuted, marginTop: 2 },
  hotStripAction: { color: colors.hpPink, fontWeight: '700', fontSize: 12 },
  section: { paddingHorizontal: 11 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  sectionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.hpPink },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: 'rgba(27,33,64,0.90)' },
  sectionMore: { fontSize: 12, color: colors.hpMuted },
  statusText: { textAlign: 'center', padding: 20, color: colors.hpMuted, fontSize: 13 },
  starGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 },
  starCard: { width: (W - 22 - 12) / 2, marginHorizontal: 3, marginBottom: 9, borderRadius: 17, padding: 11, backgroundColor: 'rgba(255,255,255,0.90)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.10)', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 14, elevation: 4 },
  starCardAlt: {},
  cardBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.86)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.10)', marginBottom: 8 },
  cardBadgeHot: { backgroundColor: 'rgba(255,95,184,0.12)', borderColor: 'rgba(246,195,95,0.24)' },
  cardBadgeText: { fontSize: 10, color: 'rgba(27,33,64,0.84)' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  cardName: { fontSize: 14, fontWeight: '800', color: colors.hpText, flex: 1 },
  cardNameSub: { fontSize: 10, color: 'rgba(27,33,64,0.48)', marginTop: 1 },
  cardAvatar: { width: 60, height: 60, borderRadius: 17, backgroundColor: 'rgba(255,95,184,0.92)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,95,184,0.45)' },
  cardAvatarInit: { fontSize: 26, fontWeight: '800', color: 'rgba(255,255,255,0.9)' },
  cardMeta: { fontSize: 11, color: colors.hpMuted, lineHeight: 17, marginTop: 4, minHeight: 34 },
  cardStats: { flexDirection: 'row', gap: 4, marginTop: 6 },
  cardStat: { flex: 1, textAlign: 'center', fontSize: 9, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.72)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.08)' },
  cardCta: { flexDirection: 'row', gap: 5, marginTop: 8 },
  cardBtnPrimary: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: colors.hpPink, shadowColor: colors.hpPink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 3 },
  cardBtnPrimaryText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardBtnSecondary: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.74)', borderWidth: 1, borderColor: 'rgba(255,95,184,0.40)' },
  cardBtnSecondaryText: { color: 'rgba(27,33,64,0.88)', fontSize: 11, fontWeight: '700' },
});
