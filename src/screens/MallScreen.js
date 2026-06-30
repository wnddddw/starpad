import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatPrice } from '../utils';

const { width: W } = Dimensions.get('window');
const CATS = ['全部', '服装', '手办', '海报', '徽章', '专辑', '应援', '包包', '文具'];
const MOCK = [
  { _id:'g1', name:'应援手幅', price:3900, memberPrice:2900, sales:2100, starName:'顶流艺人 A' },
  { _id:'g2', name:'舞台同款 T 恤', price:12900, memberPrice:9900, sales:1400, starName:'人气歌手 B' },
  { _id:'g3', name:'收藏贴纸包', price:1900, memberPrice:1200, sales:3800, starName:'演员 C' },
  { _id:'g4', name:'签名感明信片', price:5900, memberPrice:4500, sales:860, starName:'偶像 D' },
  { _id:'g5', name:'限量手办', price:29900, sales:620, starName:'顶流艺人 A' },
  { _id:'g6', name:'文创笔记本', price:4900, memberPrice:3900, sales:178, starName:'人气歌手 B' },
];

export default function MallScreen() {
  const nav = useNavigation();
  const [goods] = useState(MOCK);
  const [bannerI, setBannerI] = useState(0);
  const banners = [
    { title:'🎉 新会员专享', sub:'全场文创享8折优惠', colors:['#2e74b5','#1f4d78'] },
    { title:'⭐ 限量发售', sub:'明星联名系列火热开售', colors:['#d4a853','#ffb875'] },
  ];
  const b = banners[bannerI];

  return (
    <View style={styles.page}>
      <FlatList data={goods} keyExtractor={g=>g._id} numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity onPress={()=>setBannerI(i=>(i+1)%2)} style={{ marginBottom: 12 }}>
              <LinearGradient colors={b.colors} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.banner}>
                <Text style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
            <FlatList horizontal showsHorizontalScrollIndicator={false} data={CATS} keyExtractor={c=>c}
              renderItem={({item})=>(
                <TouchableOpacity style={styles.cat}>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={()=>nav.navigate('GoodsDetail',{goodsId:item._id})}>
            <View style={styles.img}><Text style={{fontSize:28}}>🛍️</Text></View>
            <View style={{padding:8}}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <View style={{flexDirection:'row',alignItems:'baseline',gap:4,marginTop:4}}>
                <Text style={styles.price}>{formatPrice(item.memberPrice||item.price)}</Text>
                {item.memberPrice && item.memberPrice < item.price && (
                  <Text style={styles.origPrice}>{formatPrice(item.price)}</Text>
                )}
              </View>
              {item.memberPrice && (
                <Text style={styles.memberTag}>会员价</Text>
              )}
              <Text style={styles.stats}>{item.starName} · {item.sales}已售</Text>
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
  card: {
    width: (W - 24 - 8) / 2, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  img: { width: '100%', height: 110, backgroundColor: '#f8f8f8', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 12, fontWeight: '600', color: colors.text, lineHeight: 17 },
  price: { fontSize: 15, fontWeight: '700', color: colors.price },
  origPrice: { fontSize: 10, color: colors.textMuted, textDecorationLine: 'line-through' },
  memberTag: { fontSize: 9, color: colors.gold, fontWeight: '600', marginTop: 2 },
  stats: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
});
