import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

const PLANS = [
  { name: '月卡', price: 25, period: '月', perks: ['独家内容解锁', '私密聊天', '会员专属群'] },
  { name: '季卡', price: 68, period: '季', perks: ['月卡全部权益', '优先购买周边', '生日专属福利'], popular: true },
  { name: '年卡', price: 238, period: '年', perks: ['季卡全部权益', '翻牌问答额度', '年度盛典投票权'], best: true },
];

export default function MemberScreen() {
  const route = useRoute();
  const { starId } = route.params || {};

  function onBuyPlan(plan) {
    Alert.alert('确认开通', `确定开通「${plan.name}」¥${plan.price}？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        onPress: () => {
          api.createMemberOrder(starId, plan).then(res => {
            if (res?.success !== false) Alert.alert('', '下单成功，请完成支付！');
            else Alert.alert('', res?.err || '下单失败');
          }).catch(() => Alert.alert('', '网络错误'));
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.title}>开通会员</Text>
      <Text style={styles.subtitle}>解锁独家内容、私密聊天等专属权益</Text>

      {PLANS.map((plan, i) => (
        <TouchableOpacity key={i} style={[styles.planCard, plan.popular && styles.planPopular]}>
          {plan.popular && (
            <View style={styles.popularBadge}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>最受欢迎</Text></View>
          )}
          {plan.best && !plan.popular && (
            <View style={[styles.popularBadge, { backgroundColor: colors.pink }]}><Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>最划算</Text></View>
          )}
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.planPrice}>¥{plan.price}</Text>
            <Text style={styles.planPeriod}>/{plan.period}</Text>
          </View>
          {plan.perks.map(p => (
            <Text key={p} style={styles.perk}>✓ {p}</Text>
          ))}
          <LinearGradient colors={plan.popular || plan.best ? colors.gradientPink : ['#f5f5f5', '#f5f5f5']}
            style={[styles.buyBtn, (plan.popular || plan.best) ? null : { backgroundColor: '#f5f5f5' }]}>
            <TouchableOpacity onPress={() => onBuyPlan(plan)} style={{ width: '100%', alignItems: 'center' }}>
              <Text style={{ color: plan.popular || plan.best ? '#fff' : colors.textSecondary, fontWeight: '700' }}>
                {plan.popular || plan.best ? '立即开通' : '选择'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.textPrimary, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xl },
  planCard: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.lg, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  planPopular: { borderWidth: 2, borderColor: colors.pink },
  popularBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: colors.member, paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: radius.sm },
  planName: { fontSize: fontSize.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  planPrice: { fontSize: 36, fontWeight: '700', color: colors.textPrimary },
  planPeriod: { fontSize: fontSize.sm, color: colors.textMuted },
  perk: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: spacing.sm },
  buyBtn: { marginTop: spacing.lg, paddingHorizontal: 40, paddingVertical: 10, borderRadius: radius.full },
});