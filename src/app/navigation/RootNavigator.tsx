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
  const { t } = useTranslation();
  const theme = useAppTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t('tabs.home') }}
      />
    </HomeStack.Navigator>
  );
};

const PlayStackNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  return (
    <PlayStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        headerShadowVisible: false,
      }}
    >
      <PlayStack.Screen
        name="NewGame"
        component={NewGameScreen}
        options={{ title: t('play.newGame') }}
      />
      <PlayStack.Screen
        name="Continue"
        component={ContinueScreen}
        options={{ title: t('play.continue') }}
      />
      <PlayStack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: t('game.title') }}
      />
    </PlayStack.Navigator>
  );
};

const StatsStackNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  return (
    <StatsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        headerShadowVisible: false,
      }}
    >
      <StatsStack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: t('stats.title') }}
      />
      <StatsStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: t('history.title') }}
      />
    </StatsStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  const { t } = useTranslation();
  const theme = useAppTheme();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        headerShadowVisible: false,
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: t('settings.title') }}
      />
      <SettingsStack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: t('about.title') }}
      />
      <SettingsStack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: t('help.title') }}
      />
      <SettingsStack.Screen
        name="Learning"
        component={LearningScreen}
        options={{ title: t('learning.title') }}
      />
      <SettingsStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: t('privacy.title') }}
      />
      <SettingsStack.Screen
        name="Terms"
        component={TermsScreen}
        options={{ title: t('terms.title') }}
      />
      <SettingsStack.Screen
        name="Licenses"
        component={LicensesScreen}
        options={{ title: t('licenses.title') }}
      />
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
