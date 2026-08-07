import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { BackChip } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Off the grid' }} />
      <View className="bg-background flex-1">
        <HudBackdrop />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-hud text-[10px] font-bold tracking-[3px] uppercase">
            Signal lost
          </Text>
          <Text className="text-foreground mt-2 text-center text-xl font-bold">
            This screen is not on the map
          </Text>
          <Text className="text-muted mt-2 text-center text-xs leading-5">
            The link you followed does not point anywhere in MATCH Flow. Head back to the Command
            Center and pick a tool from there.
          </Text>
          <BackChip mode="jump" className="mt-6" />
        </View>
      </View>
    </>
  );
}
