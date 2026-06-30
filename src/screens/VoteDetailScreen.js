import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function VoteDetailScreen() {
  const route = useRoute();
  const { voteId } = route.params || {};
  const [vote, setVote] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [count, setCount] = useState(1);

  useEffect(() => { loadVote(); }, []);

  async function loadVote() {
    try {
      const res = await api.getVoteDetail(voteId);
      if (res) setVote({ ...res, options: (res.options || []).map(o => ({ ...o, pct: res.totalVotes > 0 ? Math.round(o.count / res.totalVotes * 100) : 0 })) });
    } catch (_) {
      setVote({
        _id: voteId, title: '2026年度最佳人气明星评选', starName: '多明星',
        description: '选出你心中2026年最佳人气明星！每个用户最多投10票。',
        options: [{ name: '张艺兴', count: 43200 }, { name: '肖战', count: 38900 }, { name: '王一博', count: 35600 }, { name: '杨幂', count: 22100 }, { name: '周杰伦', count: 19800 }],
        totalVotes: 159600, myVotes: 3, maxVotesPerUser: 10, isActive: true, timeLeft: 5,
      });
    }
  }

  async function onCast() {
    if (selectedIndex < 0) return;
    try {
      const res = await api.castVote(voteId, selectedIndex, count);
      if (res?.success !== false) {
        alert('投票成功！');
        loadVote();
      } else {
        alert(res?.err || '投票失败');
      }
    } catch (_) { alert('网络错误'); }
  }

  if (!vote) return <View style={styles.container}><Text style={{ textAlign: 'center', padding: 60 }}>加载中...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.header}>
          <Text style={styles.title}>{vote.title}</Text>
          <Text style={styles.meta}>{vote.starName} · {vote.totalVotes} 票 · {vote.isActive ? '进行中' : '已结束'}</Text>
          <Text style={styles.desc}>{vote.description}</Text>
          <Text style={styles.voteInfo}>🗳️ 我已投 {vote.myVotes || 0}/{vote.maxVotesPerUser || 10} 票 · ⏰ 剩余 {vote.timeLeft} 天</Text>
        </View>

        {vote.options?.map((opt, i) => (
          <TouchableOpacity key={i} style={[styles.option, selectedIndex === i && styles.optionSelected]}
            onPress={() => setSelectedIndex(i)}>
            <View style={[styles.radio, selectedIndex === i && styles.radioChecked]}>
              {selectedIndex === i && <Text style={{ color: '#fff', fontSize: 10 }}>●</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.optRow}>
                <Text style={styles.optName}>{opt.name}</Text>
                <Text style={styles.optCount}>{opt.count || 0} 票</Text>
              </View>
              <View style={styles.barBg}><View style={[styles.barFill, { width: (opt.pct || 0) + '%' }]} /></View>
              <Text style={styles.optPct}>{opt.pct || 0}%</Text>
            </View>
          </TouchableOpacity>
        ))}

        {vote.isActive && (
          <View style={styles.controls}>
            <View style={styles.countRow}>
              <Text style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>投票数</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <TouchableOpacity style={styles.stepper} onPress={() => setCount(c => Math.max(1, c - 1))}>
                  <Text style={{ fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: fontSize.md, fontWeight: '600' }}>{count}</Text>
                <TouchableOpacity style={styles.stepper} onPress={() => setCount(c => Math.min(99, c + 1))}>
                  <Text style={{ fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.castBtn} onPress={onCast}>
              <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '700' }}>🗳️ 投 {count} 票</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  voteInfo: { fontSize: fontSize.xs, color: colors.textMuted },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
    borderWidth: 2, borderColor: 'transparent',
  },
  optionSelected: { borderColor: colors.pink, backgroundColor: '#fff5f9' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.textMuted, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  radioChecked: { borderColor: colors.pink, backgroundColor: colors.pink },
  optRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  optName: { fontSize: fontSize.sm, fontWeight: '500', color: colors.textPrimary },
  optCount: { fontSize: fontSize.xs, color: colors.textMuted },
  barBg: { height: 6, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden', marginBottom: 2 },
  barFill: { height: '100%', backgroundColor: colors.pink, borderRadius: 3 },
  optPct: { fontSize: 10, color: colors.textMuted },
  controls: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.md },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  stepper: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  castBtn: { backgroundColor: colors.pink, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
});