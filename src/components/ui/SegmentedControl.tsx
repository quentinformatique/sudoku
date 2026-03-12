import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { useAppTheme } from '../../core/providers/ThemeProvider';

type Option<T extends string> = {
  label: string;
  value: T;
};

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) => {
  const theme = useAppTheme();
  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => {
              onChange(option.value);
            }}
            style={[
              styles.option,
              {
                backgroundColor: isActive ? theme.colors.accent : 'transparent',
              },
            ]}
          >
            <AppText
              variant="label"
              style={{ color: isActive ? '#0E0E0E' : theme.colors.text }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
