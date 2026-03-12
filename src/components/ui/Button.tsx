import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { useAppTheme } from '../../core/providers/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost';

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) => {
  const theme = useAppTheme();
  const background =
    variant === 'primary'
      ? theme.colors.accent
      : variant === 'secondary'
        ? theme.colors.card
        : 'transparent';
  const color = variant === 'primary' ? '#0E0E0E' : theme.colors.text;
  const borderColor = variant === 'ghost' ? 'transparent' : theme.colors.border;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: background,
          borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <AppText variant="label" style={{ color }}>
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
