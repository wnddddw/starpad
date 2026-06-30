import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, fontSize } from '../theme';
import { api } from '../api';

export default function ChatScreen() {
  const nav = useNavigation();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  const loadRooms = useCallback(async () => {
    try {
      const res = await api.getChatRooms();
      if (res?.list?.length) {
        setRooms(res.list);
        setError('');
      }
    } catch (_) {
      setRooms([
        { starId: 's1', starName: '张艺兴', starAvatar: '', lastMessage: '大家晚上好，今天排练结束了~', updatedAt: '刚刚' },
        { starId: 's2', starName: '肖战', starAvatar: '', lastMessage: '[图片]', updatedAt: '5分钟前' },
      ]);
      setError('（离线模式）');
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadRooms();
  }, [loadRooms]));

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        keyExtractor={r => r.starId}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={<Text style={styles.empty}>{error || '还没有私信\n订阅明星会员后即可解锁私密聊天'}</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.room} activeOpacity={0.7}
            onPress={() => nav.navigate('ChatRoom', { starId: item.starId, starName: item.starName, starAvatar: item.starAvatar })}>
            {item.starAvatar ? (
              <Image source={{ uri: item.starAvatar }} style={styles.avatar} />
            ) : (
              <LinearGradient colors={colors.gradientPink} style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.starName[0]}</Text>
              </LinearGradient>
            )}
            <View style={styles.roomBody}>
              <View style={styles.roomTop}>
                <Text style={styles.roomName}>{item.starName}</Text>
                <Text style={styles.roomTime}>{item.updatedAt}</Text>
              </View>
              <Text style={styles.roomMsg} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  empty: { textAlign: 'center', padding: 80, fontSize: fontSize.base, color: colors.textMuted, lineHeight: 24 },
  room: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: spacing.md },
  avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, marginRight: spacing.md, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  roomBody: { flex: 1 },
  roomTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  roomName: { fontSize: fontSize.md, fontWeight: '600', color: colors.textPrimary },
  roomTime: { fontSize: fontSize.xs, color: colors.textMuted },
  roomMsg: { fontSize: fontSize.sm, color: colors.textMuted },
  arrow: { fontSize: 20, color: colors.textMuted, marginLeft: spacing.sm },
});