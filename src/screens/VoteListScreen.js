import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize, cardShadow } from '../theme';
import { api } from '../api';

const MOCK = [
  { _id: 'v1', title: '2026年度最佳人气明星评选', starName: '多明星', totalVotes: 128000, timeLeft: 5, isActive: true, leader: { name: '张艺兴', count: 43200 } },
  { _id: 'v2', title: '新专辑封面Pick', starName: '肖战', totalVotes: 89000, timeLeft: 2, isActive: true, leader: { name: '方案A', count: 31200 } },
  { _id: 'v3', title: '下月粉丝见面会城市投票', starName: '杨幂', totalVotes: 45600, timeLeft: 0, isActive: false, leader: { name: '上海', count: 18900 } },
];

export default function VoteListScreen() {
  const nav = useNavigation();
  const [votes, setVotes] = useState(MOCK);

  useFocusEffect(useCallback(() => {
    api.getVotes().then(res => { if (res?.list?.length) setVotes(res.list); }).catch(() => {});
  }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={votes}
        keyExtractor={v => v._id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, !item.isActive && { opacity: 0.7 }]}
            onPress={() => nav.navigate('VoteDetail', { voteId: item._id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={[styles.badge, item.isActive ? styles.badgeActive : null]}>
                <Text style={[styles.badgeText, item.isActive && { color: colors.like }]}>
                  {item.isActive ? '剩余' + item.timeLeft + '天' : '已结束'}
                </Text>
              </View>
            </View>
            <Text style={styles.meta}>{item.starName} · {item.totalVotes || 0} 人已投票</Text>
            {item.leader && (
              <View style={styles.leaderRow}>
                <Text style={styles.leaderLabel}>🥇 当前领先</Text>
                <Text style={styles.leaderName}>{item.leader.name}</Text>
                <Text style={styles.leaderCount}>{item.leader.count || 0} 票</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md, ...cardShadow },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  title: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: '#f0f0f0' },
  badgeActive: { backgroundColor: '#fef0f0' },
  badgeText: { fontSize: 10, color: colors.textMuted },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm, backgroundColor: '#fef5e7', borderRadius: radius.sm },
  leaderLabel: { fontSize: fontSize.xs, color: colors.member },
  leaderName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  leaderCount: { fontSize: fontSize.xs, color: colors.textMuted },
});