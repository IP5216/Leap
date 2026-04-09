import { View, Text, StyleSheet, FlatList } from 'react-native';
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>L</Text>
            <View style={styles.logoDot} />
          </View>
          <View>
            <Text style={styles.brandName}>Leap</Text>
            <Text style={styles.brandSub}>FEED</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Loading…</Text>
        </View>
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
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.black,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  logoDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  brandName: { fontSize: 15, fontWeight: '800', color: COLORS.black },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray[500],
    letterSpacing: 1.5,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  muted: { color: COLORS.gray[500], fontSize: 14 },
  list: { paddingBottom: 40 },
});
