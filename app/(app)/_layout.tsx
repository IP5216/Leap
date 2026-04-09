import { Tabs, useRouter } from 'expo-router';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

function LogoIcon() {
  return (
    <View style={styles.logoIcon}>
      <Text style={styles.logoLetter}>L</Text>
      <View style={styles.logoDot} />
    </View>
  );
}

export default function AppLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.black,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="record-tab"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/record');
          },
        }}
        options={{
          tabBarLabel: 'Record',
          tabBarIcon: ({ color }) => (
            <View style={styles.recordTabIcon}>
              <Ionicons name="add" size={22} color={COLORS.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          tabBarLabel: 'Top',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size - 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size - 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logoIcon: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.black,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
  logoDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.accent,
  },
  recordTabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
