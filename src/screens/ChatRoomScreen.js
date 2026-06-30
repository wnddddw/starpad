import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function ChatRoomScreen() {
  const route = useRoute();
  const { starId, starName } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => { loadMessages(); }, []);

  async function loadMessages() {
    try {
      const res = await api.getStarMessages(starId);
      if (res?.list) setMessages(res.list.reverse());
    } catch (_) {
      setMessages([
        { _id: 'm1', text: '大家好！今天排练结束了，来跟大家聊聊天~', timeText: '刚刚', isStar: true },
        { _id: 'm2', text: '新专辑的进度怎么样了？好期待！', timeText: '4分钟前', isStar: false },
        { _id: 'm3', text: '快了快了😊 预计下个月公布封面', timeText: '3分钟前', isStar: true },
      ]);
    }
  }

  function onSend() {
    const text = replyText.trim();
    if (!text) return;
    const newMsg = { _id: 'tmp-' + Date.now(), text, timeText: '刚刚', isStar: false };
    setMessages(prev => [...prev, newMsg]);
    setReplyText('');
    api.replyToStar('', starId, text);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={m => m._id}
        contentContainerStyle={{ padding: spacing.lg }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.isStar ? styles.msgLeft : styles.msgRight]}>
            <View style={[styles.bubble, item.isStar ? styles.bubbleStar : styles.bubbleFan]}>
              <Text style={[styles.bubbleText, !item.isStar && { color: '#fff' }]}>{item.text}</Text>
              <Text style={[styles.bubbleTime, !item.isStar && { color: 'rgba(255,255,255,0.6)' }]}>{item.timeText}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>暂无消息{'\n'}期待 {starName} 的第一条私信吧~</Text>}
      />
      <View style={styles.inputBar}>
        <TextInput style={styles.input} value={replyText} onChangeText={setReplyText}
          placeholder={'回复 ' + (starName || '') + '...'} placeholderTextColor={colors.textMuted}
          returnKeyType="send" onSubmitEditing={onSend} />
        <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>发送</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0ece6' },
  empty: { textAlign: 'center', padding: 80, color: colors.textMuted, fontSize: fontSize.sm },
  msgRow: { marginBottom: spacing.lg },
  msgLeft: { alignItems: 'flex-start' },
  msgRight: { alignItems: 'flex-end' },
  bubble: { maxWidth: '75%', padding: spacing.md, borderRadius: radius.lg },
  bubbleStar: { backgroundColor: '#fff', borderTopLeftRadius: 4 },
  bubbleFan: { backgroundColor: colors.pink, borderTopRightRadius: 4 },
  bubbleText: { fontSize: fontSize.base, lineHeight: 22, color: colors.textPrimary },
  bubbleTime: { fontSize: 10, color: colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
  },
  input: { flex: 1, height: 38, backgroundColor: '#f5f5f5', borderRadius: 19, paddingHorizontal: 16, fontSize: 14 },
  sendBtn: { backgroundColor: colors.pink, borderRadius: 19, paddingHorizontal: 18, paddingVertical: 8 },
});