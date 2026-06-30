import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function QAScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const { starId, starName } = route.params || {};
  const [tab, setTab] = useState('answered');
  const [questions, setQuestions] = useState([]);

  useFocusEffect(useCallback(() => { loadQuestions(); }, [tab]));

  async function loadQuestions() {
    try {
      const res = await api.getQuestions(starId, tab);
      if (res?.list) setQuestions(res.list);
    } catch (_) {
      setQuestions([
        { _id: 'q1', question: '新专辑什么时候发？等不及了！', answer: '预计下个月中旬哦~封面已经拍好了，正在后期制作中❤️', price: 1000, status: 'answered', timeText: '2天前', answerTimeText: '1天前' },
        { _id: 'q2', question: '下次演唱会会来重庆吗？', answer: '重庆在计划里！等巡演日程确定后第一时间公布😊', price: 500, status: 'answered', timeText: '3天前', answerTimeText: '3天前' },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, tab === 'answered' && styles.tabActive]} onPress={() => setTab('answered')}>
          <Text style={[styles.tabText, tab === 'answered' && styles.tabTextActive]}>已回答</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'my' && styles.tabActive]} onPress={() => setTab('my')}>
          <Text style={[styles.tabText, tab === 'my' && styles.tabTextActive]}>我的提问</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={questions}
        keyExtractor={q => q._id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={<Text style={styles.empty}>{tab === 'answered' ? '还没有已回答的问题' : '你还没有提过问'}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.qRow}>
              <Text style={styles.qLabel}>Q</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.qText}>{item.question}</Text>
                <Text style={styles.qMeta}>{item.timeText} · ¥{(item.price || 0) / 100}</Text>
              </View>
            </View>
            {item.answer ? (
              <View style={[styles.qRow, styles.aRow]}>
                <Text style={[styles.qLabel, { color: colors.success }]}>A</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aText}>{item.answer}</Text>
                  <Text style={styles.qMeta}>{item.answerTimeText}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => nav.navigate('QAAsk', { starId, starName })}>
        <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '700' }}>✎ 提问</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', margin: spacing.lg, marginBottom: 0, borderRadius: radius.md, overflow: 'hidden' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.pink },
  tabText: { fontSize: fontSize.sm, color: colors.textMuted },
  tabTextActive: { color: colors.pink, fontWeight: '600' },
  empty: { textAlign: 'center', padding: 60, color: colors.textMuted },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  qRow: { flexDirection: 'row', gap: spacing.sm },
  qLabel: { fontSize: fontSize.lg, fontWeight: '700', color: colors.pink, width: 24 },
  qText: { fontSize: fontSize.sm, color: colors.textPrimary, lineHeight: 20 },
  qMeta: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 },
  aRow: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: '#eee' },
  aText: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 20 },
  fab: {
    position: 'absolute', bottom: 24, alignSelf: 'center',
    backgroundColor: colors.pink, paddingHorizontal: 32, paddingVertical: 12,
    borderRadius: radius.full, shadowColor: colors.pink, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
});