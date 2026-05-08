import React, { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { smoothSpring, timingConfig } from "@/utils/animations";

interface ScaleInViewProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromScale?: number;
  useSpring?: boolean;
}

export function ScaleInView({
  children,
  delay = 0,
  duration = 300,
  fromScale = 0.8,
  useSpring = true,
  style,
  ...rest
}: ScaleInViewProps) {
  const scale = useSharedValue(fromScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { ...timingConfig, duration }),
    );
    scale.value = useSpring
      ? withDelay(delay, withSpring(1, smoothSpring))
      : withDelay(delay, withTiming(1, { ...timingConfig, duration }));
  }, [delay, duration, fromScale, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
