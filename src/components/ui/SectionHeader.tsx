import { View, StyleSheet } from 'react-native';

import { AppText } from './AppText';
import { useAppTheme } from '../../core/providers/ThemeProvider';

export const SectionHeader = ({ title }: { title: string }) => {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <AppText variant="label" style={{ color: theme.colors.muted }}>
        {title}
      </AppText>
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 1,
  },
});
