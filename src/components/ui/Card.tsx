import { View, ViewProps, StyleSheet } from 'react-native';

import { useAppTheme } from '../../core/providers/ThemeProvider';

export const Card = ({ style, ...props }: ViewProps) => {
  const theme = useAppTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
});
