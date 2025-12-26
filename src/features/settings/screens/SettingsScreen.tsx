import { useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useSnackbar } from '../../../app/providers/SnackbarProvider';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { Screen } from '../../../components/layout/Screen';
import { AppText } from '../../../components/ui/AppText';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { ListItem } from '../../../components/ui/ListItem';
import { SectionHeader } from '../../../components/ui/SectionHeader';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { ToggleRow } from '../../../components/ui/ToggleRow';
import { deleteAllData } from '../../../data/repositories/gameRepository';
import { normalizeHex } from '../../../utils/color';
import { useGameStore } from '../../game/gameStore';
import { accentPalette } from '../constants';
import { useSettingsStore } from '../settingsStore';
import { ErrorFeedbackMode, LanguageCode, ThemePreference } from '../types';

export const SettingsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const snackbar = useSnackbar();
  const theme = useAppTheme();
  const gameHydrate = useGameStore((state) => state.hydrate);
  const {
    themeMode,
    accentColor,
    customAccent,
    useCustomAccent,
    soundEnabled,
    hapticsEnabled,
    highContrast,
    reduceMotion,
    largeNumbers,
    errorFeedback,
    language,
    setThemeMode,
    setAccentColor,
    setCustomAccent,
    setUseCustomAccent,
    update,
  } = useSettingsStore();
  const [customValue, setCustomValue] = useState(customAccent ?? '');

  const themeOptions = useMemo<{ label: string; value: ThemePreference }[]>(
    () => [
      { label: t('themes.system'), value: 'system' },
      { label: t('themes.light'), value: 'light' },
      { label: t('themes.dark'), value: 'dark' },
    ],
    [t],
  );

  const feedbackOptions = useMemo<{ label: string; value: ErrorFeedbackMode }[]>(
    () => [
      { label: t('settings.instantFeedback'), value: 'instant' },
      { label: t('settings.freeMode'), value: 'free' },
    ],
    [t],
  );

  const languageOptions = useMemo<{ label: string; value: LanguageCode }[]>(
    () => [
      { label: 'EN', value: 'en' },
      { label: 'FR', value: 'fr' },
    ],
    [],
  );

  const applyCustomAccent = () => {
    const normalized = normalizeHex(customValue);
    if (!normalized) {
      snackbar.show(t('settings.invalidHex'));
      return;
    }
    setCustomAccent(normalized);
    setUseCustomAccent(true);
  };

  const handleClearHistory = async () => {
    await deleteAllData();
    await gameHydrate();
    snackbar.show(t('settings.historyCleared'));
  };

  return (
    <Screen scroll>
      <AppText variant="title">{t('settings.title')}</AppText>

      <SectionHeader title={t('settings.appearance')} />
      <Card style={styles.card}>
        <AppText variant="label">{t('settings.theme')}</AppText>
        <SegmentedControl
          options={themeOptions}
          value={themeMode}
          onChange={setThemeMode}
        />
        <AppText variant="label" style={styles.label}>
          {t('settings.accent')}
        </AppText>
        <View style={styles.palette}>
          {accentPalette.map((color) => (
            <Pressable
              key={color}
              onPress={() => {
                setAccentColor(color);
                setUseCustomAccent(false);
              }}
              style={[
                styles.colorButton,
                {
                  backgroundColor: color,
                  borderColor:
                    accentColor === color && !useCustomAccent
                      ? theme.colors.text
                      : theme.colors.border,
                },
              ]}
            />
          ))}
        </View>
        <AppText variant="label" style={styles.label}>
          {t('settings.customAccent')}
        </AppText>
        <View style={styles.customRow}>
          <TextInput
            value={customValue}
            onChangeText={setCustomValue}
            placeholder="#FF4D4D"
            autoCapitalize="characters"
            autoCorrect={false}
            placeholderTextColor={theme.colors.muted}
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
                fontFamily: theme.typography.fontFamily.medium,
              },
            ]}
          />
          <Button
            label={t('common.apply')}
            onPress={applyCustomAccent}
            variant="secondary"
          />
        </View>
        <ToggleRow
          label={t('settings.customAccent')}
          value={useCustomAccent}
          onChange={setUseCustomAccent}
        />
      </Card>

      <SectionHeader title={t('settings.accessibility')} />
      <Card style={styles.card}>
        <ToggleRow
          label={t('settings.highContrast')}
          value={highContrast}
          onChange={(value) => {
            update({ highContrast: value });
          }}
        />
        <ToggleRow
          label={t('settings.reduceMotion')}
          value={reduceMotion}
          onChange={(value) => {
            update({ reduceMotion: value });
          }}
        />
        <ToggleRow
          label={t('settings.largeNumbers')}
          value={largeNumbers}
          onChange={(value) => {
            update({ largeNumbers: value });
          }}
        />
      </Card>

      <SectionHeader title={t('settings.gameplay')} />
      <Card style={styles.card}>
        <AppText variant="label">{t('settings.errorFeedback')}</AppText>
        <SegmentedControl
          options={feedbackOptions}
          value={errorFeedback}
          onChange={(value) => {
            update({ errorFeedback: value });
          }}
        />
        <ToggleRow
          label={t('settings.sound')}
          value={soundEnabled}
          onChange={(value) => {
            update({ soundEnabled: value });
          }}
        />
        <ToggleRow
          label={t('settings.haptics')}
          value={hapticsEnabled}
          onChange={(value) => {
            update({ hapticsEnabled: value });
          }}
        />
      </Card>

      <SectionHeader title={t('settings.language')} />
      <Card style={styles.card}>
        <SegmentedControl
          options={languageOptions}
          value={language}
          onChange={(value) => {
            update({ language: value });
          }}
        />
      </Card>

      <SectionHeader title={t('settings.data')} />
      <Card style={styles.card}>
        <Button
          label={t('settings.clearHistory')}
          variant="secondary"
          onPress={handleClearHistory}
        />
      </Card>

      <SectionHeader title={t('settings.title')} />
      <ListItem
        title={t('settings.about')}
        onPress={() => {
          navigation.navigate('About');
        }}
        icon="information-outline"
      />
      <ListItem
        title={t('settings.help')}
        onPress={() => {
          navigation.navigate('Help');
        }}
        icon="help-circle-outline"
      />
      <ListItem
        title={t('settings.learning')}
        onPress={() => {
          navigation.navigate('Learning');
        }}
        icon="school-outline"
      />
      <ListItem
        title={t('settings.privacy')}
        onPress={() => {
          navigation.navigate('Privacy');
        }}
        icon="shield-outline"
      />
      <ListItem
        title={t('settings.terms')}
        onPress={() => {
          navigation.navigate('Terms');
        }}
        icon="file-document-outline"
      />
      <ListItem
        title={t('settings.licenses')}
        onPress={() => {
          navigation.navigate('Licenses');
        }}
        icon="code-tags"
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: 12,
    marginTop: 12,
  },
  label: {
    marginTop: 12,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  colorButton: {
    height: 40,
    borderRadius: 12,
    width: 54,
    borderWidth: 2,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
