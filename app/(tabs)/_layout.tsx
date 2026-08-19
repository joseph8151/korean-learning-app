import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { tabBarStyle } from '@/constants/tabBar';
import { colors, radius, typography } from '@/constants/theme';

type IconName = keyof typeof Ionicons.glyphMap;

function tabIcon(focused: IconName, unfocused: IconName) {
  function TabBarIcon({
    color,
    size,
    focused: isFocused,
  }: {
    color: ColorValue;
    size: number;
    focused: boolean;
  }) {
    return (
      <View style={styles.iconWrap}>
        <View style={[styles.pill, isFocused && styles.pillActive]} />
        <Ionicons name={isFocused ? focused : unfocused} size={size - 2} color={color} />
      </View>
    );
  }

  return TabBarIcon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDeep,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle,
        tabBarLabelStyle: {
          fontSize: typography.micro.fontSize,
          fontWeight: '700',
        },
        tabBarIconStyle: { marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="learn"
        options={{ title: 'Learn', tabBarIcon: tabIcon('book', 'book-outline') }}
      />
      <Tabs.Screen
        name="practice"
        options={{ title: 'Practice', tabBarIcon: tabIcon('barbell', 'barbell-outline') }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: 'Progress', tabBarIcon: tabIcon('stats-chart', 'stats-chart-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  // A short bar above the active icon. Selection is already carried by the
  // tint and the accessibility state, so this is reinforcement, not the only
  // signal.
  pill: {
    position: 'absolute',
    top: -8,
    width: 18,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
  },
  pillActive: { backgroundColor: colors.primary },
});
