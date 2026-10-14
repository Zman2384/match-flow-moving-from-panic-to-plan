import { Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { BackChip } from '@/components/BackChip';
import { HudBackdrop } from '@/components/HudBackdrop';
import { BodyText, BrandFooter, Disclaimer } from '@/components/ScreenShell';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Off the grid' }} />
      <View className="bg-background flex-1">
        <HudBackdrop />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-hud font-mono text-[10px] tracking-[3px] uppercase">
            Signal lost
          </Text>
          <Text className="text-foreground mt-2 text-center text-xl font-bold">
            This screen is not on the map
          </Text>
          <BodyText className="text-muted mt-2 text-center">
            The link you followed does not point anywhere in MATCH Flow. Head back to the Command
            Center and pick a tool from there.
          </BodyText>
          <BackChip mode="jump" className="mt-6" />
          <Disclaimer className="mt-8" />
        </View>
        <BrandFooter className="px-8 pb-8" />
      </View>
    </>
  );
}
