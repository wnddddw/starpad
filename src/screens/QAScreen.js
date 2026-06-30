import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function QAScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.empty}>💌{'\n\n'}翻牌问答{'\n\n'}问答功能开发中</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
});
