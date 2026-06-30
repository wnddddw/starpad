import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

const PRICES = [500, 1000, 2000, 5000];

export default function QAAskScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { starId, starName } = route.params || {};
  const [question, setQuestion] = useState('');
  const [price, setPrice] = useState(1000);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (question.trim().length < 5) { alert('问题至少5个字'); return; }
    if (question.length > 200) { alert('问题不能超过200字'); return; }
    setSubmitting(true);
    try {
      await api.askQuestion(starId, question, price);
      alert('提问已提交！');
      nav.goBack();
    } catch (_) {
      alert('提交失败');
    }
    setSubmitting(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>向 {starName} 提问</Text>
        <Text style={styles.hint}>被翻牌回答后，问题和答案将对所有人可见</Text>
        <TextInput style={styles.textarea} value={question} onChangeText={setQuestion}
          placeholder="请输入你想问的问题（5-200字）" placeholderTextColor={colors.textMuted}
          multiline numberOfLines={4} maxLength={200} textAlignVertical="top" />
        <Text style={styles.charCount}>{question.length}/200</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>提问金额</Text>
        <View style={styles.priceRow}>
          {PRICES.map(p => (
            <TouchableOpacity key={p} style={[styles.priceChip, price === p && styles.priceChipSelected]}
              onPress={() => setPrice(p)}>
              <Text style={[styles.priceChipText, price === p && { color: colors.pink, fontWeight: '600' }]}>¥{(p / 100).toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.hint}>金额越高，越容易被翻牌哦~</Text>
      </View>

      <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.5 }]} onPress={onSubmit} disabled={submitting}>
        <Text style={{ color: '#fff', fontSize: fontSize.md, fontWeight: '700' }}>
          {submitting ? '提交中...' : '支付 ¥' + (price / 100).toFixed(2) + ' 并提交提问'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.lg },
  label: { fontSize: fontSize.base, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  hint: { fontSize: fontSize.xs, color: colors.textMuted, marginBottom: spacing.md },
  textarea: { minHeight: 100, fontSize: fontSize.base, lineHeight: 22, color: colors.textPrimary, padding: 0 },
  charCount: { textAlign: 'right', fontSize: fontSize.xs, color: colors.textMuted },
  priceRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  priceChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.sm, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: 'transparent' },
  priceChipSelected: { borderColor: colors.pink, backgroundColor: '#fff5f9' },
  priceChipText: { fontSize: fontSize.sm, color: colors.textSecondary },
  submitBtn: { backgroundColor: colors.pink, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
});