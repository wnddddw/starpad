import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatPrice } from '../utils';

const PLANS = [
  { key:'month', name:'月度会员', price:2990, period:'月', benefits:['专属内容','会员徽章','优先评论','商城 95 折'] },
  { key:'quarter', name:'季度会员', price:7990, period:'季', popular:true, benefits:['月度权益全含','限定动态','商城 9 折','活动优先参与'] },
  { key:'year', name:'年度会员', price:26990, period:'年', benefits:['季度权益全含','年度礼盒','商城 85 折','专属粉丝群'] },
];

export default function MemberScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { starId } = route.params || {};
  const [starName] = useState('心选明星');
  const [selected, setSelected] = useState('quarter');
  const [autoRenew, setAutoRenew] = useState(true);

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <LinearGradient colors={[colors.hpPink, colors.hpBlue]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.hero}>
          <View style={styles.heroAvatar}><Text style={{color:'#fff',fontSize:28,fontWeight:'700'}}>{starName[0]}</Text></View>
          <Text style={styles.heroTitle}>加入 {starName} 的会员</Text>
          <Text style={styles.heroSub}>解锁独家内容，享受专属特权</Text>
        </LinearGradient>

        {/* Plans */}
        <View style={styles.plansRow}>
          {PLANS.map(p => {
            const isSel = selected === p.key;
            return (
              <TouchableOpacity key={p.key}
                style={[styles.plan, isSel && styles.planSel, p.popular && {borderColor:colors.gold}]}
                onPress={()=>setSelected(p.key)}>
                {p.popular && <View style={styles.popBadge}><Text style={{fontSize:9,color:'#9d5b20',fontWeight:'600'}}>最受欢迎</Text></View>}
                <Text style={styles.planName}>{p.name}</Text>
                <Text style={styles.planPeriod}>{p.period}</Text>
                <Text style={styles.planPrice}>¥{p.price/100}</Text>
                {p.benefits.map((b,i)=><Text key={i} style={styles.benefit}>✓ {b}</Text>)}
                {isSel && <Text style={styles.selMark}>✓ 已选择</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Auto-renew */}
        <View style={styles.autoRow}>
          <View>
            <Text style={{fontSize:14,fontWeight:'600',color:colors.text}}>自动续费</Text>
            <Text style={{fontSize:11,color:colors.textMuted,marginTop:2}}>到期自动续费，可随时取消</Text>
          </View>
          <Switch value={autoRenew} onValueChange={setAutoRenew}
            trackColor={{false:colors.border,true:colors.hpPink}} />
        </View>
      </ScrollView>

      {/* Pay bar */}
      <View style={styles.payBar}>
        <View>
          <Text style={{fontSize:11,color:colors.textMuted}}>合计</Text>
          <Text style={{fontSize:20,fontWeight:'800',color:colors.text}}>
            {formatPrice(PLANS.find(p=>p.key===selected)?.price||0)}
          </Text>
        </View>
        <TouchableOpacity style={styles.payBtn} onPress={()=>Alert.alert('','下单成功！（演示模式）')}>
          <Text style={{color:'#fff',fontWeight:'800'}}>立即开通</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  hero: { alignItems:'center',padding:24,paddingTop:32 },
  heroAvatar: { width:80,height:80,borderRadius:40,borderWidth:3,borderColor:'rgba(255,255,255,0.4)',backgroundColor:'rgba(255,255,255,0.15)',alignItems:'center',justifyContent:'center',marginBottom:12 },
  heroTitle: { fontSize:18,fontWeight:'700',color:'#fff' },
  heroSub: { fontSize:13,color:'rgba(255,255,255,0.85)',marginTop:4 },
  plansRow: { flexDirection:'row',padding:12,gap:6 },
  plan: { flex:1,backgroundColor:'#fff',borderRadius:16,padding:12,alignItems:'center',borderWidth:2,borderColor:'transparent',position:'relative',overflow:'hidden' },
  planSel: { borderColor:colors.hpPink,shadowColor:colors.hpPink,shadowOffset:{width:0,height:2},shadowOpacity:0.15,shadowRadius:8,elevation:4 },
  popBadge: { position:'absolute',top:0,right:0,backgroundColor:colors.gold,paddingHorizontal:8,paddingVertical:3,borderBottomLeftRadius:8 },
  planName: { fontSize:14,fontWeight:'700',color:colors.text,marginTop:4 },
  planPeriod: { fontSize:11,color:colors.textMuted,marginTop:2 },
  planPrice: { fontSize:22,fontWeight:'800',color:colors.hpPink,marginTop:6 },
  benefit: { fontSize:10,color:colors.textSecondary,marginTop:4 },
  selMark: { fontSize:11,color:colors.hpPink,fontWeight:'700',marginTop:8 },
  autoRow: { flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',marginHorizontal:12,borderRadius:14,padding:16 },
  payBar: { position:'absolute',bottom:0,left:0,right:0,flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',padding:16,borderTopWidth:1,borderTopColor:colors.border },
  payBtn: { backgroundColor:colors.hpPink,borderRadius:16,paddingVertical:13,paddingHorizontal:32 },
});
