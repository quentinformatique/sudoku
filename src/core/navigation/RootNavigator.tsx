import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import {
  HomeStackParamList,
  PlayStackParamList,
  RootTabParamList,
  SettingsStackParamList,
  StatsStackParamList,
} from './types';
import { ContinueScreen } from '../../features/game/screens/ContinueScreen';
import { GameScreen } from '../../features/game/screens/GameScreen';
import { NewGameScreen } from '../../features/game/screens/NewGameScreen';
import { HistoryScreen } from '../../features/history/screens/HistoryScreen';
import { HomeScreen } from '../../features/home/HomeScreen';
import { AboutScreen } from '../../features/settings/screens/AboutScreen';
import { HelpScreen } from '../../features/settings/screens/HelpScreen';
import { LearningScreen } from '../../features/settings/screens/LearningScreen';
import { LicensesScreen } from '../../features/settings/screens/LicensesScreen';
import { PrivacyScreen } from '../../features/settings/screens/PrivacyScreen';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { TermsScreen } from '../../features/settings/screens/TermsScreen';
import { StatisticsScreen } from '../../features/stats/screens/StatisticsScreen';
import { useAppTheme } from '../providers/ThemeProvider';
import { toNavigationTheme } from '../theme/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const PlayStack = createNativeStackNavigator<PlayStackParamList>();
const StatsStack = createNativeStackNavigator<StatsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
  );
};

const PlayStackNavigator = () => {
  return (
    <PlayStack.Navigator screenOptions={{ headerShown: false }}>
      <PlayStack.Screen name="NewGame" component={NewGameScreen} />
      <PlayStack.Screen name="Continue" component={ContinueScreen} />
      <PlayStack.Screen name="Game" component={GameScreen} />
    </PlayStack.Navigator>
  );
};

const StatsStackNavigator = () => {
  return (
    <StatsStack.Navigator screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="Statistics" component={StatisticsScreen} />
      <StatsStack.Screen name="History" component={HistoryScreen} />
    </StatsStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="About" component={AboutScreen} />
      <SettingsStack.Screen name="Help" component={HelpScreen} />
      <SettingsStack.Screen name="Learning" component={LearningScreen} />
      <SettingsStack.Screen name="Privacy" component={PrivacyScreen} />
      <SettingsStack.Screen name="Terms" component={TermsScreen} />
      <SettingsStack.Screen name="Licenses" component={LicensesScreen} />
    </SettingsStack.Navigator>
  );
};

export const RootNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <NavigationContainer theme={toNavigationTheme(theme)}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            height: 64,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarLabelStyle: { fontFamily: theme.typography.fontFamily.medium },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-variant" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="PlayTab"
          component={PlayStackNavigator}
          options={{
            title: t('tabs.play'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="grid" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="StatsTab"
          component={StatsStackNavigator}
          options={{
            title: t('tabs.stats'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="chart-bar" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStackNavigator}
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
