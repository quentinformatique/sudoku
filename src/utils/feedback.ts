import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

let clickSound: Audio.Sound | null = null;
let isLoading = false;

const ensureSound = async () => {
  if (clickSound !== null || isLoading) {
    return;
  }
  isLoading = true;
  const { sound } = await Audio.Sound.createAsync(
    require('../../assets/sounds/click.wav'),
    { volume: 0.2 },
  );
  clickSound = sound;
  isLoading = false;
};

export const playClick = async (enabled: boolean) => {
  if (!enabled) return;
  await ensureSound();
  if (clickSound) {
    await clickSound.replayAsync();
  }
};

export const triggerHaptic = async (enabled: boolean) => {
  if (!enabled) return;
  await Haptics.selectionAsync();
};

export const unloadSounds = async () => {
  if (clickSound) {
    await clickSound.unloadAsync();
    clickSound = null;
  }
};
