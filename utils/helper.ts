import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const wp = (percentage: number) => {
  return (percentage / 100) * width;
};

export const hp = (percentage: number) => {
  return (percentage / 100) * height;
};
