import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Share, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

export default function ContentDetailScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const { contentId } = route.params || {};
  const [content] = useState({
    _id: contentId, title:'舞台返图释出，今晚高能拉满', starName:'顶流艺人 A', starId:'mock-1',
    body:'灯光、镜头和动作都卡在最好的点位。先看内容，再一键关注，追星节奏会更像真实动态流。这是一条详情页示例内容，后续接入真实数据后这里会展示完整正文。',
    media:[], isMemberOnly:false, viewCount:1234, likeCount:567, commentCount:89,
    createdAt: new Date().toISOString(), isLiked:false, isCollected:false,
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [comments] = useState([
    { _id:'cm1', nickname:'小星星', text:'期待已久！氛围感太强了', timeAgo:'5分钟前', likeCount:18 },
    { _id:'cm2', nickname:'博迷小王', text:'太棒了！😍', timeAgo:'12分钟前', likeCount:8 },
  ]);
  const [commentText, setCommentText] = useState('');

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.card}>
          <Text style={styles.title}>{content.title}</Text>
          {/* Meta */}
          <TouchableOpacity style={styles.meta} onPress={() => nav.navigate('Star', { starId: content.starId, starName: content.starName })}>
            <View style={styles.avatar}><Text style={{color:'#fff',fontSize:12}}>{(content.starName||'S')[0]}</Text></View>
            <Text style={styles.metaName}>{content.starName}</Text>
            <Text style={styles.metaTime}>· {formatTime(content.createdAt)}</Text>
            <Text style={styles.metaViews}>· 👁 {content.viewCount}</Text>
          </TouchableOpacity>
          <Text style={styles.body}>{content.body}</Text>
          {/* Action bar */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.act} onPress={()=>setIsLiked(!isLiked)}>
              <Text style={[styles.actIcon, isLiked && {color:colors.like}]}>{isLiked?'♥':'♡'}</Text>
              <Text style={styles.actLabel}>{content.likeCount + (isLiked?1:0)}</Text>
            </TouchableOpacity>
            <View style={styles.act}>
              <Text style={styles.actIcon}>✎</Text>
              <Text style={styles.actLabel}>{comments.length}</Text>
            </View>
            <TouchableOpacity style={styles.act} onPress={()=>setIsCollected(!isCollected)}>
              <Text style={[styles.actIcon, isCollected && {color:colors.gold}]}>{isCollected?'★':'☆'}</Text>
              <Text style={styles.actLabel}>收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.act} onPress={()=>Share.share({message:content.title+' — StarPad'})}>
              <Text style={styles.actIcon}>↗</Text>
              <Text style={styles.actLabel}>分享</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments */}
        <View style={{ paddingHorizontal: 12 }}>
          <Text style={styles.commentTitle}>评论 ({comments.length})</Text>
          {comments.map(c => (
            <View key={c._id} style={styles.comment}>
              <View style={styles.cAvatar}><Text style={{color:'#fff',fontSize:11}}>{c.nickname[0]}</Text></View>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <Text style={{fontSize:13,fontWeight:'600',color:colors.text}}>{c.nickname}</Text>
                  <Text style={{fontSize:10,color:colors.textMuted}}>{c.timeAgo}</Text>
                </View>
                <Text style={{fontSize:13,color:colors.textSecondary,marginTop:4}}>{c.text}</Text>
                <Text style={{fontSize:10,color:colors.hpPink,marginTop:4}}>回复</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Input */}
      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={commentText} onChangeText={setCommentText}
          placeholder="说点什么..." placeholderTextColor={colors.textMuted} />
        <TouchableOpacity style={styles.sendBtn} onPress={()=>{setCommentText('');Alert.alert('','评论成功，审核后可见')}}>
          <Text style={{color:'#fff',fontWeight:'600',fontSize:13}}>发送</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
  metaName: { fontSize: 13, fontWeight: '600', color: colors.text },
  metaTime: { fontSize: 11, color: colors.textMuted },
  metaViews: { fontSize: 11, color: colors.textMuted },
  body: { fontSize: 14, color: colors.textSecondary, lineHeight: 23, marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  act: { alignItems: 'center' },
  actIcon: { fontSize: 20, color: colors.textSecondary },
  actLabel: { fontSize: 9, color: colors.textMuted, marginTop: 2 },
  commentTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginVertical: 12 },
  comment: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  cAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.hpBlue, alignItems: 'center', justifyContent: 'center' },
  inputBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, height: 38, backgroundColor: colors.bg, borderRadius: 19, paddingHorizontal: 16, fontSize: 13 },
  sendBtn: { backgroundColor: colors.hpPink, borderRadius: 19, paddingHorizontal: 18, paddingVertical: 8 },
});
