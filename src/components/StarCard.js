import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, fontSize } from '../theme';
import { formatCount } from '../utils';

export default function StarCard({ star, onPress }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.cover}>
        <Text style={styles.coverEmoji}>⭐</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{star.name?.[0] || 'S'}</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{star.name}</Text>
        <Text style={styles.fans}>{formatCount(star.followerCount)} 粉丝</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden',
    marginBottom: 12, width: '48%',
    shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  cover: {
    height: 80, backgroundColor: colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  coverEmoji: { fontSize: 28 },
  info: { alignItems: 'center', padding: 12, paddingTop: 0, marginTop: -30 },
  avatar: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: '#fff',
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  name: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginTop: 8 },
  fans: { fontSize: fontSize.xs, color: colors.textMuted, marginTop: 4 },
});
