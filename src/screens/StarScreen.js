import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StyleSheet,
  Dimensions, Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize, cardShadow } from '../theme';
import { api } from '../api';
import { formatCount } from '../utils';

const { width } = Dimensions.get('window');

export default function StarScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { starId, starName } = route.params || {};
  const [star, setStar] = useState(null);
  const [contents, setContents] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadStar();
  }, [starId]);

  async function loadStar() {
    setLoadError(false);
    try {
      const res = await api.getStar(starId);
      if (res?.star) {
        setStar(res.star);
        setContents(res.contents || []);
        setIsFollowing(!!res.isFollowing);
        setFollowerCount(res.star.followerCount || 0);
        return;
      }
    } catch (_) {}
    // Mock fallback
    setLoadError(true);
    setStar({ _id: starId, name: starName || '明星', avatar: '', intro: '当红焦点艺人，持续输出高质量内容。', cover: '' });
    setContents([
      { _id: 'c1', title: '直播预告：今晚8点开启粉丝问答', summary: '准备好你的问题，今晚直播间见！', timeText: '10分钟前', coverImage: '' },
      { _id: 'c2', title: '新舞台幕后花絮公开', summary: '排练花絮首次公开，看看幕后的精彩瞬间。', timeText: '2小时前', coverImage: '' },
      { _id: 'c3', title: '粉丝见面会精彩回顾', summary: '上周的见面会圆满结束，感谢每一位到场的你。', timeText: '1天前', coverImage: '' },
    ]);
    setFollowerCount(128000);
  }

  async function onFollow() {
    const action = isFollowing ? 'unfollow' : 'follow';
    try {
      await api.toggleFollow(starId, action);
      setIsFollowing(!isFollowing);
      setFollowerCount(c => c + (isFollowing ? -1 : 1));
    } catch (_) {}
  }

  async function onGroupLink() {
    try {
      const res = await api.getGroupLink(starId);
      const list = res?.list || [];
      if (list.length === 0) Alert.alert('提示', '该明星暂未开通粉丝群');
      else Alert.alert('粉丝群', list[0].qrCodeUrl ? '请查看群二维码' : '请复制群链接加入');
    } catch (_) { Alert.alert('提示', '暂未开通'); }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <LinearGradient colors={colors.gradientHero} style={styles.heroCover}>
          {star?.cover ? <Image source={{ uri: star.cover }} style={styles.heroCoverImg} /> : null}
        </LinearGradient>
        <View style={styles.heroBody}>
          <View style={styles.heroAvatarWrap}>
            {star?.avatar ? (
              <Image source={{ uri: star.avatar }} style={styles.heroAvatar} />
            ) : (
              <LinearGradient colors={colors.gradientPink} style={styles.heroAvatarPlaceholder}>
                <Text style={styles.heroAvatarText}>{(star?.name || 'S')[0]}</Text>
              </LinearGradient>
            )}
          </View>
          <Text style={styles.heroName}>{star?.name || ''}</Text>
          <Text style={styles.heroIntro}>{star?.intro || ''}</Text>
          <View style={styles.heroStats}>
            <Text style={styles.heroStat}>粉丝 {formatCount(followerCount)}</Text>
            <Text style={styles.heroStat}>动态 {contents.length} 条</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.heroBtns}>
          <TouchableOpacity style={styles.btnPrimary} onPress={onFollow}>
            <Text style={styles.btnPrimaryText}>{isFollowing ? '♥ 已关注' : '+ 关注明星'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.navigate('ChatRoom', { starId, starName: star?.name })}>
            <Text style={styles.btnSecondaryText}>💬 私信</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => nav.navigate('Member', { starId })}>
            <Text style={styles.btnSecondaryText}>会员</Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickItem} onPress={() => nav.navigate('VoteList')}>
            <Text style={styles.quickIcon}>🗳️</Text>
            <Text style={styles.quickLabel}>投票打投</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem} onPress={() => nav.navigate('QA', { starId, starName: star?.name })}>
            <Text style={styles.quickIcon}>💌</Text>
            <Text style={styles.quickLabel}>翻牌问答</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem} onPress={onGroupLink}>
            <Text style={styles.quickIcon}>👥</Text>
            <Text style={styles.quickLabel}>粉丝群</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem} onPress={() => nav.navigate('MallTab')}>
            <Text style={styles.quickIcon}>🛒</Text>
            <Text style={styles.quickLabel}>商城</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Feed */}
      <View style={styles.feedSection}>
        {loadError && <Text style={{ textAlign: 'center', fontSize: 11, color: colors.textMuted, marginBottom: spacing.sm }}>⚠ 网络异常，显示示例内容</Text>}
        <Text style={styles.feedTitle}>最新动态</Text>
        {contents.map(item => (
          <TouchableOpacity key={item._id} style={styles.feedCard}
            onPress={() => nav.navigate('ContentDetail', { contentId: item._id })}>
            <View style={styles.feedTop}>
              <View style={styles.feedAvatarSm}>
                <Text style={{ fontSize: 14, color: '#fff' }}>{(star?.name || 'S')[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.feedCardTitle}>{item.title}</Text>
                <Text style={styles.feedTime}>{item.timeText}</Text>
              </View>
            </View>
            <Text style={styles.feedSummary} numberOfLines={2}>{item.summary}</Text>
            {item.coverImage ? <Image source={{ uri: item.coverImage }} style={styles.feedImage} /> : null}
            <Text style={styles.feedLink}>查看详情 ›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { marginBottom: spacing.md },
  heroCover: { width, height: 160, backgroundColor: '#f0f0f0' },
  heroCoverImg: { width: '100%', height: '100%' },
  heroBody: { alignItems: 'center', marginTop: -40, paddingHorizontal: spacing.lg },
  heroAvatarWrap: { marginBottom: spacing.sm },
  heroAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
  heroAvatarPlaceholder: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  heroAvatarText: { fontSize: 30, color: '#fff', fontWeight: '700' },
  heroName: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  heroIntro: { fontSize: fontSize.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm },
  heroStats: { flexDirection: 'row', gap: 20, marginBottom: spacing.lg },
  heroStat: { fontSize: fontSize.xs, color: colors.textMuted },
  heroBtns: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  btnPrimary: { flex: 1, paddingVertical: 10, borderRadius: radius.full, backgroundColor: colors.pink, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: fontSize.sm },
  btnSecondary: { flex: 1, paddingVertical: 10, borderRadius: radius.full, backgroundColor: colors.surfaceGlass, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.textSecondary, fontWeight: '600', fontSize: fontSize.xs },
  quickRow: { flexDirection: 'row', marginHorizontal: spacing.lg, gap: spacing.sm },
  quickItem: { flex: 1, backgroundColor: colors.surfaceGlass, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: 10, color: colors.textMuted },
  feedSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  feedTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  feedCard: { backgroundColor: colors.surfaceGlass, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm, ...cardShadow, borderWidth: 1, borderColor: colors.border },
  feedTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  feedAvatarSm: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
  feedCardTitle: { fontSize: fontSize.base, fontWeight: '600', color: colors.textPrimary },
  feedTime: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  feedSummary: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  feedImage: { width: '100%', height: 180, borderRadius: radius.md, marginBottom: spacing.sm },
  feedLink: { fontSize: fontSize.sm, color: colors.pink, fontWeight: '600' },
});