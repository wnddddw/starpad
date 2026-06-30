import React from 'react';
import { Text, StyleSheet } from 'react-native';

const LEVEL_CONFIG = {
  month: { text: '月度会员', color: '#B0B0B0', bg: '#F5F5F5' },
  quarter: { text: '季度会员', color: '#D4A853', bg: '#FFF8E8' },
  year: { text: '年度会员', color: '#E74C3C', bg: '#FDEDEC' },
};

export default function MemberBadge({ level, style }) {
  const cfg = LEVEL_CONFIG[level];
  if (!cfg) return null;
  return (
    <Text style={[styles.badge, { color: cfg.color, backgroundColor: cfg.bg }, style]}>
      {cfg.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: { fontSize: 9, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontWeight: '600' },
});
