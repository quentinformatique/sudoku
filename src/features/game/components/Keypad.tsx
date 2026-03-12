import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../core/providers/ThemeProvider';
import { AppText } from '../../../components/ui/AppText';

export const Keypad = ({
  onNumber,
  onErase,
  onUndo,
  onRedo,
  onHint,
  onAutoPencil,
  labels,
  disabledNumbers,
  hintsRemaining = 0,
  numPerRow = 5,
  numHeight,
}: {
  onNumber: (value: number) => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onHint: () => void;
  onAutoPencil: () => void;
  labels: { erase: string; undo: string; redo: string; hint: string; autoPencil: string };
  keySize?: number;
  disabledNumbers?: number[];
  hintsRemaining?: number;
  numPerRow?: number;
  numHeight?: number;
}) => {
  const theme = useAppTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.numbers}>
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          const isDisabled = disabledNumbers?.includes(value) ?? false;
          return (
            <Pressable
              key={value}
              onPress={() => onNumber(value)}
              disabled={isDisabled}
              style={({ pressed }) => [
                styles.key,
                {
                  width: `${(100 / numPerRow) - 2}%`,
                  height: numHeight || undefined,
                  aspectRatio: numHeight ? undefined : 1,
                  backgroundColor: theme.colors.card,
                  borderColor: isDisabled ? theme.colors.border : theme.colors.muted,
                  opacity: isDisabled ? 0.3 : pressed ? 0.6 : 1,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                },
              ]}
            >
              <AppText
                style={{
                  fontSize: 24,
                  fontFamily: theme.typography.fontFamily.medium,
                  color: isDisabled ? theme.colors.muted : theme.colors.text,
                }}
              >
                {value}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      
      <View style={styles.actions}>
        <Pressable
          onPress={onUndo}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="undo" size={20} color={theme.colors.text} />
          <AppText style={[styles.actionLabel, { color: theme.colors.muted }]}>{labels.undo}</AppText>
        </Pressable>
        
        <Pressable
          onPress={onErase}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="backspace-outline" size={20} color={theme.colors.danger} />
          <AppText style={[styles.actionLabel, { color: theme.colors.danger }]}>{labels.erase}</AppText>
        </Pressable>

        <Pressable
          onPress={onRedo}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="redo" size={20} color={theme.colors.text} />
          <AppText style={[styles.actionLabel, { color: theme.colors.muted }]}>{labels.redo}</AppText>
        </Pressable>

        <Pressable
          onPress={onHint}
          disabled={hintsRemaining <= 0}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: hintsRemaining <= 0 ? 0.3 : pressed ? 0.6 : 1,
            },
          ]}
        >
          <View style={styles.hintIconWrapper}>
            <MaterialCommunityIcons name="lightbulb-outline" size={20} color={theme.colors.accent} />
            {hintsRemaining > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.accent }]}>
                <AppText style={styles.badgeText}>{hintsRemaining}</AppText>
              </View>
            )}
          </View>
          <AppText style={[styles.actionLabel, { color: theme.colors.accent }]}>{labels.hint}</AppText>
        </Pressable>

        <Pressable
          onPress={onAutoPencil}
          style={({ pressed }) => [
            styles.actionKey,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="auto-fix" size={20} color={theme.colors.text} />
          <AppText style={[styles.actionLabel, { color: theme.colors.muted }]}>{labels.autoPencil}</AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  key: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
  },
  actionKey: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 2,
  },
  actionLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  hintIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
});
