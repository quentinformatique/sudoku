import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { useAppTheme } from '../../app/providers/ThemeProvider';

export const ListItem = ({
  title,
  subtitle,
  onPress,
  icon,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  icon?: string;
}) => {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: theme.colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={styles.left}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon as any}
            size={20}
            color={theme.colors.muted}
          />
        ) : null}
        <View>
          <AppText variant="subtitle" style={{ fontSize: 16 }}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText style={{ color: theme.colors.muted }}>{subtitle}</AppText>
          ) : null}
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
