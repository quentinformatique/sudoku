import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../../core/providers/ThemeProvider';
import { AppText } from '../ui/AppText';

export const Screen = ({
  children,
  scroll,
  title,
  subtitle,
  showBack,
}: {
  children: ReactNode;
  scroll?: boolean;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
}) => {
  const theme = useAppTheme();
  const navigation = useNavigation();

  const header = title ? (
    <View style={styles.header}>
      {showBack && (
        <Pressable 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.colors.text} />
        </Pressable>
      )}
      <View style={styles.headerText}>
        <AppText variant="title" style={styles.title}>{title}</AppText>
        {subtitle && (
          <AppText style={{ color: theme.colors.muted, marginTop: 2 }}>{subtitle}</AppText>
        )}
      </View>
    </View>
  ) : null;

  const content = scroll ? (
    <ScrollView 
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {header}
      {children}
      <View style={{ height: 100 }} />
    </ScrollView>
  ) : (
    <View style={styles.body}>
      {header}
      <View style={{ flex: 1 }}>{children}</View>
      <View style={{ height: 80 }} />
    </View>
  );

  const gradientColors =
    theme.mode === 'dark'
      ? (['#0E0E0E', '#080808'] as const)
      : (['#F8F8F6', '#F4F4F2'] as const);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={gradientColors} style={styles.gradient}>
        <View style={styles.centeringContainer}>
          <View style={styles.appContainer}>{content}</View>
        </View>
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
  centeringContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 4,
  },
  backButton: {
    marginLeft: -8,
    marginRight: 4,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 28,
  },
  scroll: {
    padding: 20,
    flexGrow: 1,
  },
  body: {
    flex: 1,
    padding: 20,
  },
});
