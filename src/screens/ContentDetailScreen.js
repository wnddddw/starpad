import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, TextInput,
  StyleSheet, Share, Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function ContentDetailScreen() {
  const route = useRoute();
  const { contentId } = route.params || {};
  const [content, setContent] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCollected, setIsCollected] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => { loadContent(); loadComments(); }, [contentId]);

  async function loadContent() {
    try {
      const res = await api.getContentDetail(contentId);
      if (res) {
        setContent(res); setLikeCount(res.likeCount || 0);
        setIsLiked(!!res.isLiked); setIsCollected(!!res.isCollected);
        return;
      }
    } catch (_) {}
    setContent({
      _id: contentId, title: '舞台直拍幕后花絮', starName: '新晋顶流', starAvatar: '',
      body: '这是一条详情页示例内容。后续接入真实数据后，这里会展示完整正文。', media: [],
      isMemberOnly: false, viewCount: 1234, timeAgo: '刚刚',
    });
    setLikeCount(567);
  }

  async function loadComments() {
    try {
      const res = await api.getComments(contentId);
      if (res?.list) setComments(res.list);
    } catch (_) {
      setComments([
        { _id: 'cm1', nickname: '头号粉丝', text: '这条动态氛围感太强了。', timeAgo: '5分钟前', likeCount: 18 },
      ]);
    }
  }

  function onLike() {
    const next = !isLiked;
    setIsLiked(next);
    setLikeCount(c => c + (next ? 1 : -1));
    api.toggleLike(contentId, next ? 'like' : 'unlike');
  }

  function onCollect() {
    const next = !isCollected;
    setIsCollected(next);
    api.toggleLike(contentId, next ? 'collect' : 'uncollect').then(res => {
      if (res) setIsCollected(!!res.isCollected);
    });
    Alert.alert('', next ? '已收藏' : '已取消收藏');
  }

  async function onShare() {
    try {
      await Share.share({
        message: (content?.title || '明星粉丝互动平台') + ' — StarPad',
      });
      api.shareReport(contentId, 'app');
    } catch (_) {}
  }

  function onSendComment() {
    if (!commentText.trim()) return;
    api.postComment(contentId, commentText).then(() => {
      setCommentText('');
      loadComments();
    });
  }

  if (!content) return <View style={styles.container}><Text style={{ textAlign: 'center', padding: 60 }}>加载中...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.title}>{content.title}</Text>
          <View style={styles.meta}>
            <View style={styles.metaAvatar}><Text style={{ color: '#fff', fontSize: 12 }}>{(content.starName || 'S')[0]}</Text></View>
            <Text style={styles.metaText}>{content.starName}</Text>
            <Text style={styles.metaText}>· {content.timeAgo}</Text>
            <Text style={styles.metaText}>· 浏览 {content.viewCount || 0}</Text>
          </View>
          <Text style={styles.body}>{content.body}</Text>
          {content.media?.length > 0 && content.media.map((url, i) => (
            <Image key={i} source={{ uri: url }} style={styles.mediaImage} resizeMode="contain" />
          ))}
          {content.isMemberOnly && (
            <View style={styles.memberLock}>
              <Text style={{ fontSize: 32 }}>★</Text>
              <Text style={styles.lockTitle}>会员专享内容</Text>
              <Text style={styles.lockDesc}>开通会员后可查看完整正文与专属图片。</Text>
            </View>
          )}
        </View>

        {/* Action bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionItem} onPress={onLike}>
            <Text style={[styles.actionIcon, isLiked && { color: colors.like }]}>{isLiked ? '♥' : '♡'}</Text>
            <Text style={[styles.actionLabel, isLiked && { color: colors.like }]}>{isLiked ? '已赞' : '点赞'}</Text>
            <Text style={styles.actionCount}>{likeCount}</Text>
          </TouchableOpacity>
          <View style={styles.actionItem}>
            <Text style={styles.actionIcon}>✎</Text>
            <Text style={styles.actionLabel}>评论</Text>
            <Text style={styles.actionCount}>{comments.length}</Text>
          </View>
          <TouchableOpacity style={styles.actionItem} onPress={onCollect}>
            <Text style={[styles.actionIcon, isCollected && { color: colors.member }]}>{isCollected ? '★' : '☆'}</Text>
            <Text style={[styles.actionLabel, isCollected && { color: colors.member }]}>{isCollected ? '已收藏' : '收藏'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onShare}>
            <Text style={styles.actionIcon}>↗</Text>
            <Text style={styles.actionLabel}>分享</Text>
          </TouchableOpacity>
        </View>

        {/* Comments */}
        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>评论 {comments.length}</Text>
          {comments.map(c => (
            <View key={c._id} style={styles.commentItem}>
              <View style={styles.commentAvatar}><Text style={{ color: '#fff', fontSize: 12 }}>{(c.nickname || '?')[0]}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentNick}>{c.nickname}</Text>
                <Text style={styles.commentText}>{c.text}</Text>
                <Text style={styles.commentTime}>{c.timeAgo}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={commentText} onChangeText={setCommentText}
          placeholder="写下你的评论" placeholderTextColor={colors.textMuted}
          returnKeyType="send" onSubmitEditing={onSendComment} />
        <TouchableOpacity style={styles.sendBtn} onPress={onSendComment}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>发送</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  contentCard: { backgroundColor: '#fff', margin: spacing.lg, borderRadius: radius.lg, padding: spacing.lg },
  title: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  metaAvatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.pink, alignItems: 'center', justifyContent: 'center' },
  metaText: { fontSize: fontSize.xs, color: colors.textMuted },
  body: { fontSize: fontSize.base, color: colors.textPrimary, lineHeight: 24, marginBottom: spacing.lg },
  mediaImage: { width: '100%', height: 260, borderRadius: radius.md, marginBottom: spacing.sm },
  memberLock: { alignItems: 'center', padding: spacing.xl, backgroundColor: '#fff8f3', borderRadius: radius.md },
  lockTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.sm },
  lockDesc: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 4, textAlign: 'center' },
  actionBar: {
    flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: spacing.lg,
    backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md,
  },
  actionItem: { alignItems: 'center' },
  actionIcon: { fontSize: 24, color: colors.textSecondary },
  actionLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  actionCount: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  commentSection: { margin: spacing.lg, marginTop: 0 },
  commentTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  commentItem: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  commentNick: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary },
  commentText: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2, lineHeight: 20 },
  commentTime: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  input: { flex: 1, height: 38, backgroundColor: '#f5f5f5', borderRadius: 19, paddingHorizontal: 16, fontSize: 14 },
  sendBtn: { backgroundColor: colors.pink, borderRadius: 19, paddingHorizontal: 18, paddingVertical: 8 },
});