import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../app/providers/ThemeProvider';

export const Screen = ({
  children,
  scroll,
}: {
  children: ReactNode;
  scroll?: boolean;
}) => {
  const theme = useAppTheme();
  const content = scroll ? (
    <ScrollView contentContainerStyle={styles.scroll}>{children}</ScrollView>
  ) : (
    <View style={styles.body}>{children}</View>
  );

  const gradientColors =
    theme.mode === 'dark'
      ? (['#101010', '#0B0B0B', '#141414'] as const)
      : (['#F4F4F2', '#FFFFFF', '#EFEFED'] as const);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        {content}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  body: {
    flex: 1,
    padding: 20,
  },
});
