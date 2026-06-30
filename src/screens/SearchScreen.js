import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function SearchScreen() {
  const nav = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [hotTags] = useState(['张艺兴', '肖战', '杨幂', '王一博', '周杰伦', '舞台高光', '新专辑']);

  async function onSearch() {
    if (!keyword.trim()) return;
    try {
      const res = await api.getStarList(keyword);
      if (res?.list) setResults(res.list);
    } catch (_) {
      setResults([{ _id: 's1', name: '张艺兴', category: '歌手', followerCount: 248000 }]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.input} value={keyword} onChangeText={setKeyword}
          placeholder="搜索明星、内容..." placeholderTextColor={colors.textMuted}
          returnKeyType="search" onSubmitEditing={onSearch} />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* Hot tags */}
      <View style={styles.tagWrap}>
        {hotTags.map(t => (
          <TouchableOpacity key={t} style={styles.tag} onPress={() => { setKeyword(t); onSearch(); }}>
            <Text style={styles.tagText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={results}
        keyExtractor={r => r._id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem}
            onPress={() => nav.navigate('Star', { starId: item._id, starName: item.name })}>
            <Text style={styles.resultName}>{item.name}</Text>
            <Text style={styles.resultMeta}>{item.category} · 粉丝 {item.followerCount ? (item.followerCount / 10000).toFixed(1) + '万' : '0'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  searchBar: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: '#fff' },
  input: { flex: 1, height: 40, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, fontSize: 14 },
  searchBtn: { backgroundColor: colors.pink, borderRadius: 20, paddingHorizontal: 20, justifyContent: 'center' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.lg, gap: spacing.sm },
  tag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, backgroundColor: '#fff' },
  tagText: { fontSize: fontSize.sm, color: colors.textSecondary },
  resultItem: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  resultName: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  resultMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
});