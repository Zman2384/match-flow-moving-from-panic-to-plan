import { router } from 'expo-router';
import { BellRing, ChevronRight, Scale } from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LilZAvatar } from '@/components/LilZ';
import { BodyText, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { NOTIFICATIONS_SUPPORTED, syncReminders } from '@/lib/notifications';
import { HUD, HUD_DIM, LINE, MATCH_COLOR, STEEL } from '@/lib/palette';
import { useMatchStore } from '@/lib/store';

export default function SettingsScreen() {
  const emergencyContactName = useMatchStore((s) => s.emergencyContactName);
  const emergencyContactPhone = useMatchStore((s) => s.emergencyContactPhone);
  const setEmergencyContact = useMatchStore((s) => s.setEmergencyContact);
  const contacts = useMatchStore((s) => s.contacts);
  const addContact = useMatchStore((s) => s.addContact);
  const removeContact = useMatchStore((s) => s.removeContact);
  const remindersEnabled = useMatchStore((s) => s.remindersEnabled);
  const setRemindersEnabled = useMatchStore((s) => s.setRemindersEnabled);
  const lilzMemories = useMatchStore((s) => s.lilzMemories);
  const lilzMemoryEnabled = useMatchStore((s) => s.lilzMemoryEnabled);
  const setLilzMemoryEnabled = useMatchStore((s) => s.setLilzMemoryEnabled);
  const wipeLocalData = useMatchStore((s) => s.wipeLocalData);

  const [name, setName] = useState(emergencyContactName);
  const [phone, setPhone] = useState(emergencyContactPhone);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [saved, setSaved] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScreenShell
        title="Settings & privacy"
        subtitle="Everything here is stored only on this device"
      >
        <HudPanel label="Primary support contact">
          <BodyText className="text-muted mb-3">
            Shown first in the emergency sheet so you never have to search for it.
          </BodyText>
          <Field label="Name" value={name} onChangeText={setName} placeholder="Who you trust" />
          <Field
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Number to dial"
            keyboardType="phone-pad"
          />
          <Pressable
            onPress={() => {
              setEmergencyContact(name.trim(), phone.trim());
              setSaved(true);
            }}
            className="bg-hud mt-2 items-center rounded-xl py-3 active:opacity-80"
          >
            <Text className="text-abyss font-mono text-xs tracking-widest uppercase">
              {saved ? 'Saved' : 'Save contact'}
            </Text>
          </Pressable>
        </HudPanel>

        <SectionLabel>Safety network</SectionLabel>
        {contacts.length === 0 ? (
          <BodyText className="text-muted mb-3">
            No extra contacts yet. Add the people who would know where you are.
          </BodyText>
        ) : (
          contacts.map((contact) => (
            <View
              key={contact.id}
              className="border-border bg-panel/60 mb-2 flex-row items-center rounded-2xl border p-4"
            >
              <View className="flex-1">
                <Text className="text-foreground text-base font-semibold">{contact.name}</Text>
                <BodyText className="text-muted">
                  {contact.relationship || 'Contact'} · {contact.phone}
                </BodyText>
              </View>
              <Text
                onPress={() => removeContact(contact.id)}
                className="text-danger text-[11px] font-bold"
              >
                Remove
              </Text>
            </View>
          ))
        )}

        <HudPanel label="Add to network" className="mt-1">
          <Field label="Name" value={newName} onChangeText={setNewName} placeholder="Full name" />
          <Field
            label="Phone"
            value={newPhone}
            onChangeText={setNewPhone}
            placeholder="Number"
            keyboardType="phone-pad"
          />
          <Field
            label="Relationship"
            value={newRelation}
            onChangeText={setNewRelation}
            placeholder="Friend, sibling, clinician"
          />
          <Pressable
            disabled={!newName.trim() || !newPhone.trim()}
            onPress={() => {
              addContact({
                name: newName.trim(),
                phone: newPhone.trim(),
                relationship: newRelation.trim(),
              });
              setNewName('');
              setNewPhone('');
              setNewRelation('');
            }}
            className={`mt-2 items-center rounded-xl py-3 ${
              newName.trim() && newPhone.trim() ? 'bg-hud/20 border-hud border' : 'bg-panel-deep'
            }`}
          >
            <Text className="text-hud font-mono text-xs tracking-widest uppercase">
              Add contact
            </Text>
          </Pressable>
        </HudPanel>

        <SectionLabel>Notifications</SectionLabel>
        <View className="border-border bg-panel/60 flex-row items-center rounded-2xl border p-4">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-base font-semibold">Maintenance nudges</Text>
            <BodyText className="text-muted mt-0.5">
              Local prompts for doses, restocks, and testing cadence.
            </BodyText>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={(value) => {
              setRemindersEnabled(value);
              void syncReminders();
            }}
            disabled={!NOTIFICATIONS_SUPPORTED}
            thumbColor={remindersEnabled ? HUD : STEEL}
            trackColor={{ false: LINE, true: HUD_DIM }}
          />
        </View>
        <Pressable
          onPress={() => router.push('/tools/reminders')}
          accessibilityRole="button"
          className="border-hud/25 bg-hud/[0.07] mt-2 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <View className="bg-hud/15 h-9 w-9 items-center justify-center rounded-xl">
            <BellRing size={17} color={HUD} />
          </View>
          <View className="flex-1">
            <Text className="text-hud text-base font-bold">Cadence plan</Text>
            <BodyText className="text-muted mt-0.5">
              Choose which nudges fire, set the time, send a test prompt
            </BodyText>
          </View>
          <ChevronRight size={16} color={STEEL} />
        </Pressable>

        <SectionLabel>Lil Z</SectionLabel>
        <Pressable
          onPress={() => router.push('/lil-z')}
          accessibilityRole="button"
          className="border-hud/25 bg-hud/[0.07] flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <LilZAvatar size={38} />
          <View className="flex-1">
            <Text className="text-hud text-base font-bold">Open the conversation</Text>
            <BodyText className="text-muted mt-0.5">
              Your guide for PrEP, PEP timing, testing, and the words for the talk
            </BodyText>
          </View>
          <ChevronRight size={16} color={STEEL} />
        </Pressable>
        <View className="border-border bg-panel/60 mt-2 flex-row items-center rounded-2xl border p-4">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-base font-semibold">Agent memory</Text>
            <BodyText className="text-muted mt-0.5">
              {lilzMemoryEnabled
                ? `Lil Z is carrying ${lilzMemories.length} ${
                    lilzMemories.length === 1 ? 'fact' : 'facts'
                  } between chats. Facts are saved here and sent only when you enable live AI.`
                : 'Off — no durable facts are kept. Conversation history stays until you clear it.'}
            </BodyText>
          </View>
          <Switch
            value={lilzMemoryEnabled}
            onValueChange={setLilzMemoryEnabled}
            thumbColor={lilzMemoryEnabled ? HUD : STEEL}
            trackColor={{ false: LINE, true: HUD_DIM }}
          />
        </View>

        <SectionLabel>Data</SectionLabel>
        <Pressable
          onPress={() => {
            if (confirmWipe) {
              wipeLocalData();
              void syncReminders();
              setConfirmWipe(false);
              setName('');
              setPhone('');
            } else {
              setConfirmWipe(true);
            }
          }}
          className="border-danger/50 bg-danger/10 items-center rounded-2xl border p-4 active:opacity-70"
        >
          <Text className="text-danger text-base font-bold">
            {confirmWipe ? 'Tap again to erase everything' : 'Wipe all local data'}
          </Text>
          <BodyText className="text-muted mt-1 text-center">
            Clears your plan, logs, scripts, and contacts from this device.
          </BodyText>
        </Pressable>

        <SectionLabel>Legal & compliance</SectionLabel>
        <Pressable
          onPress={() => router.push('/legal')}
          accessibilityRole="button"
          accessibilityLabel="Legal and compliance documents"
          className="border-border bg-panel/60 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <View className="bg-match-h/15 h-11 w-11 items-center justify-center rounded-2xl">
            <Scale size={19} color={MATCH_COLOR.H} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-base font-semibold">Legal & Compliance</Text>
            <BodyText className="text-muted mt-0.5">
              Terms, privacy, medical disclaimer, facilitator protocols, accessibility
            </BodyText>
          </View>
          <ChevronRight size={16} color={STEEL} />
        </Pressable>
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'phone-pad' | 'default';
}) {
  return (
    <View className="mb-3">
      <Text className="text-muted mb-1.5 font-mono text-[10px] tracking-wider uppercase">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType ?? 'default'}
        placeholderTextColorClassName="accent-muted"
        className="border-border bg-panel-deep text-foreground font-body rounded-xl border px-3 py-3 text-base"
      />
    </View>
  );
}
