import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function VoteListScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.empty}>🗳️{'\n\n'}投票打投{'\n\n'}投票功能开发中</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
});
