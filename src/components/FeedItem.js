import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors, spacing, radius, fontSize } from '../theme';
import { formatCount, formatTime } from '../utils';

export default function FeedItem({ feed, onPress, onPressStar }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* Star header */}
      <TouchableOpacity style={styles.header} onPress={onPressStar}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{feed.starName?.[0] || 'S'}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{feed.starName}</Text>
          <Text style={styles.time}>{formatTime(feed.createdAt)}</Text>
        </View>
      </TouchableOpacity>
      {/* Content */}
      <Text style={styles.title} numberOfLines={2}>{feed.title}</Text>
      {feed.media?.[0] ? (
        <Image source={{ uri: feed.media[0] }} style={styles.image} resizeMode="cover" />
      ) : null}
      {/* Actions */}
      <View style={styles.actions}>
        <Text style={styles.action}>❤️ {formatCount(feed.likeCount)}</Text>
        <Text style={styles.action}>💬 {feed.commentCount || 0}</Text>
        <Text style={styles.actionDetail}>查看详情 ›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl,
    marginBottom: spacing.md, ...{
      shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1, shadowRadius: 6, elevation: 2,
    },
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  meta: { marginLeft: spacing.md, flex: 1 },
  name: { fontSize: fontSize.base, fontWeight: '600', color: colors.text },
  time: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 2 },
  title: { fontSize: fontSize.md, color: colors.text, lineHeight: 22, marginBottom: spacing.md },
  image: { width: '100%', height: 200, borderRadius: radius.md, marginBottom: spacing.md },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  action: { fontSize: fontSize.sm, color: colors.textSecondary },
  actionDetail: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600', marginLeft: 'auto' },
});
