import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { Label } from 'heroui-native/label';
import { Spinner } from 'heroui-native/spinner';
import { ExternalLink, LocateFixed, MapPin, Navigation, Search } from '@/lib/icons';
import { useState } from 'react';
import {
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
  CLINIC_SEARCH_KINDS,
  findersFor,
  finderUrl,
  mapsSearchUrl,
  zipFrom,
  type ClinicSearchKind,
  type OfficialFinder,
} from '@/lib/clinics';
import { nearestZip } from '@/lib/nearestZip';
import { HUD, INK_ON_SIGNAL, SILVER } from '@/lib/palette';

export default function ClinicsScreen() {
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState<string | null>(null);
  const [fromGps, setFromGps] = useState(false);
  const [kind, setKind] = useState<ClinicSearchKind>('clinic');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function showError(message: string) {
    setError(message);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  function searchTyped() {
    const value = address.trim();
    if (!value) {
      showError('Enter a ZIP code or address to find nearby care.');
      return;
    }
    Keyboard.dismiss();
    setError(null);
    setFromGps(false);
    setPlace(value);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * GPS → nearest ZIP, entirely on the device. The coordinates are dropped as
   * soon as the ZIP is found: never saved, never sent anywhere.
   */
  async function locate() {
    if (locating) return;
    Keyboard.dismiss();
    setLocating(true);
    setError(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Location access is off. Enter a ZIP code or address instead.');
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const zip = await nearestZip(position.coords);
      if (!zip)
        throw new Error('No US ZIP code found near you. Enter a ZIP code or address instead.');
      setAddress(zip);
      setPlace(zip);
      setFromGps(true);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : '';
      showError(
        message.endsWith('instead.')
          ? message
          : 'Could not get your location. Enter a ZIP code or address, or try again.',
      );
    } finally {
      setLocating(false);
    }
  }

  function selectKind(next: ClinicSearchKind) {
    if (next === kind) return;
    setKind(next);
    void Haptics.selectionAsync();
  }

  async function openLink(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      showError('Could not open that link. Please try again.');
    }
  }

  const kindInfo = CLINIC_SEARCH_KINDS.find((k) => k.id === kind) ?? CLINIC_SEARCH_KINDS[0];
  const finders = findersFor(kind);
  const placeZip = place ? zipFrom(place) : null;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenShell title="Clinic Finder" showGuide={false}>
        <View className="gap-4">
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
              editable={!locating}
              autoComplete="off"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={searchTyped}
              onChangeText={(value) => {
                setAddress(value);
                setError(null);
              }}
            />
            <Button className="bg-hud rounded-xl" isDisabled={locating} onPress={searchTyped}>
              <Search size={18} color={INK_ON_SIGNAL} />
              <Button.Label className="font-body text-background text-base">
                Find nearby care
              </Button.Label>
            </Button>
            <Text className="font-body text-muted text-center text-base">or</Text>
            <Button
              variant="tertiary"
              feedbackVariant="scale"
              className="bg-panel-deep border-hud/40 rounded-xl border"
              isDisabled={locating}
              onPress={() => void locate()}
            >
              {locating ? <Spinner size="sm" /> : <LocateFixed size={18} color={HUD} />}
              <Button.Label className="font-body text-hud text-base">
                {locating ? 'Finding your ZIP…' : 'Use current location'}
              </Button.Label>
            </Button>
            <BodyText className="text-muted">
              Your location is turned into a ZIP code on this phone. Your exact location never
              leaves the phone, and nothing you search is saved. No account needed.
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
                evaluation. Start as soon as possible, within 72 hours. Do not delay care to
                complete a search.
              </BodyText>
            </View>
          ) : null}

          {error ? (
            <View
              accessibilityRole="alert"
              className="border-caution-edge/50 bg-panel rounded-2xl border p-4"
            >
              <BodyText className="text-caution-soft">{error}</BodyText>
            </View>
          ) : null}

          {place ? (
            <View className="border-hud/35 bg-hud/[0.08] gap-3 rounded-2xl border p-4">
              <Text className="text-hud font-mono text-[11px] tracking-[2px] uppercase">
                Near {place}
              </Text>
              {fromGps ? (
                <BodyText className="text-foreground">
                  Using ZIP {place}, the closest one to where you are.
                </BodyText>
              ) : null}
              <BodyText className="text-muted">
                See {kindInfo.plural} on Google Maps near {place}. Map results are not checked by
                MATCH Flow — call ahead to confirm hours and services.
              </BodyText>
              <Button
                className="bg-hud rounded-xl"
                onPress={() => void openLink(mapsSearchUrl(kind, place))}
              >
                <Navigation size={18} color={INK_ON_SIGNAL} />
                <Button.Label className="font-body text-background text-base">
                  Open map search
                </Button.Label>
              </Button>
            </View>
          ) : null}

          {finders.length > 0 ? (
            <View className="gap-3">
              <Text className="text-hud/70 font-mono text-[11px] tracking-[2px] uppercase">
                Official finders
              </Text>
              {finders.map((finder) => (
                <FinderCard
                  key={finder.id}
                  finder={finder}
                  place={place}
                  placeZip={placeZip}
                  openLink={openLink}
                />
              ))}
            </View>
          ) : null}
        </View>
      </ScreenShell>
    </KeyboardAvoidingView>
  );
}

function FinderCard({
  finder,
  place,
  placeZip,
  openLink,
}: {
  finder: OfficialFinder;
  place: string | null;
  placeZip: string | null;
  openLink: (url: string) => Promise<void>;
}) {
  const prefilled = !!(finder.zipUrl && placeZip);
  return (
    <View className="border-border bg-panel/80 gap-2 rounded-2xl border p-4">
      <Text className="text-foreground text-lg font-bold">{finder.name}</Text>
      <BodyText className="text-muted">{finder.operator}</BodyText>
      <BodyText className="text-foreground">{finder.detail}</BodyText>
      {place && !prefilled ? (
        <BodyText className="text-hud">Enter {placeZip ?? place} when the finder asks.</BodyText>
      ) : null}
      <Button
        variant="tertiary"
        feedbackVariant="scale"
        className="bg-panel-deep border-border mt-1 rounded-xl border"
        onPress={() => void openLink(place ? finderUrl(finder, place) : finder.url)}
      >
        <ExternalLink size={16} color={SILVER} />
        <Button.Label className="font-body text-foreground text-base">Open finder</Button.Label>
      </Button>
    </View>
  );
}
