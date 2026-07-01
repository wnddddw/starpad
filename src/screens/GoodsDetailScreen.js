import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, fontSize } from '../theme';
import { formatPrice } from '../utils';

const { width: W } = Dimensions.get('window');

export default function GoodsDetailScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { goodsId } = route.params || {};
  const [qty, setQty] = useState(1);
  const [goods] = useState({
    _id: goodsId, name: '明星联名T恤', price: 9900, memberPrice: 7900,
    desc: '限量300件，官方正版授权。100%棉，S/M/L/XL可选。\n\n— 洗护建议 —\n建议手洗或机洗轻柔模式，不可漂白。',
    starName: '顶流艺人 A', stock: 200, sales: 324,
  });

  function onBuy() {
    if (qty > goods.stock) { Alert.alert('', '库存不足'); return; }
    Alert.alert('确认购买', `${qty} 件「${goods.name}」${formatPrice((goods.memberPrice || goods.price) * qty)}`, [
      { text: '取消', style: 'cancel' },
      { text: '确定', onPress: () => { Alert.alert('', '下单成功！（演示模式）'); nav.goBack(); } },
    ]);
  }

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={styles.imgWrap}><Text style={{ fontSize: 64 }}>🛍️</Text></View>
        <View style={styles.info}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(goods.memberPrice || goods.price)}</Text>
            {goods.memberPrice && goods.memberPrice < goods.price && (
              <Text style={styles.origPrice}>{formatPrice(goods.price)}</Text>
            )}
            {goods.memberPrice && (
              <Text style={styles.saveTag}>会员省 ¥{((goods.price - goods.memberPrice) / 100).toFixed(2)}</Text>
            )}
          </View>
          <Text style={styles.name}>{goods.name}</Text>
          <Text style={styles.stats}>{goods.starName} · 已售 {goods.sales} · 库存 {goods.stock}</Text>
          <View style={styles.divider} />
          <Text style={styles.descTitle}>商品描述</Text>
          <Text style={styles.desc}>{goods.desc}</Text>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: 16 + insets.bottom }]}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}><Text style={{ fontSize: 18 }}>−</Text></TouchableOpacity>
          <Text style={{ fontSize: 15, fontWeight: '600', marginHorizontal: 12 }}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.min(goods.stock, q + 1))}><Text style={{ fontSize: 18 }}>+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buyBtn} onPress={onBuy}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>立即购买</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff' },
  imgWrap: { width: W, height: W, backgroundColor: '#f8f8f8', alignItems: 'center', justifyContent: 'center' },
  info: { padding: 16 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  price: { fontSize: 22, fontWeight: '700', color: colors.price },
  origPrice: { fontSize: 13, color: colors.textMuted, textDecorationLine: 'line-through' },
  saveTag: { fontSize: 10, color: colors.gold, fontWeight: '600', backgroundColor: colors.bgSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  stats: { fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  descTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  desc: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },
  bottom: { flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: colors.border, gap: 12 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  buyBtn: { flex: 1, backgroundColor: colors.hpPink, borderRadius: 20, paddingVertical: 12, alignItems: 'center' },
});
