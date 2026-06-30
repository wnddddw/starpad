import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

const TABS = ['全部', '歌手', '演员', '偶像', 'KOL', '虚拟IP'];
const MOCK = [
  { _id:'s1', name:'顶流艺人 A', category:'歌手', followerCount:986000 },
  { _id:'s2', name:'人气歌手 B', category:'歌手', followerCount:863000 },
  { _id:'s3', name:'演员 C', category:'演员', followerCount:754000 },
  { _id:'s4', name:'偶像 D', category:'偶像', followerCount:649000 },
  { _id:'s5', name:'潜力新星 E', category:'KOL', followerCount:418000 },
  { _id:'s6', name:'虚拟偶像 F', category:'虚拟IP', followerCount:543000 },
];

export default function StarListScreen() {
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState('全部');
  const [stars] = useState(MOCK);

  return (
    <View style={styles.page}>
      {/* Search + Interest */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.searchBar} onPress={() => nav.navigate('Search')}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>🔍 搜索明星</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('Search')}>
          <Text style={styles.interestLink}>按兴趣找人</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={TABS} keyExtractor={t=>t}
        contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.tab, activeTab===item && styles.tabActive]} onPress={()=>setActiveTab(item)}>
            <Text style={[styles.tabText, activeTab===item && styles.tabTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* List */}
      <FlatList data={stars} keyExtractor={s=>s._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={()=>nav.navigate('Star',{starId:item._id,starName:item.name})}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name[0]}</Text></View>
            <View style={{flex:1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category} · 粉丝 {formatCount(item.followerCount)}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  topRow: { flexDirection:'row',alignItems:'center',paddingHorizontal:12,paddingTop:8,gap:8 },
  searchBar: { flex:1,backgroundColor:'#fff',borderRadius:16,paddingVertical:10,paddingHorizontal:14 },
  interestLink: { fontSize:13,color:colors.hpPink,fontWeight:'600' },
  tab: { paddingHorizontal:14,paddingVertical:6,borderRadius:999,backgroundColor:'#fff',marginRight:8 },
  tabActive: { backgroundColor:colors.hpPink },
  tabText: { fontSize:13,color:colors.textSecondary },
  tabTextActive: { color:'#fff',fontWeight:'600' },
  item: { flexDirection:'row',alignItems:'center',gap:12,backgroundColor:'#fff',borderRadius:14,padding:12,marginBottom:8 },
  avatar: { width:44,height:44,borderRadius:14,backgroundColor:colors.hpPink,alignItems:'center',justifyContent:'center' },
  avatarText: { color:'#fff',fontSize:16,fontWeight:'700' },
  name: { fontSize:15,fontWeight:'600',color:colors.hpText },
  meta: { fontSize:12,color:colors.textMuted,marginTop:2 },
  arrow: { fontSize:18,color:'rgba(27,33,64,0.28)' },
});
