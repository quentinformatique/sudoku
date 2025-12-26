import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useAppTheme } from './ThemeProvider';
import { useSettingsStore } from '../../features/settings/settingsStore';

type SnackbarOptions = {
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
};

type SnackbarContextValue = {
  show: (message: string, options?: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAppTheme();
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const [message, setMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<SnackbarOptions | undefined>();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (reduceMotion) {
      setMessage(null);
      return;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setMessage(null);
    });
  }, [opacity, reduceMotion]);

  const show = useCallback(
    (nextMessage: string, nextOptions?: SnackbarOptions) => {
      setMessage(nextMessage);
      setOptions(nextOptions);
      if (reduceMotion) {
        opacity.setValue(1);
      } else {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(hide, nextOptions?.duration ?? 2600);
    },
    [hide, opacity, reduceMotion],
  );

  const value = useMemo(() => ({ show }), [show]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {message ? (
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              opacity,
            },
          ]}
        >
          <Text style={[styles.text, { color: theme.colors.text }]}>{message}</Text>
          {options?.actionLabel ? (
            <TouchableOpacity onPress={options.onAction}>
              <Text style={[styles.action, { color: theme.colors.accent }]}>
                {options.actionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
  },
  action: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
