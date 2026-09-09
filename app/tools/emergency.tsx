import { Clock, Phone } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Platform, Pressable, Text, View } from 'react-native';

import { BodyText, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { EMERGENCY_PROTOCOLS, HOTLINES } from '@/lib/content';
import { PIECE_COLOR } from '@/lib/match';
import { HUD, LINE_SOFT, PANEL } from '@/lib/palette';

function dial(number: string) {
  const cleaned = number.replace(/[^\d+]/g, '');
  void Linking.openURL(Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`).catch(
    () => undefined,
  );
}

export default function EmergencyScreen() {
  const [openId, setOpenId] = useState<string | null>(EMERGENCY_PROTOCOLS[0]?.id ?? null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <ScreenShell
      title="Emergency Protocols"
      subtitle="What to do in the first hours, in order"
      hint="If you are in danger right now, call your local emergency number first."
    >
      <View className="border-danger/40 bg-danger/10 mb-5 rounded-2xl border p-4">
        <Text className="text-danger text-[10px] font-bold tracking-widest uppercase">
          Time matters
        </Text>
        <BodyText className="text-foreground mt-1">
          PEP works best within hours of exposure and can still be started up to 72 hours after. Any
          emergency department can begin it — you do not need an appointment.
        </BodyText>
      </View>

      {EMERGENCY_PROTOCOLS.map((protocol) => {
        const open = openId === protocol.id;
        const color = PIECE_COLOR[protocol.piece];
        return (
          <View
            key={protocol.id}
            className="mb-3 overflow-hidden rounded-2xl border"
            style={{ borderColor: `${color}44`, backgroundColor: `${PANEL}99` }}
          >
            <Pressable
              onPress={() => setOpenId(open ? null : protocol.id)}
              className="flex-row items-center gap-3 p-4 active:opacity-70"
            >
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}26` }}
              >
                <Text className="text-sm font-bold" style={{ color }}>
                  {protocol.piece}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-[14px] font-bold">{protocol.title}</Text>
                <Text className="text-muted mt-0.5 text-[11px]">{protocol.subtitle}</Text>
              </View>
            </Pressable>

            {open ? (
              <View className="px-4 pb-4">
                {protocol.clock ? (
                  <View className="border-hud/25 bg-hud/[0.08] mb-3 flex-row items-center gap-2 rounded-xl border px-3 py-2">
                    <Clock size={13} color={HUD} />
                    <Text className="text-hud text-[11px] font-semibold">{protocol.clock}</Text>
                  </View>
                ) : null}

                {protocol.steps.map((step, i) => {
                  const stepKey = `${protocol.id}-${i}`;
                  const checked = done[stepKey];
                  return (
                    <Pressable
                      key={stepKey}
                      onPress={() => setDone((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }))}
                      className="mb-2 flex-row items-start gap-3 active:opacity-70"
                    >
                      <View
                        className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
                        style={{
                          borderColor: checked ? color : LINE_SOFT,
                          backgroundColor: checked ? color : 'transparent',
                        }}
                      >
                        <Text className="text-[10px] font-bold text-black">
                          {checked ? '✓' : ''}
                        </Text>
                      </View>
                      <BodyText
                        className={`flex-1 ${
                          checked ? 'text-muted line-through' : 'text-foreground'
                        }`}
                      >
                        {step}
                      </BodyText>
                    </Pressable>
                  );
                })}

                <View className="border-border mt-3 rounded-xl border border-dashed p-3">
                  <Text className="text-muted mb-1.5 text-[10px] font-bold tracking-wider uppercase">
                    Do not
                  </Text>
                  {protocol.avoid.map((item) => (
                    <BodyText key={item} className="text-muted">
                      · {item}
                    </BodyText>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        );
      })}

      <SectionLabel>Call for guidance</SectionLabel>
      {HOTLINES.map((line) => (
        <Pressable
          key={line.label}
          onPress={() => dial(line.value)}
          className="border-hud/25 bg-panel/70 mb-2 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <Phone size={16} color={HUD} />
          <View className="flex-1">
            <Text className="text-foreground text-base font-semibold">{line.label}</Text>
            <BodyText className="text-muted mt-0.5">{line.note}</BodyText>
          </View>
          <Text className="text-hud text-base font-bold">{line.value}</Text>
        </Pressable>
      ))}
    </ScreenShell>
  );
}
