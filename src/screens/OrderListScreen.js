import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

const STATUS_LABEL = { paid: '待发货', shipped: '已发货', done: '已完成', refunded: '已退款' };

export default function OrderListScreen() {
  const [orders, setOrders] = useState([]);

  useFocusEffect(useCallback(() => {
    api.getOrders().then(res => { if (res?.list) setOrders(res.list); }).catch(() => {
      setOrders([
        { _id: 'o1', orderNo: 'SF20260629120001', items: [{ name: '明星联名T恤' }], totalAmount: 9900, status: 'paid', createdAt: '2026-06-29' },
        { _id: 'o2', orderNo: 'SF20260628120002', items: [{ name: '限定手办' }], totalAmount: 25800, status: 'done', createdAt: '2026-06-28' },
      ]);
    });
  }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={o => o._id}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={<Text style={styles.empty}>暂无订单</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.orderNo}>{item.orderNo}</Text>
              <Text style={[styles.status, { color: item.status === 'paid' ? colors.member : item.status === 'done' ? colors.success : colors.textMuted }]}>
                {STATUS_LABEL[item.status] || item.status}
              </Text>
            </View>
            <Text style={styles.items}>{item.items?.map(i => i.name).join('、')}</Text>
            <View style={styles.row}>
              <Text style={styles.price}>¥{(item.totalAmount / 100).toFixed(2)}</Text>
              <Text style={styles.date}>{item.createdAt}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { textAlign: 'center', padding: 60, color: colors.textMuted },
  card: { backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderNo: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  status: { fontSize: fontSize.xs, fontWeight: '600' },
  items: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: 4 },
  price: { fontSize: fontSize.md, fontWeight: '700', color: colors.like },
  date: { fontSize: fontSize.xs, color: colors.textMuted },
});