import { Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeed } from '@/hooks/useFeed';
import { FeedGate } from '@/components/feed/FeedGate';
import { VideoCard } from '@/components/feed/VideoCard';
import { COLORS } from '@/constants';
import type { Post } from '@/types';

export default function FeedScreen() {
  const { posts, loading, isGated } = useFeed('daily');

  if (isGated) return <FeedGate />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Today's Feed</Text>
      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Post }) => <VideoCard post={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  header: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    padding: 16,
  },
  muted: { color: COLORS.gray[500], textAlign: 'center', marginTop: 40 },
  list: { paddingBottom: 40 },
});
