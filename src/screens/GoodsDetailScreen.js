import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

const { width } = Dimensions.get('window');

export default function GoodsDetailScreen() {
  const route = useRoute();
  const { goodsId } = route.params || {};
  const [goods, setGoods] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.getGoodsDetail(goodsId).then(res => {
      if (res?.goods) setGoods(res.goods);
    }).catch(() => {
      setGoods({
        _id: goodsId, name: '明星联名T恤', images: [], price: 9900, memberPrice: 7900,
        desc: '柔和暖色主视觉，适合追星日常穿搭。限定批次发售，支持会员专属折扣。',
        starName: '张艺兴', stock: 48, sales: 324,
      });
    });
  }, []);

  if (!goods) return <View style={styles.container}><Text style={{ textAlign: 'center', padding: 60 }}>加载中...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imgWrap}>
          {goods.images?.[0] ? <Image source={{ uri: goods.images[0] }} style={styles.img} /> : <Text style={{ fontSize: 64 }}>🛍️</Text>}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{goods.name}</Text>
          <Text style={styles.star}>{goods.starName}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥{(goods.memberPrice || goods.price) / 100}</Text>
            {goods.memberPrice && goods.memberPrice < goods.price && (
              <Text style={styles.origPrice}>¥{goods.price / 100}</Text>
            )}
          </View>
          <Text style={styles.desc}>{goods.desc}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>库存 {goods.stock} · 已售 {goods.sales}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
            <Text style={{ fontSize: 18 }}>−</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: fontSize.md, fontWeight: '600', marginHorizontal: spacing.md }}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)}>
            <Text style={{ fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: fontSize.md }}>立即购买</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imgWrap: { width, height: width, backgroundColor: '#f8f8f8', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  info: { padding: spacing.lg },
  name: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  star: { fontSize: fontSize.sm, color: colors.textMuted, marginBottom: spacing.md },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: spacing.md },
  price: { fontSize: 28, fontWeight: '700', color: colors.like },
  origPrice: { fontSize: fontSize.sm, color: colors.textMuted, textDecorationLine: 'line-through' },
  desc: { fontSize: fontSize.sm, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { fontSize: fontSize.xs, color: colors.textMuted },
  bottomBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderTopWidth: 1, borderTopColor: '#eee', gap: spacing.md },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  buyBtn: { flex: 1, backgroundColor: colors.pink, borderRadius: radius.full, paddingVertical: 12, alignItems: 'center' },
});