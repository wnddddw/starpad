import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme';
import { formatCount } from '../utils';

const TABS = ['全部', '歌手', '演员', '偶像', 'KOL', '虚拟IP'];
const MOCK = [
  { _id:'s1', name:'顶流艺人 A', avatar:'https://picsum.photos/seed/star1/100/100', category:'歌手', followerCount:1280000, isFollowing:false },
  { _id:'s2', name:'人气歌手 B', avatar:'https://picsum.photos/seed/star2/100/100', category:'歌手', followerCount:986000, isFollowing:true },
  { _id:'s3', name:'演员 C', avatar:'https://picsum.photos/seed/star3/100/100', category:'演员', followerCount:863000, isFollowing:false },
  { _id:'s4', name:'偶像 D', avatar:'https://picsum.photos/seed/star4/100/100', category:'偶像', followerCount:754000, isFollowing:false },
  { _id:'s5', name:'潜力新星 E', avatar:'https://picsum.photos/seed/star5/100/100', category:'KOL', followerCount:418000, isFollowing:false },
  { _id:'s6', name:'虚拟偶像 F', avatar:'https://picsum.photos/seed/star6/100/100', category:'虚拟IP', followerCount:543000, isFollowing:true },
];

export default function StarListScreen() {
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState('全部');
  const [stars, setStars] = useState(MOCK);
  const [refreshing, setRefreshing] = useState(false);

  function filterStars(cat) {
    setActiveTab(cat);
    setStars(cat === '全部' ? MOCK : MOCK.filter(s => s.category === cat));
  }

  function onFollow(item) {
    const next = !item.isFollowing;
    setStars(prev => prev.map(s => s._id === item._id ? { ...s, isFollowing: next } : s));
    Alert.alert('', next ? '已关注' : '已取消关注');
  }

  function onRefresh() { setRefreshing(true); setTimeout(() => { filterStars(activeTab); setRefreshing(false); }, 600); }

  return (
    <View style={styles.page}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.searchBar} onPress={() => nav.navigate('Search')}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>🔍 搜索明星</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('Search')}>
          <Text style={{ fontSize: 13, color: colors.hpPink, fontWeight: '600' }}>按兴趣找人</Text>
        </TouchableOpacity>
      </View>

      <FlatList horizontal showsHorizontalScrollIndicator={false} data={TABS} keyExtractor={t => t}
        contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.tab, activeTab === item && styles.tabActive]} onPress={() => filterStars(item)}>
            <Text style={[styles.tabText, activeTab === item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList data={stars} keyExtractor={s => s._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.hpPink} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 60, color: colors.textMuted }}>暂无明星入驻</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => nav.navigate('Star', { starId: item._id, starName: item.name })}>
            <View style={styles.avatar}><Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{item.name[0]}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.hpText }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{item.category} · 粉丝 {formatCount(item.followerCount)}</Text>
            </View>
            <TouchableOpacity style={[styles.followBtn, item.isFollowing && styles.followBtnActive]} onPress={() => onFollow(item)}>
              <Text style={[styles.followText, item.isFollowing && { color: colors.textSecondary }]}>{item.isFollowing ? '已关注' : '+ 关注'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  topRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 8, gap: 8 },
  searchBar: { flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  tab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: '#fff', marginRight: 8 },
  tabActive: { backgroundColor: colors.hpPink },
  tabText: { fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
  followBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, backgroundColor: colors.hpPink },
  followBtnActive: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: colors.border },
  followText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
