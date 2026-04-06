import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { likePost } from '@/firebase/firestore';
import { useAppStore } from '@/store/useAppStore';
import { COLORS } from '@/constants';
import type { Post } from '@/types';

const { width } = Dimensions.get('window');

interface Props {
  post: Post;
}

export function VideoCard({ post }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const user = useAppStore((s) => s.user);
  const videoRef = useRef<Video>(null);

  async function handleLike() {
    if (liked || !user) return;
    setLiked(true);
    setLikeCount((c) => c + 1);
    await likePost(post.id, user.uid);
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: post.videoUrl }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping
        useNativeControls
      />
      <View style={styles.info}>
        <Text style={styles.username}>@{post.userUsername}</Text>
        <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
          <Text style={styles.likeText}>
            {liked ? '♥' : '♡'} {likeCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 2, backgroundColor: COLORS.black },
  video: { width, height: width * 1.33 },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  username: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  likeBtn: { padding: 4 },
  likeText: { color: COLORS.white, fontSize: 16 },
});
