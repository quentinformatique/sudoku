import { StyleSheet, Switch, View } from 'react-native';

import { AppText } from './AppText';
import { useAppTheme } from '../../app/providers/ThemeProvider';

export const ToggleRow = ({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) => {
  const theme = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="subtitle" style={{ fontSize: 16 }}>
          {label}
        </AppText>
        {description ? (
          <AppText style={{ color: theme.colors.muted }}>{description}</AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: theme.colors.accent, false: theme.colors.border }}
        thumbColor={value ? '#0E0E0E' : '#FFFFFF'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 8,
  },
  text: {
    flex: 1,
  },
});
