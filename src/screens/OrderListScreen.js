import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatPrice, formatStatus } from '../utils';

const TABS = ['全部','待付款','待发货','待收货','已完成'];
const STATUSES = ['','unpaid','paid','shipped','done'];
const MOCK = [
  { _id:'o1', orderNo:'SF20260629120001', items:[{name:'明星联名T恤',qty:1,price:9900}], totalAmount:9900, status:'paid', createdAt:'2026-06-29' },
  { _id:'o2', orderNo:'SF20260628120002', items:[{name:'限定手办',qty:1,price:29900}], totalAmount:29900, status:'done', createdAt:'2026-06-28' },
  { _id:'o3', orderNo:'SF20260627120003', items:[{name:'月度会员-顶流艺人A',qty:1,price:2990}], totalAmount:2990, status:'shipped', createdAt:'2026-06-27' },
];

export default function OrderListScreen() {
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [orders] = useState(MOCK);

  return (
    <View style={styles.page}>
      {/* Tabs */}
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={TABS} keyExtractor={t=>t}
        contentContainerStyle={styles.tabBar}
        renderItem={({item,index})=>(
          <TouchableOpacity style={[styles.tab,activeTab===index&&styles.tabActive]} onPress={()=>setActiveTab(index)}>
            <Text style={[styles.tabText,activeTab===index&&styles.tabTextActive]}>{item}</Text>
            {activeTab===index && <View style={styles.tabLine} />}
          </TouchableOpacity>
        )}
      />

      <FlatList data={orders} keyExtractor={o=>o._id}
        contentContainerStyle={{padding:12}}
        ListEmptyComponent={<Text style={{textAlign:'center',padding:60,color:colors.textMuted}}>📦{'\n'}暂无相关订单</Text>}
        renderItem={({item})=>{
          const statusColors = {
            unpaid:{bg:'#FDEDEC',c:'#E74C3C'},paid:{bg:'#EBF5FB',c:colors.hpBlue},shipped:{bg:'#FEF5E7',c:colors.gold},done:{bg:'#E8F8F5',c:'#27AE60'},refunded:{bg:'#F2F3F4',c:'#999'},
          };
          const sc = statusColors[item.status] || {bg:'#f0f0f0',c:'#999'};
          return (
            <TouchableOpacity style={styles.card} onPress={()=>nav.navigate('OrderDetail',{orderId:item._id})}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                <Text style={{fontSize:12,color:colors.textSecondary}}>订单号: {item._id}</Text>
                <Text style={{fontSize:11,fontWeight:'600',color:sc.c,backgroundColor:sc.bg,paddingHorizontal:8,paddingVertical:2,borderRadius:4}}>{formatStatus(item.status)}</Text>
              </View>
              {item.items.map((it,i)=>(
                <View key={i} style={{flexDirection:'row',gap:8,marginBottom:4}}>
                  <View style={{width:40,height:40,borderRadius:8,backgroundColor:colors.bg,alignItems:'center',justifyContent:'center'}}><Text>📦</Text></View>
                  <View style={{flex:1}}>
                    <Text style={{fontSize:13,color:colors.text}}>{it.name}</Text>
                    <Text style={{fontSize:11,color:colors.textMuted}}>×{it.qty||1}</Text>
                  </View>
                  <Text style={{fontSize:13,fontWeight:'600'}}>{formatPrice(it.price)}</Text>
                </View>
              ))}
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8,paddingTop:8,borderTopWidth:1,borderTopColor:colors.border}}>
                <Text style={{fontSize:12,color:colors.textSecondary}}>共 {item.items.length} 件 · <Text style={{fontSize:15,fontWeight:'700',color:colors.price}}>{formatPrice(item.totalAmount)}</Text></Text>
                {item.status==='unpaid' && <TouchableOpacity style={styles.actionBtn}><Text style={{color:'#fff',fontSize:11,fontWeight:'600'}}>去付款</Text></TouchableOpacity>}
                {item.status==='shipped' && <TouchableOpacity style={styles.actionBtn}><Text style={{color:'#fff',fontSize:11,fontWeight:'600'}}>确认收货</Text></TouchableOpacity>}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex:1, backgroundColor:colors.bgWarm },
  tabBar: { flexDirection:'row',backgroundColor:'#fff',paddingHorizontal:8,paddingTop:6 },
  tab: { paddingVertical:10,paddingHorizontal:14,alignItems:'center' },
  tabActive: {},
  tabText: { fontSize:13,color:colors.textSecondary },
  tabTextActive: { color:colors.hpPink,fontWeight:'600' },
  tabLine: { height:3,width:16,backgroundColor:colors.hpPink,borderRadius:2,marginTop:4 },
  card: { backgroundColor:'#fff',borderRadius:14,padding:14,marginBottom:8 },
  actionBtn: { backgroundColor:colors.hpPink,borderRadius:12,paddingHorizontal:14,paddingVertical:6 },
});
