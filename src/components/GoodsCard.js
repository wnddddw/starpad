import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatPrice } from '../utils';

export default function GoodsCard({ goods, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.imgWrap}>
        <Text style={{ fontSize: 32 }}>🛍️</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{goods.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(goods.memberPrice || goods.price)}</Text>
          {goods.memberPrice && goods.memberPrice < goods.price ? (
            <Text style={styles.origPrice}>{formatPrice(goods.price)}</Text>
          ) : null}
        </View>
        <Text style={styles.stats}>{goods.starName} · {goods.sales || 0}已售</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', backgroundColor: colors.surface, borderRadius: radius.lg,
    overflow: 'hidden', marginBottom: spacing.md,
    shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  imgWrap: {
    width: '100%', height: 130, backgroundColor: '#f8f8f8',
    alignItems: 'center', justifyContent: 'center',
  },
  info: { padding: spacing.md },
  name: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: 4, lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontSize: 16, fontWeight: '700', color: colors.priceRed },
  origPrice: { fontSize: fontSize.xs, color: colors.textMuted, textDecorationLine: 'line-through' },
  stats: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
});
