import { Bookmark, Navigation, Phone } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import MapView from '@/components/MapView';
import type { MapMarker } from '@/components/MapView';
import { BodyText, ScreenShell } from '@/components/ScreenShell';
import { CLINICS, CLINIC_KINDS, type Clinic } from '@/lib/content';
import { GHOST_COLOR, HUD, MATCH_COLOR, STATE_PASS, STEEL } from '@/lib/palette';

/** Markers stay inside the brand palette: pillar hues plus the cyan signal. */
const KIND_COLOR: Record<Clinic['kind'], string> = {
  pep: MATCH_COLOR.T,
  prep: MATCH_COLOR.M,
  testing: MATCH_COLOR.A,
  clinic: GHOST_COLOR.logistical,
  pharmacy: MATCH_COLOR.H,
};

function dial(number: string) {
  const cleaned = number.replace(/[^\d+]/g, '');
  void Linking.openURL(Platform.OS === 'ios' ? `telprompt:${cleaned}` : `tel:${cleaned}`).catch(
    () => undefined,
  );
}

function openDirections(clinic: Clinic) {
  const query = encodeURIComponent(`${clinic.name} ${clinic.address}`);
  const url =
    Platform.OS === 'ios'
      ? `https://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
  void Linking.openURL(url).catch(() => undefined);
}

export default function ClinicsScreen() {
  const [kind, setKind] = useState<Clinic['kind'] | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (kind === 'all' ? CLINICS : CLINICS.filter((c) => c.kind === kind)),
    [kind],
  );

  const markers = filtered.map((clinic) => ({
    id: clinic.id,
    coordinate: { latitude: clinic.latitude, longitude: clinic.longitude },
    title: clinic.name,
    description: clinic.hours,
    color: KIND_COLOR[clinic.kind],
    onPress: () => setSelectedId(clinic.id),
  }));

  const selected = filtered.find((c) => c.id === selectedId);

  return (
    <ScreenShell
      title="Clinic Finder"
      subtitle="Sample access points — verify hours before you travel"
      hint="For exposure inside 72 hours, an emergency department is always an option."
      showGuide={false}
    >
      <View className="border-hud/25 h-56 overflow-hidden rounded-3xl border">
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
          }}
          markers={markers}
          onMarkerPress={(marker: MapMarker) => setSelectedId(marker.id ?? null)}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: 14 }}
      >
        <Chip label="All" active={kind === 'all'} onPress={() => setKind('all')} />
        {CLINIC_KINDS.map((item) => (
          <Chip
            key={item.id}
            label={`${item.emoji} ${item.label}`}
            active={kind === item.id}
            onPress={() => setKind(item.id)}
          />
        ))}
      </ScrollView>

      {selected ? (
        <View
          className="mb-3 rounded-2xl border p-4"
          style={{
            borderColor: `${KIND_COLOR[selected.kind]}66`,
            backgroundColor: `${KIND_COLOR[selected.kind]}14`,
          }}
        >
          <Text
            className="text-[10px] font-bold tracking-widest uppercase"
            style={{ color: KIND_COLOR[selected.kind] }}
          >
            Selected
          </Text>
          <Text className="text-foreground mt-1 text-base font-bold">{selected.name}</Text>
          <BodyText className="text-muted mt-0.5">{selected.address}</BodyText>
        </View>
      ) : null}

      {filtered.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} onSelect={() => setSelectedId(clinic.id)} />
      ))}
    </ScreenShell>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3.5 py-2 active:opacity-70 ${
        active ? 'border-hud bg-hud/15' : 'border-border bg-panel/60'
      }`}
    >
      <Text
        className={`text-[11px] font-bold tracking-wider uppercase ${
          active ? 'text-hud' : 'text-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ClinicCard({ clinic, onSelect }: { clinic: Clinic; onSelect: () => void }) {
  const color = KIND_COLOR[clinic.kind];
  return (
    <Pressable
      onPress={onSelect}
      className="border-border bg-panel/60 mb-3 rounded-2xl border p-4 active:opacity-70"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text className="text-foreground text-base font-bold">{clinic.name}</Text>
          <BodyText className="text-muted mt-0.5">
            {clinic.distance} · {clinic.hours}
          </BodyText>
        </View>
        <View className="rounded-full px-2 py-1" style={{ backgroundColor: `${color}26` }}>
          <Text className="text-[9px] font-bold uppercase" style={{ color }}>
            {clinic.kind}
          </Text>
        </View>
      </View>

      <View className="mt-2 flex-row flex-wrap gap-1.5">
        {clinic.services.map((service) => (
          <View key={service} className="bg-panel-deep rounded-md px-2 py-1">
            <Text className="text-muted text-[10px]">{service}</Text>
          </View>
        ))}
      </View>

      {clinic.slidingScale ? (
        <View className="mt-2 flex-row items-center gap-1.5">
          <Bookmark size={11} color={STATE_PASS} />
          <Text className="text-state-pass text-[10px] font-semibold">
            Sliding scale / free options
          </Text>
        </View>
      ) : null}

      <View className="mt-3 flex-row gap-2">
        <Pressable
          onPress={() => dial(clinic.phone)}
          className="border-hud/40 bg-hud/10 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-2.5 active:opacity-70"
        >
          <Phone size={13} color={HUD} />
          <Text className="text-hud text-[11px] font-bold">Call</Text>
        </Pressable>
        <Pressable
          onPress={() => openDirections(clinic)}
          className="border-border bg-panel-deep flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-2.5 active:opacity-70"
        >
          <Navigation size={13} color={STEEL} />
          <Text className="text-muted text-[11px] font-bold">Directions</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
