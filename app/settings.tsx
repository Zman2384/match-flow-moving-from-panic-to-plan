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
import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
import { NOTIFICATIONS_SUPPORTED, syncReminders } from '@/lib/notifications';
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
          <Text className="text-muted mb-3 text-[11px]">
            Shown first in the emergency sheet so you never have to search for it.
          </Text>
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
            <Text className="text-abyss text-xs font-bold tracking-widest uppercase">
              {saved ? 'Saved' : 'Save contact'}
            </Text>
          </Pressable>
        </HudPanel>

        <SectionLabel>Safety network</SectionLabel>
        {contacts.length === 0 ? (
          <Text className="text-muted mb-3 text-[12px]">
            No extra contacts yet. Add the people who would know where you are.
          </Text>
        ) : (
          contacts.map((contact) => (
            <View
              key={contact.id}
              className="border-border bg-panel/60 mb-2 flex-row items-center rounded-2xl border p-4"
            >
              <View className="flex-1">
                <Text className="text-foreground text-sm font-semibold">{contact.name}</Text>
                <Text className="text-muted text-[11px]">
                  {contact.relationship || 'Contact'} · {contact.phone}
                </Text>
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
            <Text className="text-hud text-xs font-bold tracking-widest uppercase">
              Add contact
            </Text>
          </Pressable>
        </HudPanel>

        <SectionLabel>Notifications</SectionLabel>
        <View className="border-border bg-panel/60 flex-row items-center rounded-2xl border p-4">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-sm font-semibold">Maintenance nudges</Text>
            <Text className="text-muted mt-0.5 text-[11px]">
              Local prompts for doses, restocks, and testing cadence.
            </Text>
          </View>
          <Switch
            value={remindersEnabled}
            onValueChange={(value) => {
              setRemindersEnabled(value);
              void syncReminders();
            }}
            disabled={!NOTIFICATIONS_SUPPORTED}
            thumbColor={remindersEnabled ? '#00e5ff' : '#94a3b8'}
            trackColor={{ false: '#1c3a55', true: '#0a4f63' }}
          />
        </View>
        <Pressable
          onPress={() => router.push('/tools/reminders')}
          accessibilityRole="button"
          className="border-hud/25 bg-hud/[0.07] mt-2 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <View className="bg-hud/15 h-9 w-9 items-center justify-center rounded-xl">
            <BellRing size={17} color="#00e5ff" />
          </View>
          <View className="flex-1">
            <Text className="text-hud text-[13px] font-bold">Cadence plan</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">
              Choose which nudges fire, set the time, send a test prompt
            </Text>
          </View>
          <ChevronRight size={16} color="#5f7b96" />
        </Pressable>

        <SectionLabel>Lil Z</SectionLabel>
        <Pressable
          onPress={() => router.push('/lil-z')}
          accessibilityRole="button"
          className="border-hud/25 bg-hud/[0.07] flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <LilZAvatar size={38} />
          <View className="flex-1">
            <Text className="text-hud text-[13px] font-bold">Open the conversation</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">
              Your guide for PrEP, PEP timing, testing, and the words for the talk
            </Text>
          </View>
          <ChevronRight size={16} color="#5f7b96" />
        </Pressable>
        <View className="border-border bg-panel/60 mt-2 flex-row items-center rounded-2xl border p-4">
          <View className="flex-1 pr-3">
            <Text className="text-foreground text-sm font-semibold">Agent memory</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">
              {lilzMemoryEnabled
                ? `Lil Z is carrying ${lilzMemories.length} ${
                    lilzMemories.length === 1 ? 'fact' : 'facts'
                  } between chats, stored on this device only.`
                : 'Off — every chat starts from scratch and nothing is saved.'}
            </Text>
          </View>
          <Switch
            value={lilzMemoryEnabled}
            onValueChange={setLilzMemoryEnabled}
            thumbColor={lilzMemoryEnabled ? '#00e5ff' : '#94a3b8'}
            trackColor={{ false: '#1c3a55', true: '#0a4f63' }}
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
          <Text className="text-danger text-sm font-bold">
            {confirmWipe ? 'Tap again to erase everything' : 'Wipe all local data'}
          </Text>
          <Text className="text-muted mt-1 text-center text-[11px]">
            Clears your plan, logs, scripts, and contacts from this device.
          </Text>
        </Pressable>

        <SectionLabel>Legal & compliance</SectionLabel>
        <Pressable
          onPress={() => router.push('/legal')}
          accessibilityRole="button"
          accessibilityLabel="Legal and compliance documents"
          className="border-border bg-panel/60 flex-row items-center gap-3 rounded-2xl border p-4 active:opacity-70"
        >
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#f9731626]">
            <Scale size={19} color="#f97316" />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-sm font-semibold">Legal & Compliance</Text>
            <Text className="text-muted mt-0.5 text-[11px] leading-4">
              Terms, privacy, medical disclaimer, facilitator protocols, accessibility
            </Text>
          </View>
          <ChevronRight size={16} color="#5f7b96" />
        </Pressable>

        <Disclaimer />
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
      <Text className="text-muted mb-1.5 text-[10px] font-bold tracking-wider uppercase">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType ?? 'default'}
        placeholderTextColorClassName="accent-muted"
        className="border-border bg-panel-deep text-foreground rounded-xl border px-3 py-3 text-sm"
      />
    </View>
  );
}
