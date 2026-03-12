export type RootTabParamList = {
  HomeTab: undefined;
  PlayTab: undefined;
  StatsTab: undefined;
  SettingsTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type PlayStackParamList = {
  NewGame: undefined;
  Continue: undefined;
  Game: { source: 'new' | 'continue' } | undefined;
};

export type StatsStackParamList = {
  Statistics: undefined;
  History: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
  About: undefined;
  Help: undefined;
  Learning: undefined;
  Privacy: undefined;
  Terms: undefined;
  Licenses: undefined;
};
