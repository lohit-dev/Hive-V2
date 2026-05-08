import React, { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { timingConfig, smoothSpring } from "@/utils/animations";

interface FadeInViewProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromY?: number;
  useSpring?: boolean;
}

export function FadeInView({
  children,
  delay = 0,
  duration = 300,
  fromY = 0,
  useSpring = false,
  style,
  ...rest
}: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(fromY);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { ...timingConfig, duration }),
    );
    if (fromY !== 0) {
      translateY.value = useSpring
        ? withDelay(delay, withSpring(0, smoothSpring))
        : withDelay(delay, withTiming(0, { ...timingConfig, duration }));
    }
  }, [delay, duration, fromY, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
