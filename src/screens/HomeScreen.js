import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
  RefreshControl, Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize, cardShadow } from '../theme';
import { api } from '../api';
import { formatCount } from '../utils';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.sm) / 2;

const TAGS = ['热搜', '新晋顶流', '舞台高光', '会员专享', '粉丝活动', '本周上新'];

// ── Mock data ──
const MOCK_STARS = [
  { _id: 's1', name: '张艺兴', avatar: '', category: '歌手', heatCount: 986000, followerCount: 248000,
    intro: '最新动态：直播预告已上线，今晚8点开启粉丝问答。', isHot: true },
  { _id: 's2', name: '肖战', avatar: '', category: '演员', heatCount: 863000, followerCount: 182000,
    intro: '最新动态：新专辑封面公开，评论区已开放粉丝打卡。', isHot: false },
  { _id: 's3', name: '杨幂', avatar: '', category: '演员', heatCount: 754000, followerCount: 126000,
    intro: '最新动态：幕后花絮更新，参与投票可解锁专属壁纸。', isHot: true },
  { _id: 's4', name: '王一博', avatar: '', category: '偶像', heatCount: 649000, followerCount: 91000,
    intro: '最新动态：专属粉丝福利已发布，限时预约入口已开启。', isHot: false },
];

export default function HomeScreen() {
  const nav = useNavigation();
  const [activeTag, setActiveTag] = useState('热搜');
  const [stars, setStars] = useState(MOCK_STARS);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadStars = useCallback(async (tag) => {
    try {
      const res = await api.getStarList(tag);
      if (res?.list?.length) {
        setStars(res.list);
        setError('');
      }
    } catch (_) {
      setError('加载失败，请下拉刷新重试');
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadStars(activeTag);
  }, [activeTag, loadStars]));

  function onRefresh() {
    setRefreshing(true);
    loadStars(activeTag).finally(() => setRefreshing(false));
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#fff8f3', '#f4f7ff']} style={styles.header}>
        <Text style={styles.headerTitle}>StarPad</Text>
        <TouchableOpacity style={styles.searchBtn} onPress={() => nav.navigate('Search')}>
          <Text style={{ fontSize: 16 }}>🔍</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Tags */}
      <View style={styles.tagRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={TAGS}
          keyExtractor={t => t}
          contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tag, activeTag === item && styles.tagActive]}
              onPress={() => setActiveTag(item)}>
              <Text style={[styles.tagText, activeTag === item && styles.tagTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Star Cards */}
      <FlatList
        data={stars}
        keyExtractor={s => s._id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}
        columnWrapperStyle={{ gap: spacing.sm, marginBottom: spacing.sm }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => nav.navigate('Star', { starId: item._id, starName: item.name })}>
            {/* Avatar */}
            <LinearGradient colors={item.isHot ? colors.gradientPink : ['#e8e8e8', '#d0d0d0']} style={styles.cardAvatarWrap}>
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.cardAvatar} />
              ) : (
                <Text style={styles.cardAvatarText}>{item.name[0]}</Text>
              )}
            </LinearGradient>
            {/* Info */}
            <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.cardCategory}>{item.category}</Text>
            <Text style={styles.cardIntro} numberOfLines={2}>{item.intro}</Text>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>♥ {formatCount(item.heatCount)}</Text>
              <Text style={styles.cardStat}>粉丝 {formatCount(item.followerCount)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{error || '暂无明星入驻'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md,
  },
  headerTitle: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },
  searchBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surfaceGlass, alignItems: 'center', justifyContent: 'center' },
  tagRow: { marginBottom: spacing.md },
  tag: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full,
    backgroundColor: colors.surface, marginRight: spacing.sm,
    borderWidth: 1, borderColor: 'transparent',
  },
  tagActive: { backgroundColor: '#fff0f6', borderColor: colors.pink },
  tagText: { fontSize: fontSize.sm, color: colors.textSecondary },
  tagTextActive: { color: colors.pink, fontWeight: '600' },
  card: {
    width: CARD_WIDTH, backgroundColor: colors.surface, borderRadius: radius.lg,
    padding: spacing.md, ...cardShadow,
  },
  cardAvatarWrap: {
    width: '100%', height: CARD_WIDTH * 0.7, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  cardAvatar: { width: '100%', height: '100%', borderRadius: radius.md },
  cardAvatarText: { fontSize: 36, color: '#fff', fontWeight: '700' },
  cardName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  cardCategory: { fontSize: fontSize.xs, color: colors.pink, marginBottom: 4 },
  cardIntro: { fontSize: fontSize.xs, color: colors.textSecondary, lineHeight: 16, marginBottom: 6 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between' },
  cardStat: { fontSize: 10, color: colors.textMuted },
  empty: { textAlign: 'center', padding: 60, color: colors.textMuted },
});