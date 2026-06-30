import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function ChatScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.empty}>💬{'\n\n'}我的私信{'\n\n'}聊天功能开发中</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bgWarm, alignItems: 'center', justifyContent: 'center' },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
});
