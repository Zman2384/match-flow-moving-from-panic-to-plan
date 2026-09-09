import { Tabs } from 'expo-router';
import { LayoutGrid, Radar, ShieldHalf, UserRound } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

import { HUD, LINE, NAVY, PANEL_DEEP, STEEL } from '@/lib/palette';

const ACTIVE = HUD;
const INACTIVE = STEEL;
const BAR_BG = PANEL_DEEP;
const BAR_BORDER = LINE;

export default function TabsLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE,
          tabBarInactiveTintColor: INACTIVE,
          tabBarStyle: {
            backgroundColor: BAR_BG,
            borderTopColor: BAR_BORDER,
            borderTopWidth: 1,
            elevation: 0,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          sceneStyle: { backgroundColor: NAVY },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Command',
            tabBarIcon: ({ color, size }) => <Radar size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: 'My Shield',
            tabBarIcon: ({ color, size }) => <ShieldHalf size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="toolkit"
          options={{
            title: 'Toolkit',
            tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="me"
          options={{
            title: 'Me',
            tabBarIcon: ({ color, size }) => <UserRound size={size} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
