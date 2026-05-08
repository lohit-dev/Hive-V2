import React, { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { iosSpring, iosTimingConfig } from "@/utils/animations";

interface SlideInViewProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  fromDirection?: "left" | "right" | "top" | "bottom";
  distance?: number;
  useSpring?: boolean;
}

export function SlideInView({
  children,
  delay = 0,
  duration = 350,
  fromDirection = "right",
  distance = 300,
  useSpring = true,
  style,
  ...rest
}: SlideInViewProps) {
  const translateX = useSharedValue(
    fromDirection === "left"
      ? -distance
      : fromDirection === "right"
        ? distance
        : 0,
  );
  const translateY = useSharedValue(
    fromDirection === "top"
      ? -distance
      : fromDirection === "bottom"
        ? distance
        : 0,
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { ...iosTimingConfig, duration }),
    );

    if (fromDirection === "left" || fromDirection === "right") {
      translateX.value = useSpring
        ? withDelay(delay, withSpring(0, iosSpring))
        : withDelay(delay, withTiming(0, { ...iosTimingConfig, duration }));
    } else {
      translateY.value = useSpring
        ? withDelay(delay, withSpring(0, iosSpring))
        : withDelay(delay, withTiming(0, { ...iosTimingConfig, duration }));
    }
  }, [delay, duration, fromDirection, distance, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  );
}
