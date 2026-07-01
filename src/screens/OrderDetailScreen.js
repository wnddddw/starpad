import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Clipboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, fontSize } from '../theme';
import { formatPrice, formatTime } from '../utils';

export default function OrderDetailScreen() {
  const route = useRoute();
  const { orderId } = route.params || {};
  const [order] = useState({
    _id: orderId,
    items: [{ name: '明星联名T恤', qty: 1, price: 9900 }],
    totalAmount: 9900, status: 'shipped',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    paidAt: new Date().toISOString(),
    address: { name: '用户1', phone: '138****0001', detail: '北京市朝阳区xxx路xxx号' },
    express: { company: '顺丰速运', no: 'SF1234567890' },
  });

  const cfg = {
    shipped: { icon: '🚚', text: '待收货', sub: '您的包裹正在路上~', bg: '#EBF5FB' },
    paid: { icon: '📦', text: '待发货', sub: '商家正在准备您的商品', bg: '#FEF5E7' },
    done: { icon: '✅', text: '已完成', sub: '感谢您的购买', bg: '#E8F8F5' },
    unpaid: { icon: '⏳', text: '待付款', sub: '请尽快完成支付', bg: '#FDEDEC' },
  }[order.status] || { icon: '📦', text: '处理中', sub: '', bg: '#f5f5f5' };

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[styles.statusCard, { backgroundColor: cfg.bg }]}>
          <Text style={{ fontSize: 40 }}>{cfg.icon}</Text>
          <Text style={styles.statusText}>{cfg.text}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{cfg.sub}</Text>
        </View>

        {order.express && (
          <View style={styles.card}>
            <Text style={styles.label}>物流信息</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text>{order.express.company}</Text>
              <TouchableOpacity onPress={() => { Clipboard.setString(order.express.no); Alert.alert('', '已复制'); }}>
                <Text style={{ color: colors.hpPink }}>{order.express.no} 📋</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {order.address && (
          <View style={styles.card}>
            <Text style={styles.label}>收货地址</Text>
            <Text style={{ fontSize: 14, color: colors.text, marginTop: 4 }}>{order.address.name} {order.address.phone}</Text>
            <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{order.address.detail}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.label}>商品信息</Text>
          {order.items.map((it, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}><Text>📦</Text></View>
              <View style={{ flex: 1 }}><Text style={{ fontSize: 13 }}>{it.name}</Text><Text style={{ fontSize: 11, color: colors.textMuted }}>×{it.qty || 1}</Text></View>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{formatPrice(it.price)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>订单信息</Text>
          <View style={styles.row}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>订单编号</Text>
            <TouchableOpacity onPress={() => { Clipboard.setString(order._id); Alert.alert('', '已复制'); }}>
              <Text style={{ fontSize: 13, color: colors.hpPink }}>{order._id} 📋</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}><Text style={{ fontSize: 13, color: colors.textSecondary }}>下单时间</Text><Text style={{ fontSize: 13 }}>{formatTime(order.createdAt)}</Text></View>
          <View style={styles.row}><Text style={{ fontSize: 13, color: colors.textSecondary }}>付款时间</Text><Text style={{ fontSize: 13 }}>{formatTime(order.paidAt)}</Text></View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>订单金额</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.price }}>{formatPrice(order.totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      {(order.status === 'shipped' || order.status === 'paid') && (
        <View style={styles.bottom}>
          {order.status === 'shipped' && <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('', '收货成功')}><Text style={{ color: '#fff', fontWeight: '700' }}>确认收货</Text></TouchableOpacity>}
          <TouchableOpacity style={styles.outlineBtn} onPress={() => Alert.alert('', '功能开发中')}><Text style={{ color: colors.textSecondary, fontWeight: '600' }}>申请退款</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  statusCard: { alignItems: 'center', padding: 24, margin: 12, borderRadius: 16 },
  statusText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 8 },
  card: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 8, borderRadius: 14, padding: 14 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  bottom: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  primaryBtn: { flex: 1, backgroundColor: colors.hpPink, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
  outlineBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingVertical: 12, alignItems: 'center' },
});
