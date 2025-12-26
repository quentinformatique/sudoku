import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Pressable } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../../../components/ui/AppText';

export const Keypad = ({
  onNumber,
  onErase,
  onUndo,
  onRedo,
  labels,
}: {
  onNumber: (value: number) => void;
  onErase: () => void;
  onUndo: () => void;
  onRedo: () => void;
  labels: { erase: string; undo: string; redo: string };
}) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.numbers}>
        {Array.from({ length: 9 }, (_, index) => {
          const value = index + 1;
          return (
            <Pressable
              key={value}
              onPress={() => {
                onNumber(value);
              }}
              style={({ pressed }) => [
                styles.key,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <AppText variant="subtitle">{value}</AppText>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onErase}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="backspace-outline"
            size={20}
            color={theme.colors.text}
          />
          <AppText style={styles.actionLabel}>{labels.erase}</AppText>
        </Pressable>
        <Pressable
          onPress={onUndo}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="undo" size={20} color={theme.colors.text} />
          <AppText style={styles.actionLabel}>{labels.undo}</AppText>
        </Pressable>
        <Pressable
          onPress={onRedo}
          style={({ pressed }) => [
            styles.action,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <MaterialCommunityIcons name="redo" size={20} color={theme.colors.text} />
          <AppText style={styles.actionLabel}>{labels.redo}</AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  key: {
    width: '30%',
    aspectRatio: 1.3,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  action: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 11,
  },
});
