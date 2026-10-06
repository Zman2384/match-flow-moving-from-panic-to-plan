import { Phone, X } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Modal, Platform, Pressable, Text, View } from 'react-native';

import { BodyText } from '@/components/ScreenShell';
import { HOTLINES } from '@/lib/content';
import { STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

function dial(number: string) {
  const cleaned = number.replace(/[^\d+]/g, '');
  const url = Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`;
  void Linking.openURL(url).catch(() => undefined);
}

/**
 * Floating panic button. Opens a sheet with the user's saved contact plus hotlines.
 */
export function PanicButton({ bottomOffset = 88 }: { bottomOffset?: number }) {
  const [open, setOpen] = useState(false);
  const name = useMatchStore((s) => s.emergencyContactName);
  const phone = useMatchStore((s) => s.emergencyContactPhone);

  return (
    <>
      <Pressable
        accessibilityLabel="Emergency contacts"
        onPress={() => setOpen(true)}
        className="bg-danger absolute right-4 h-12 w-12 items-center justify-center rounded-full shadow-lg active:opacity-80"
        style={{ bottom: bottomOffset }}
      >
        <Phone size={20} color="#ffffff" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1 bg-black/70" onPress={() => setOpen(false)} />
        <View className="bg-panel border-hud/30 absolute right-0 bottom-0 left-0 rounded-t-3xl border-t p-5 pb-10">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-foreground text-lg font-bold">Get help now</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={10} className="active:opacity-60">
              <X size={20} color={STEEL} />
            </Pressable>
          </View>

          {phone ? (
            <Pressable
              onPress={() => dial(phone)}
              className="bg-danger/20 border-danger/40 mb-3 rounded-2xl border p-4 active:opacity-80"
            >
              <Text className="text-danger text-xs font-bold tracking-wider uppercase">
                Your support contact
              </Text>
              <Text className="text-foreground mt-1 text-base font-bold">{name || 'Contact'}</Text>
              <BodyText className="text-muted">{phone}</BodyText>
            </Pressable>
          ) : (
            <View className="border-border mb-3 rounded-2xl border border-dashed p-4">
              <BodyText className="text-muted">
                No personal support contact saved yet. Add one in Settings.
              </BodyText>
            </View>
          )}

          <BodyText className="text-foreground mb-4">
            Possible HIV exposure? Go to the nearest emergency department now for urgent PEP
            evaluation. PEP must start within 72 hours — do not wait for a phone consultation.
          </BodyText>

          {HOTLINES.map((line) => (
            <Pressable
              key={line.label}
              onPress={() => dial(line.value)}
              className="border-border bg-panel-deep mb-2 flex-row items-center justify-between rounded-2xl border p-4 active:opacity-80"
            >
              <View className="flex-1 pr-3">
                <Text className="text-foreground text-base font-semibold">{line.label}</Text>
                <BodyText className="text-muted mt-0.5">{line.note}</BodyText>
              </View>
              <Text className="text-hud text-base font-bold">{line.value}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}
