import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function FavoritesScreen() {
  const nav = useNavigation();
  const [list, setList] = useState([]);

  useFocusEffect(useCallback(() => {
    api.getFavorites().then(res => { if (res?.list) setList(res.list); }).catch(() => {
      setList([
        { _id: 'f1', contentId: 'c1', title: '夏日限定写真集分享', starName: '张艺兴', timeAgo: '2小时前', likeCount: 234, collectCount: 89 },
        { _id: 'f2', contentId: 'c2', title: '新专辑独家幕后花絮', starName: '肖战', timeAgo: '昨天', likeCount: 567, collectCount: 123 },
      ]);
    });
  }, []));

  async function onRemove(item, index) {
    await api.toggleLike(item.contentId, 'uncollect');
    setList(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={f => f._id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={<Text style={styles.empty}>还没有收藏内容{'\n'}浏览内容时点击 ★ 即可收藏</Text>}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={styles.card}
            onPress={() => nav.navigate('ContentDetail', { contentId: item.contentId })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>{item.starName} · {item.timeAgo}</Text>
              <Text style={styles.stats}>♥ {item.likeCount} · ★ {item.collectCount}</Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item, index)}>
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { textAlign: 'center', padding: 80, fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 22 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  title: { fontSize: fontSize.base, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: 2 },
  stats: { fontSize: 10, color: colors.textMuted },
  removeBtn: { padding: spacing.sm },
});