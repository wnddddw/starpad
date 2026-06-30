import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

const MOCK_FEED = [
  { _id:'feed-1', starId:'star-1', starName:'顶流艺人 A', starAvatar:'', title:'直播预告：今晚 8 点开启粉丝问答环节', timeAgo:'10 分钟前', likeText:'1.2 万', commentCount:328, media:[] },
  { _id:'feed-2', starId:'star-2', starName:'人气歌手 B', starAvatar:'', title:'新专辑封面公开，评论区已开放打卡', timeAgo:'28 分钟前', likeText:'986', commentCount:142, media:[] },
  { _id:'feed-3', starId:'star-3', starName:'演员 C', starAvatar:'', title:'幕后花絮更新：参与投票可解锁专属壁纸', timeAgo:'1 小时前', likeText:'2.8 万', commentCount:567, media:[] },
  { _id:'feed-4', starId:'star-4', starName:'偶像 D', starAvatar:'', title:'专属粉丝福利已发布，限时预约入口已开启', timeAgo:'2 小时前', likeText:'765', commentCount:89, media:[] },
];

export default function HotScreen() {
  const nav = useNavigation();
  const [feedList] = useState(MOCK_FEED);
  const [refreshing, setRefreshing] = useState(false);

  function onRefresh() { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }

  return (
    <View style={styles.page}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>✦</Text>
        <Text style={styles.heroTitle}>热门动态</Text>
        <Text style={styles.heroDesc}>关注明星的最新内容与粉丝热议</Text>
      </View>

      <FlatList
        data={feedList}
        keyExtractor={f => f._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.hpPink} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header */}
            <TouchableOpacity style={styles.head} onPress={() => nav.navigate('Star', { starId: item.starId, starName: item.starName })}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.starName[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.starName}>{item.starName}</Text>
                <Text style={styles.time}>{item.timeAgo}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
            {/* Content */}
            <Text style={styles.title}>{item.title}</Text>
            {item.media?.[0] ? <Image source={{ uri: item.media[0] }} style={styles.image} /> : null}
            {/* Actions */}
            <TouchableOpacity style={styles.actions} onPress={() => nav.navigate('ContentDetail', { contentId: item._id })}>
              <Text style={styles.stat}>♥ {item.likeText}</Text>
              <Text style={styles.stat}>✎ {item.commentCount || 0}</Text>
              <Text style={styles.link}>查看详情</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bgWarm,
  },
  hero: { alignItems: 'center', paddingVertical: 18, paddingTop: 14 },
  heroIcon: { fontSize: 26, color: colors.hpGold, marginBottom: 4 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: colors.hpText },
  heroDesc: { fontSize: 12, color: colors.hpMuted, marginTop: 6 },
  card: {
    padding: 12, borderRadius: 14, marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.92)', borderWidth: 1, borderColor: 'rgba(90,110,170,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  avatar: { width: 36, height: 36, borderRadius: 11, backgroundColor: 'rgba(255,95,184,0.24)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.hpText },
  starName: { fontSize: 14, fontWeight: '700', color: colors.hpText },
  time: { fontSize: 11, color: colors.hpMuted, marginTop: 2 },
  arrow: { fontSize: 18, color: 'rgba(27,33,64,0.28)' },
  title: { fontSize: 14, lineHeight: 23, color: 'rgba(27,33,64,0.84)', marginBottom: 7 },
  image: { width: '100%', borderRadius: 11, marginBottom: 8, height: 200 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(90,110,170,0.06)' },
  stat: { fontSize: 12, color: colors.hpMuted },
  link: { fontSize: 12, color: colors.hpPink, fontWeight: '600' },
});
