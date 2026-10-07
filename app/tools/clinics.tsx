import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Button, Input, Label, Skeleton, Spinner } from 'heroui-native';
import { LocateFixed, MapPin, Navigation, Phone, Search } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { BodyText, ScreenShell } from '@/components/ScreenShell';
import {
  checkClinicSearch,
  CLINIC_SEARCH_KINDS,
  searchClinics,
  type ClinicSearchKind,
  type ClinicSearchOrigin,
  type ClinicSearchResults,
  type NearbyClinic,
} from '@/lib/clinics';
import { HUD, INK_ON_SIGNAL, SILVER } from '@/lib/palette';

export default function ClinicsScreen() {
  const [address, setAddress] = useState('');
  const [kind, setKind] = useState<ClinicSearchKind>('clinic');
  const [results, setResults] = useState<ClinicSearchResults | null>(null);
  const [pending, setPending] = useState<'address' | 'location' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const originRef = useRef<ClinicSearchOrigin | null>(null);
  const retryRef = useRef<'address' | 'location'>('address');

  function showError(message: string) {
    setError(message);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  async function find(
    mode: 'address' | 'location',
    nextKind = kind,
    existingOrigin?: ClinicSearchOrigin,
  ) {
    if (pending) return;
    retryRef.current = mode;
    if (!existingOrigin && mode === 'address' && !address.trim()) {
      showError('Enter a ZIP code or address to find nearby clinics.');
      return;
    }
    Keyboard.dismiss();
    setPending(mode);
    setError(null);
    setResults(null);
    try {
      let origin = existingOrigin;
      if (!origin && mode === 'location') {
        // Check availability before requesting permission or accessing location.
        await checkClinicSearch();
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== Location.PermissionStatus.GRANTED) {
          throw new Error('Location access is off. Enter a ZIP code or address instead.');
        }
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        origin = {
          coordinate: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        };
      }
      origin ??= { address: address.trim() };
      const data = await searchClinics(origin, nextKind);
      originRef.current = origin;
      setResults(data);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : 'Could not find nearby clinics. Please try again.';
      showError(
        mode === 'location' && /location.*(unavailable|timeout)|position/i.test(message)
          ? 'Could not get your location. Enter a ZIP code or address, or try again.'
          : message,
      );
    } finally {
      setPending(null);
    }
  }

  function selectKind(next: ClinicSearchKind) {
    if (next === kind || pending) return;
    setKind(next);
    setError(null);
    void Haptics.selectionAsync();
    if (originRef.current) void find(retryRef.current, next, originRef.current);
  }

  async function openLink(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      showError('Could not open that link. Please try again.');
    }
  }

  const header = (
    <View className="gap-4 pb-4">
      <View className="border-hud/30 bg-panel/80 gap-3 rounded-3xl border p-4">
        <View className="flex-row items-center gap-2">
          <MapPin size={22} color={HUD} />
          <Text className="text-foreground flex-1 text-xl font-bold">Find care near you</Text>
        </View>
        <Label>
          <Label.Text className="font-body text-foreground text-base">
            ZIP code or address
          </Label.Text>
        </Label>
        <Input
          accessibilityLabel="ZIP code or address"
          className="font-body border-border bg-panel-deep text-foreground min-h-12 rounded-xl border text-base"
          placeholder="ZIP code or street, city, state"
          value={address}
          editable={!pending}
          autoComplete="off"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => void find('address')}
          onChangeText={(value) => {
            setAddress(value);
            setResults(null);
            setError(null);
            originRef.current = null;
          }}
        />
        <Button
          className="bg-hud rounded-xl"
          isDisabled={!!pending}
          onPress={() => void find('address')}
        >
          {pending === 'address' ? (
            <Spinner size="sm" />
          ) : (
            <Search size={18} color={INK_ON_SIGNAL} />
          )}
          <Button.Label className="font-body text-background text-base">
            {pending === 'address' ? 'Finding care…' : 'Find nearby clinics'}
          </Button.Label>
        </Button>
        <Text className="font-body text-muted text-center text-base">or</Text>
        <Button
          variant="tertiary"
          feedbackVariant="scale"
          className="bg-panel-deep border-hud/40 rounded-xl border"
          isDisabled={!!pending}
          onPress={() => void find('location')}
        >
          {pending === 'location' ? <Spinner size="sm" /> : <LocateFixed size={18} color={HUD} />}
          <Button.Label className="font-body text-hud text-base">
            {pending === 'location' ? 'Finding your location…' : 'Use current location'}
          </Button.Label>
        </Button>
        <BodyText className="text-muted">
          Searching sends your location to Google Maps through our search service. MATCH Flow does
          not save it. No account needed.
        </BodyText>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {CLINIC_SEARCH_KINDS.map((item) => (
          <Button
            key={item.id}
            variant="tertiary"
            feedbackVariant="scale"
            size="sm"
            isDisabled={!!pending}
            onPress={() => selectKind(item.id)}
            accessibilityState={{ selected: kind === item.id }}
            className={`rounded-full border ${kind === item.id ? 'border-hud bg-hud/15' : 'border-border bg-panel/60'}`}
          >
            <Button.Label
              numberOfLines={1}
              className={`font-body text-base ${kind === item.id ? 'text-hud' : 'text-foreground'}`}
            >
              {item.label}
            </Button.Label>
          </Button>
        ))}
      </ScrollView>
      {kind === 'pep' ? (
        <View className="border-caution-edge/50 bg-caution-edge/10 rounded-2xl border p-4">
          <BodyText className="text-caution-soft">
            For possible HIV exposure, go to the nearest emergency department now for urgent PEP
            evaluation. Start as soon as possible, within 72 hours. Do not delay care to complete a
            search.
          </BodyText>
        </View>
      ) : null}
      {error ? (
        <View
          accessibilityRole="alert"
          className="border-caution-edge/50 bg-panel rounded-2xl border p-4"
        >
          <BodyText className="text-caution-soft">{error}</BodyText>
          <Button
            variant="tertiary"
            feedbackVariant="scale"
            className="bg-panel-deep border-hud/40 mt-3 border"
            onPress={() => void find(retryRef.current)}
          >
            <Button.Label className="font-body text-hud text-base">Try again</Button.Label>
          </Button>
        </View>
      ) : null}
      {pending ? (
        <View className="gap-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </View>
      ) : null}
      {results ? (
        <View className="gap-2">
          <Text className="text-foreground text-lg font-bold">Nearest results</Text>
          <BodyText className="text-hud">{results.originLabel}</BodyText>
          <BodyText className="text-muted">
            Up to 20 matches within 31 miles, sorted by straight-line distance. Confirm hours and
            services before you travel.
          </BodyText>
          <Text className="text-foreground text-base font-medium">Google Maps</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenShell title="Clinic Finder" showGuide={false} plain>
        <FlatList
          data={results?.clinics ?? []}
          keyExtractor={(clinic) => clinic.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          ListHeaderComponent={header}
          renderItem={({ item }) => <ClinicCard clinic={item} openLink={openLink} />}
          ListEmptyComponent={
            results && !pending ? (
              <View className="border-border bg-panel/60 items-center gap-3 rounded-2xl border p-5">
                <MapPin size={30} color={HUD} />
                <BodyText className="text-foreground text-center">
                  No nearby matches. Try another location or care type.
                </BodyText>
                <Button
                  variant="tertiary"
                  feedbackVariant="scale"
                  onPress={() => {
                    setResults(null);
                    setAddress('');
                    originRef.current = null;
                  }}
                >
                  <Button.Label className="font-body text-hud text-base">
                    Change location
                  </Button.Label>
                </Button>
              </View>
            ) : null
          }
        />
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function ClinicCard({
  clinic,
  openLink,
}: {
  clinic: NearbyClinic;
  openLink: (url: string) => Promise<void>;
}) {
  return (
    <View className="border-border bg-panel/80 mb-3 gap-2 rounded-2xl border p-4">
      <Text className="text-foreground text-lg font-bold">{clinic.name}</Text>
      <BodyText className="text-hud">
        {clinic.distanceMiles.toFixed(1)} mi away
        {clinic.openNow === null ? '' : clinic.openNow ? ' · Open now' : ' · Closed now'}
      </BodyText>
      <BodyText className="text-muted">{clinic.address}</BodyText>
      <View className="mt-2 flex-row gap-2">
        {clinic.phone ? (
          <Button
            variant="tertiary"
            feedbackVariant="scale"
            className="bg-panel-deep border-hud/40 flex-1 rounded-xl border"
            onPress={() => void openLink(`tel:${clinic.phone!.replace(/[^\d+]/g, '')}`)}
          >
            <Phone size={16} color={HUD} />
            <Button.Label className="font-body text-hud text-base">Call</Button.Label>
          </Button>
        ) : null}
        <Button
          variant="tertiary"
          feedbackVariant="scale"
          className="bg-panel-deep border-border flex-1 rounded-xl border"
          onPress={() => void openLink(clinic.mapsUrl)}
        >
          <Navigation size={16} color={SILVER} />
          <Button.Label className="font-body text-foreground text-base">Directions</Button.Label>
        </Button>
      </View>
      {clinic.attributions.map((attribution) =>
        attribution.uri ? (
          <Button
            key={JSON.stringify([attribution.provider, attribution.uri])}
            variant="tertiary"
            feedbackVariant="scale"
            className="bg-transparent"
            onPress={() => void openLink(attribution.uri!)}
          >
            <Button.Label numberOfLines={1} className="text-muted">
              {attribution.provider}
            </Button.Label>
          </Button>
        ) : (
          <BodyText
            key={JSON.stringify([attribution.provider, attribution.uri])}
            className="text-muted"
          >
            {attribution.provider}
          </BodyText>
        ),
      )}
    </View>
  );
}
