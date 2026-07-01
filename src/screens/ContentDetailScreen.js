import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Share, Alert, Dimensions, Modal, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { colors, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

export default function ContentDetailScreen() {
  const route = useRoute();
  const nav = useNavigation();
  const insets = useSafeAreaInsets();
  const { contentId } = route.params || {};
  const [content] = useState({
    _id: contentId, title:'舞台返图释出，今晚高能拉满', starName:'顶流艺人 A', starId:'mock-1',
    body:'灯光、镜头和动作都卡在最好的点位。先看内容，再一键关注，追星节奏会更像真实动态流。这是一条详情页示例内容，后续接入真实数据后这里会展示完整正文。',
    media:['https://picsum.photos/seed/detail1/800/500','https://picsum.photos/seed/detail2/800/500','https://picsum.photos/seed/detail3/800/500'], isMemberOnly:false, viewCount:1234, likeCount:567, commentCount:89,
    createdAt: new Date().toISOString(),
  });
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [comments, setComments] = useState([
    { _id:'cm1', nickname:'小星星', text:'期待已久！氛围感太强了', timeAgo:'5分钟前', likeCount:18 },
    { _id:'cm2', nickname:'博迷小王', text:'太棒了！😍', timeAgo:'12分钟前', likeCount:8 },
  ]);
  const [commentText, setCommentText] = useState('');

  const { width: W } = Dimensions.get('window');
  const [imgIdx, setImgIdx] = useState(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const imageUrls = (content.media || []).map(url => ({ url }));

  function onLike() { setIsLiked(!isLiked); }
  function onCollect() { setIsCollected(!isCollected); Alert.alert('', isCollected ? '已取消收藏' : '已收藏'); }
  function onShare() { Share.share({ message: content.title + ' — StarPad' }); }
  function onSend() {
    const t = commentText.trim(); if (!t) return;
    setComments(prev => [...prev, { _id: 'cm' + Date.now(), nickname: '我', text: t, timeAgo: '刚刚', likeCount: 0 }]);
    setCommentText('');
    Alert.alert('', '评论成功，审核后可见');
  }

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 + insets.bottom }}>
        {/* Image carousel */}
        {content.media?.length > 0 && (
          <View>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e => setImgIdx(Math.round(e.nativeEvent.contentOffset.x / W))}
              style={{ width: W, height: W * 0.6 }}>
              {content.media.map((url, i) => (
                <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => { setViewerIndex(i); setViewerVisible(true); }}>
                  <Image source={{ uri: url }} style={{ width: W, height: W * 0.6 }} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            {content.media.length > 1 && (
              <View style={styles.dots}>
                {content.media.map((_, i) => (
                  <View key={i} style={[styles.dot, i === imgIdx && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.title}>{content.title}</Text>
          <TouchableOpacity style={styles.meta} onPress={() => nav.navigate('Star', { starId: content.starId, starName: content.starName })}>
            <View style={styles.avatar}><Text style={{ color: '#fff', fontSize: 12 }}>{(content.starName || 'S')[0]}</Text></View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{content.starName}</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>· {formatTime(content.createdAt)}</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>· 👁 {content.viewCount}</Text>
          </TouchableOpacity>
          <Text style={styles.body}>{content.body}</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.act} onPress={onLike}>
              <Text style={[styles.actIcon, isLiked && { color: colors.like }]}>{isLiked ? '♥' : '♡'}</Text>
              <Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 2 }}>{content.likeCount + (isLiked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <View style={styles.act}><Text style={styles.actIcon}>✎</Text><Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 2 }}>{comments.length}</Text></View>
            <TouchableOpacity style={styles.act} onPress={onCollect}>
              <Text style={[styles.actIcon, isCollected && { color: colors.gold }]}>{isCollected ? '★' : '☆'}</Text>
              <Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 2 }}>收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.act} onPress={onShare}><Text style={styles.actIcon}>↗</Text><Text style={{ fontSize: 9, color: colors.textMuted, marginTop: 2 }}>分享</Text></TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginVertical: 12 }}>评论 ({comments.length})</Text>
          {comments.map(c => (
            <View key={c._id} style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.hpBlue, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 11 }}>{c.nickname[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{c.nickname}</Text>
                  <Text style={{ fontSize: 10, color: colors.textMuted }}>{c.timeAgo}</Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{c.text}</Text>
                <Text style={{ fontSize: 10, color: colors.hpPink, marginTop: 4 }}>回复</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: 12 + insets.bottom }]}>
        <TextInput style={styles.input} value={commentText} onChangeText={setCommentText} placeholder="说点什么..." placeholderTextColor={colors.textMuted} />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}><Text style={{ color: '#fff', fontWeight: '600', fontSize: 13 }}>发送</Text></TouchableOpacity>
      </View>

      {/* Full-screen image viewer */}
      <Modal visible={viewerVisible} transparent={false} animationType="fade"
        onRequestClose={() => setViewerVisible(false)}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ImageViewer
          imageUrls={imageUrls}
          index={viewerIndex}
          onChange={i => setViewerIndex(i)}
          enableSwipeDown={true}
          onSwipeDown={() => setViewerVisible(false)}
          renderIndicator={() => <></>}
          loadingRender={() => (
            <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#999' }}>加载中...</Text>
            </View>
          )}
          renderHeader={() => (
            <View style={{ position: 'absolute', top: insets.top, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, zIndex: 10 }}>
              <Text style={{ color: '#fff', fontSize: 14 }}>{viewerIndex + 1} / {imageUrls.length}</Text>
              <TouchableOpacity onPress={() => setViewerVisible(false)} style={{ padding: 4 }}>
                <Text style={{ color: '#fff', fontSize: 28 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm },
  card: { backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.hpPink, alignItems: 'center', justifyContent: 'center' },
  body: { fontSize: 14, color: colors.textSecondary, lineHeight: 23, marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  act: { alignItems: 'center' },
  actIcon: { fontSize: 20, color: colors.textSecondary },
  inputBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, height: 38, backgroundColor: colors.bg, borderRadius: 19, paddingHorizontal: 16, fontSize: 13 },
  sendBtn: { backgroundColor: colors.hpPink, borderRadius: 19, paddingHorizontal: 18, paddingVertical: 8 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: -24, marginBottom: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#fff', width: 18 },
});
