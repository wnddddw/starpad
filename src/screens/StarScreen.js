import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

const { width: W } = Dimensions.get('window');

export default function StarScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { starId, starName } = route.params || {};
  const [isFollowing, setIsFollowing] = useState(false);
  const [star] = useState({ _id: starId, name: starName || '明星', intro: '当红焦点艺人，持续输出高质量内容。', followerCount: 128000, contentCount: 56 });
  const [contents] = useState([
    { _id:'c1', title:'直播预告：今晚 8 点开启粉丝问答', likeCount:12000, commentCount:328, isMemberOnly:false, createdAt: new Date().toISOString() },
    { _id:'c2', title:'新舞台幕后花絮公开', likeCount:8600, commentCount:186, isMemberOnly:false, createdAt: new Date(Date.now()-7200000).toISOString() },
    { _id:'c3', title:'会员专享：练习室独家片段', likeCount:3400, commentCount:92, isMemberOnly:true, createdAt: new Date(Date.now()-86400000).toISOString() },
  ]);

  function onFollow() { setIsFollowing(!isFollowing); Alert.alert('', isFollowing ? '已取消关注' : '已关注'); }

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.coverWrap}>
        <Image source={{ uri: 'https://picsum.photos/seed/starcover/800/320' }} style={styles.coverImg} />
      </View>

      <View style={styles.infoCard}>
        <View style={styles.avatarRow}>
          <Image source={{ uri: 'https://picsum.photos/seed/staravatar/200/200' }} style={styles.avatar} />
          <View style={{flex:1}}>
            <Text style={styles.name}>{star.name}</Text>
            <Text style={styles.intro}>{star.intro}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>粉丝 {formatCount(star.followerCount)}</Text>
          <Text style={styles.stat}>动态 {star.contentCount || 0}</Text>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity style={[styles.btn, styles.btnFollow, isFollowing && styles.btnFollowing]} onPress={onFollow}>
            <Text style={[styles.btnFollowText, isFollowing && {color:colors.text}]}>{isFollowing ? '♥ 已关注' : '+ 关注'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnChat]} onPress={() => nav.navigate('Chat')}>
            <Text style={styles.btnChatText}>💬 私信</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnMember]} onPress={() => nav.navigate('Member',{starId})}>
            <Text style={styles.btnMemberText}>会员</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          {[
            ['🗳️','投票','VoteList'],
            ['💌','问答','QA'],
            ['👥','粉丝群','Chat'],
          ].map(([icon,label,screen]) => (
            <TouchableOpacity key={label} style={styles.quick} onPress={() => nav.navigate(screen,{starId,starName:star.name})}>
              <Text style={{fontSize:20}}>{icon}</Text><Text style={{fontSize:10,color:colors.textMuted,marginTop:2}}>{label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.quick} onPress={() => nav.navigate('Main', { screen: 'MallTab', params: { starId, starName: star.name } })}>
            <Text style={{fontSize:20}}>🛒</Text><Text style={{fontSize:10,color:colors.textMuted,marginTop:2}}>商城</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{paddingHorizontal:12,paddingTop:16,paddingBottom:40}}>
        <Text style={{fontSize:16,fontWeight:'700',color:colors.hpText,marginBottom:12}}>最新动态</Text>
        {contents.map(item => (
          <TouchableOpacity key={item._id} style={styles.feedCard} onPress={() => nav.navigate('ContentDetail',{contentId:item._id})}>
            <View style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:6}}>
              <View style={{width:28,height:28,borderRadius:9,backgroundColor:colors.hpPink,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff',fontSize:12}}>{(star.name||'S')[0]}</Text>
              </View>
              <Text style={{fontWeight:'600',fontSize:13,flex:1,color:colors.hpText}}>{item.title}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{fontSize:11,color:colors.hpMuted}}>♥ {formatCount(item.likeCount)} · 💬 {item.commentCount}</Text>
              {item.isMemberOnly && <Text style={{fontSize:10,color:colors.gold,fontWeight:'600'}}>会员专属</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  coverWrap: { width: W, height: 200 },
  coverImg: { width:'100%',height:'100%' },
  infoCard: { marginHorizontal:12,marginTop:-40,backgroundColor:'#fff',borderRadius:18,padding:16,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.06,shadowRadius:12,elevation:4 },
  avatarRow: { flexDirection:'row',alignItems:'center',gap:12,marginBottom:12 },
  avatar: { width:64,height:64,borderRadius:18,borderWidth:3,borderColor:'#fff' },
  name: { fontSize:18,fontWeight:'800',color:colors.hpText },
  intro: { fontSize:12,color:colors.hpMuted,marginTop:4,lineHeight:18 },
  statsRow: { flexDirection:'row',gap:16,marginBottom:12 },
  stat: { fontSize:11,color:colors.textMuted },
  btnRow: { flexDirection:'row',gap:8,marginBottom:12 },
  btn: { flex:1,paddingVertical:10,borderRadius:999,alignItems:'center' },
  btnFollow: { backgroundColor:colors.hpPink },
  btnFollowing: { backgroundColor:'#fff',borderWidth:1,borderColor:colors.border },
  btnFollowText: { color:'#fff',fontWeight:'700',fontSize:13 },
  btnChat: { backgroundColor:'#fff',borderWidth:1,borderColor:colors.border },
  btnChatText: { color:colors.textSecondary,fontWeight:'600',fontSize:12 },
  btnMember: { backgroundColor:colors.gold },
  btnMemberText: { color:'#fff',fontWeight:'700',fontSize:13 },
  quickRow: { flexDirection:'row',gap:8 },
  quick: { flex:1,alignItems:'center',paddingVertical:10,backgroundColor:colors.bgSoft,borderRadius:12,borderWidth:1,borderColor:colors.border },
  feedCard: { backgroundColor:'#fff',borderRadius:14,padding:14,marginBottom:8,borderWidth:1,borderColor:'rgba(90,110,170,0.06)' },
});
