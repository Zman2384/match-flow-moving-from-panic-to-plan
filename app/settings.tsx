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

import { Disclaimer, HudPanel, ScreenShell, SectionLabel } from '@/components/ScreenShell';
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
            onValueChange={setRemindersEnabled}
            thumbColor={remindersEnabled ? '#00e5ff' : '#94a3b8'}
            trackColor={{ false: '#1c3a55', true: '#0a4f63' }}
          />
        </View>

        <SectionLabel>Data</SectionLabel>
        <Pressable
          onPress={() => {
            if (confirmWipe) {
              wipeLocalData();
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
