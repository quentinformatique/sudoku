import { Text, TextProps, StyleSheet } from 'react-native';

import { useAppTheme } from '../../core/providers/ThemeProvider';

type Variant = 'body' | 'title' | 'subtitle' | 'label' | 'mono';

type Props = TextProps & {
  variant?: Variant;
  color?: string;
};

export const AppText = ({ variant = 'body', color, style, ...props }: Props) => {
  const theme = useAppTheme();
  return (
    <Text
      {...props}
      style={[styles.base, styles[variant], { color: color ?? theme.colors.text }, style]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  body: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'SpaceGrotesk-SemiBold',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  label: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'SpaceGrotesk-Medium',
  },
  mono: {
    fontFamily: 'SpaceGrotesk-Medium',
  },
});
