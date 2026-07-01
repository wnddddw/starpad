import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize } from '../theme';
import { formatPrice } from '../utils';

const { width: W } = Dimensions.get('window');
const CATS = ['全部', '服装', '手办', '海报', '徽章', '专辑', '应援', '包包', '文具'];
const MOCK_ALL = [
  { _id:'g1', name:'应援手幅', price:3900, memberPrice:2900, sales:2100, starName:'顶流艺人 A', cat:'应援' },
  { _id:'g2', name:'舞台同款 T 恤', price:12900, memberPrice:9900, sales:1400, starName:'人气歌手 B', cat:'服装' },
  { _id:'g3', name:'收藏贴纸包', price:1900, memberPrice:1200, sales:3800, starName:'演员 C', cat:'文具' },
  { _id:'g4', name:'签名感明信片', price:5900, memberPrice:4500, sales:860, starName:'偶像 D', cat:'文具' },
  { _id:'g5', name:'限量手办', price:29900, sales:620, starName:'顶流艺人 A', cat:'手办' },
  { _id:'g6', name:'纪念徽章', price:3900, sales:1023, starName:'人气歌手 B', cat:'徽章' },
  { _id:'g7', name:'限定专辑', price:19900, memberPrice:17900, sales:67, starName:'演员 C', cat:'专辑' },
  { _id:'g8', name:'文创笔记本', price:4900, memberPrice:3900, sales:178, starName:'偶像 D', cat:'文具' },
];

export default function MallScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const starId = route.params?.starId;
  const starName = route.params?.starName;
  const baseGoods = starId ? MOCK_ALL.filter(g => g.starName === starName) : MOCK_ALL;
  const [activeCat, setActiveCat] = useState('全部');
  const [goods, setGoods] = useState(baseGoods);
  const [refreshing, setRefreshing] = useState(false);
  const [bannerI, setBannerI] = useState(0);

  const title = starName ? `${starName} 的周边` : '商城';
  const banners = [
    { title:'🎉 新会员专享', sub:'全场文创享8折优惠', colors:['#2e74b5','#1f4d78'] },
    { title:'⭐ 限量发售', sub:'明星联名系列火热开售', colors:['#d4a853','#ffb875'] },
  ];
  const b = banners[bannerI];

  function filterCat(cat) { setActiveCat(cat); setGoods(cat === '全部' ? baseGoods : baseGoods.filter(g => g.cat === cat)); }
  function onRefresh() { setRefreshing(true); setTimeout(() => { filterCat(activeCat); setRefreshing(false); }, 600); }

  return (
    <View style={[styles.page, { paddingTop: insets.top }]}>
      <FlatList data={goods} keyExtractor={g => g._id} numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.hpPink} />}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            {starName && <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10, paddingHorizontal: 4 }}>{title}</Text>}
            {!starName && <TouchableOpacity onPress={() => setBannerI(i => (i + 1) % 2)} style={{ marginBottom: 12 }}>
              <LinearGradient colors={b.colors} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.banner}>
                <Text style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>}
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={CATS} keyExtractor={c => c}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.cat, activeCat === item && { backgroundColor: colors.hpPink }]}
                  onPress={() => filterCat(item)}>
                  <Text style={{ fontSize: 12, color: activeCat === item ? '#fff' : colors.textSecondary, fontWeight: activeCat === item ? '600' : '400' }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        }
        ListEmptyComponent={<Text style={{ textAlign: 'center', padding: 60, color: colors.textMuted }}>暂无商品</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => nav.navigate('GoodsDetail', { goodsId: item._id })}>
            <View style={styles.img}><Text style={{ fontSize: 28 }}>🛍️</Text></View>
            <View style={{ padding: 8 }}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <Text style={styles.price}>{formatPrice(item.memberPrice || item.price)}</Text>
                {item.memberPrice && item.memberPrice < item.price && (
                  <Text style={{ fontSize: 10, color: colors.textMuted, textDecorationLine: 'line-through' }}>{formatPrice(item.price)}</Text>
                )}
              </View>
              {item.memberPrice && <Text style={{ fontSize: 9, color: colors.gold, fontWeight: '600', marginTop: 2 }}>会员价</Text>}
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{item.starName} · {item.sales}已售</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  banner: { height: 100, borderRadius: 16, padding: 16, justifyContent: 'center' },
  bannerTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  cat: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14, backgroundColor: '#fff', marginRight: 8 },
  card: { width: (W - 24 - 8) / 2, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  img: { width: '100%', height: 110, backgroundColor: '#f8f8f8', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 12, fontWeight: '600', color: colors.text, lineHeight: 17 },
  price: { fontSize: 15, fontWeight: '700', color: colors.price },
});
