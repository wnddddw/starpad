import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSize } from '../theme';
import { formatCount } from '../utils';

const HOT = ['新晋顶流', '舞台高光', '热搜制造机', '综艺爆点', '演唱会现场', '关注明星', '返图更新', '应援周边'];
const MOCK_STARS = [
  { _id:'s1', name:'顶流艺人 A', category:'歌手', followerCount:1280000 },
  { _id:'s2', name:'人气歌手 B', category:'歌手', followerCount:986000 },
  { _id:'s3', name:'演员 C', category:'演员', followerCount:863000 },
  { _id:'s4', name:'偶像 D', category:'偶像', followerCount:754000 },
];
const MOCK_CONTENTS = [
  { _id:'c1', title:'舞台返图释出，今晚高能拉满', body:'灯光、镜头都卡在最准的点位', likeCount:12800, commentCount:308, starName:'顶流艺人 A' },
  { _id:'c2', title:'新歌排练现场，提前感受开场氛围', body:'排练画面保留了走位和节拍', likeCount:9400, commentCount:186, starName:'人气歌手 B' },
];

export default function SearchScreen() {
  const nav = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('star');
  const [starResults, setStarResults] = useState([]);
  const [contentResults, setContentResults] = useState([]);
  const [searched, setSearched] = useState(false);

  function doSearch(kw) {
    const q = (kw || keyword).trim();
    if (!q) return;
    setSearched(true);
    setStarResults(MOCK_STARS.filter(s => s.name.includes(q)));
    setContentResults(MOCK_CONTENTS.filter(c => c.title.includes(q) || c.body.includes(q)));
    setHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 10));
  }

  function onTapHot(kw) { setKeyword(kw); doSearch(kw); }
  function onTapHistory(kw) { setKeyword(kw); doSearch(kw); }

  const showPreSearch = !searched && !keyword;

  return (
    <View style={styles.page}>
      <View style={styles.searchBar}>
        <TextInput style={styles.input} value={keyword} onChangeText={setKeyword} placeholder="搜索明星、内容" placeholderTextColor={colors.textMuted} returnKeyType="search" onSubmitEditing={() => doSearch()} autoFocus />
        <TouchableOpacity style={styles.btn} onPress={() => doSearch()}><Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>搜索</Text></TouchableOpacity>
      </View>

      {showPreSearch && (
        <View style={{ padding: 16 }}>
          {history.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: colors.hpText }}>搜索历史</Text>
                <TouchableOpacity onPress={() => setHistory([])}><Text style={{ fontSize: 11, color: colors.textMuted }}>清空</Text></TouchableOpacity>
              </View>
              <View style={styles.tagWrap}>
                {history.map((h, i) => (
                  <TouchableOpacity key={i} style={styles.tag} onPress={() => onTapHistory(h)}><Text style={{ fontSize: 12, color: colors.textSecondary }}>{h}</Text></TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <Text style={{ fontWeight: '700', fontSize: 14, color: colors.hpText, marginBottom: 8 }}>热门搜索</Text>
          <View style={styles.tagWrap}>
            {HOT.map((h, i) => (
              <TouchableOpacity key={i} style={[styles.tag, i < 2 && styles.tagHot]} onPress={() => onTapHot(h)}>
                <Text style={{ fontSize: 12, color: i < 2 ? colors.priceRed : colors.textSecondary }}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {searched && (
        <>
          <View style={styles.tabRow}>
            <TouchableOpacity style={[styles.tab, activeTab === 'star' && styles.tabActive]} onPress={() => { setActiveTab('star'); doSearch(); }}>
              <Text style={[styles.tabText, activeTab === 'star' && styles.tabTextActive]}>明星</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, activeTab === 'content' && styles.tabActive]} onPress={() => { setActiveTab('content'); doSearch(); }}>
              <Text style={[styles.tabText, activeTab === 'content' && styles.tabTextActive]}>内容</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={activeTab === 'star' ? starResults : contentResults}
            keyExtractor={item => item._id}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 40, color: colors.textMuted }}>{activeTab === 'star' ? '未找到相关明星' : '未找到相关内容'}</Text>}
            renderItem={({ item }) => activeTab === 'star' ? (
              <TouchableOpacity style={styles.result} onPress={() => nav.navigate('Star', { starId: item._id, starName: item.name })}>
                <View style={styles.avatar}><Text style={{ color: '#fff', fontWeight: '700' }}>{item.name[0]}</Text></View>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '600', fontSize: 14, color: colors.hpText }}>{item.name}</Text><Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{item.category} · 粉丝 {formatCount(item.followerCount)}</Text></View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.result} onPress={() => nav.navigate('ContentDetail', { contentId: item._id })}>
                <View style={{ flex: 1 }}><Text style={{ fontWeight: '600', fontSize: 14, color: colors.hpText }}>{item.title}</Text><Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }} numberOfLines={2}>{item.body}</Text><Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>♥ {formatCount(item.likeCount)} · 💬 {item.commentCount}</Text></View>
              </TouchableOpacity>
            )
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  searchBar: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: '#fff' },
  input: { flex: 1, height: 42, backgroundColor: colors.bgSoft, borderRadius: 16, paddingHorizontal: 16, fontSize: 14 },
  btn: { backgroundColor: colors.hpPink, borderRadius: 16, paddingHorizontal: 20, justifyContent: 'center' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: '#fff' },
  tagHot: { backgroundColor: '#FFF5F5' },
  tabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 8 },
  tab: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 999 },
  tabActive: { backgroundColor: colors.hpPink },
  tabText: { fontSize: 13, color: colors.textSecondary },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  result: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
});
