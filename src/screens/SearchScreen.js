import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount } from '../utils';

const HOT = ['热门搜索', '新晋顶流', '舞台高光', '热搜制造机', '综艺爆点', '演唱会现场', '关注明星', '返图更新', '应援周边'];

export default function SearchScreen() {
  const nav = useNavigation();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState('star');

  return (
    <View style={styles.page}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput style={styles.input} value={keyword} onChangeText={setKeyword}
          placeholder="搜索明星、内容" placeholderTextColor={colors.textMuted}
          returnKeyType="search" autoFocus />
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* Hot tags */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>热门搜索</Text>
        <View style={styles.tagWrap}>
          {HOT.map((t, i) => (
            <TouchableOpacity key={i} style={[styles.tag, i===0 && styles.tagActive]}
              onPress={() => setKeyword(t)}>
              <Text style={[styles.tagText, i===0 && { color: '#fff', fontWeight: '700' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results would go here if we had search API wired */}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  searchBar: { flexDirection: 'row', gap: 10, padding: 16, backgroundColor: '#fff' },
  input: { flex: 1, height: 42, backgroundColor: colors.bgSoft, borderRadius: 16, paddingHorizontal: 16, fontSize: 14 },
  btn: { backgroundColor: colors.hpPink, borderRadius: 16, paddingHorizontal: 20, justifyContent: 'center' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.hpText, marginBottom: 12 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, backgroundColor: '#fff' },
  tagActive: { backgroundColor: colors.hpPink },
  tagText: { fontSize: 12, color: colors.textSecondary },
});
