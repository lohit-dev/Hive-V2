import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  SharedValue,
  withRepeat,
} from "react-native-reanimated";

export const springConfig = {
  damping: 20,
  stiffness: 90,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

export const smoothSpring = {
  damping: 25,
  stiffness: 120,
  mass: 0.8,
};

export const bouncySpring = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const iosSpring = {
  damping: 30,
  stiffness: 300,
  mass: 0.5,
};

export const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const fastTiming = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

export const slowTiming = {
  duration: 400,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1),
};

export const iosTimingConfig = {
  duration: 350,
  easing: Easing.bezier(0.42, 0, 0.58, 1),
};

export const pressAnimation = (scale: SharedValue<number>) => {
  "worklet";
  scale.value = withSequence(
    withTiming(0.95, { duration: 100, easing: Easing.out(Easing.cubic) }),
    withSpring(1, springConfig),
  );
};

export const bounceAnimation = (scale: SharedValue<number>) => {
  "worklet";
  scale.value = withSequence(
    withTiming(1.1, { duration: 150, easing: Easing.out(Easing.cubic) }),
    withSpring(1, bouncySpring),
  );
};

export const scaleIn = () => {
  "worklet";
  return withSpring(1, smoothSpring);
};

export const scaleOut = () => {
  "worklet";
  return withTiming(0, timingConfig);
};

export const fadeIn = (delay = 0) => {
  "worklet";
  return withDelay(delay, withTiming(1, timingConfig));
};

export const fadeOut = () => {
  "worklet";
  return withTiming(0, fastTiming);
};

export const slideInFromRight = (delay = 0) => {
  "worklet";
  return withDelay(delay, withSpring(0, iosSpring));
};

export const slideInFromBottom = (delay = 0) => {
  "worklet";
  return withDelay(delay, withSpring(0, smoothSpring));
};

export const slideOutToRight = () => {
  "worklet";
  return withTiming(300, iosTimingConfig);
};

export const slideOutToBottom = () => {
  "worklet";
  return withTiming(300, timingConfig);
};

export const staggerDelay = (index: number, baseDelay = 50) => {
  "worklet";
  return index * baseDelay;
};

export const wiggleAnimation = (rotate: SharedValue<number>) => {
  "worklet";
  rotate.value = withSequence(
    withTiming(-5, { duration: 100 }),
    withRepeat(
      withSequence(
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
      ),
      2,
      true,
    ),
    withTiming(0, { duration: 100 }),
  );
};

export const pulseAnimation = (scale: SharedValue<number>) => {
  "worklet";
  scale.value = withRepeat(
    withSequence(
      withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
    ),
    -1,
    true,
  );
};

export const shakeAnimation = (translateX: SharedValue<number>) => {
  "worklet";
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withRepeat(
      withSequence(
        withTiming(10, { duration: 100 }),
        withTiming(-10, { duration: 100 }),
      ),
      2,
      true,
    ),
    withTiming(0, { duration: 50 }),
  );
};

export const heartbeatAnimation = (scale: SharedValue<number>) => {
  "worklet";
  scale.value = withSequence(
    withTiming(1.2, { duration: 150 }),
    withTiming(1, { duration: 150 }),
    withTiming(1.2, { duration: 150 }),
    withTiming(1, { duration: 150 }),
  );
};

export const iosFadeTransition = {
  animation: "timing" as const,
  config: iosTimingConfig,
};

export const iosSlideTransition = {
  animation: "spring" as const,
  config: iosSpring,
};
