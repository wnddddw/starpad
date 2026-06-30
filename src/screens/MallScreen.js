import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize, cardShadow } from '../theme';
import { api } from '../api';

const { width } = Dimensions.get('window');
const CARD_W = (width - spacing.lg * 3) / 2;

const MOCK_GOODS = [
  { _id: 'g1', name: '明星联名T恤', image: '', price: 9900, memberPrice: 7900, sales: 1240, starName: '张艺兴' },
  { _id: 'g2', name: '限定手办典藏版', image: '', price: 25800, memberPrice: 21800, sales: 620, starName: '肖战' },
  { _id: 'g3', name: '签名海报A款', image: '', price: 5800, memberPrice: 4800, sales: 2300, starName: '杨幂' },
  { _id: 'g4', name: '纪念徽章套装', image: '', price: 3900, sales: 3500, starName: '王一博' },
];

export default function MallScreen() {
  const nav = useNavigation();
  const [goods, setGoods] = useState(MOCK_GOODS);

  useFocusEffect(useCallback(() => {
    api.getGoodsList().then(res => { if (res?.list?.length) setGoods(res.list); }).catch(() => {});
  }, []));

  return (
    <View style={styles.container}>
      <FlatList
        data={goods}
        keyExtractor={g => g._id}
        numColumns={2}
        contentContainerStyle={{ padding: spacing.lg }}
        columnWrapperStyle={{ gap: spacing.lg, marginBottom: spacing.lg }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}
            onPress={() => nav.navigate('GoodsDetail', { goodsId: item._id })}>
            <View style={styles.imgWrap}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.img} /> : <Text style={{ fontSize: 36 }}>🛍️</Text>}
            </View>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.star}>{item.starName}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>¥{(item.memberPrice || item.price || 0) / 100}</Text>
              {item.price && item.memberPrice && item.memberPrice < item.price && (
                <Text style={styles.origPrice}>¥{item.price / 100}</Text>
              )}
            </View>
            <Text style={styles.sales}>已售 {item.sales || 0}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { width: CARD_W, backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.sm, ...cardShadow },
  imgWrap: { width: '100%', height: CARD_W * 0.8, backgroundColor: '#f8f8f8', borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  img: { width: '100%', height: '100%', borderRadius: radius.sm },
  name: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  star: { fontSize: 10, color: colors.textMuted, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { fontSize: fontSize.md, fontWeight: '700', color: colors.like },
  origPrice: { fontSize: fontSize.xs, color: colors.textMuted, textDecorationLine: 'line-through' },
  sales: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
});