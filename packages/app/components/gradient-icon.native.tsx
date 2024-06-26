import { darkenColor, stringToColor } from "../utils";
import { LinearGradient } from "@tamagui/linear-gradient";
import { ReactNode } from "react";
import { SvgUri } from "react-native-svg";

export const GradientIcon = ({
  icon,
  label,
  size,
  iconSize,
  noBorderRadius,
  borderRadius,
  children,
}: {
  icon?: string;
  children?: ReactNode;
  label: string;
  size?: string;
  iconSize?: number;
  noBorderRadius?: boolean;
  borderRadius?: string;
}) => {
  const color = stringToColor(label);
  const backgroundColor = darkenColor(color);

  return (
    <LinearGradient
      width={size || "$5"}
      height={size || "$5"}
      // @ts-ignore
      borderRadius={borderRadius || (noBorderRadius ? "$0" : "$4")}
      colors={[backgroundColor, color]}
      start={[1, 1]}
      end={[0, 0]}
      justifyContent="center"
      alignItems="center"
      padding={icon ? "$2.5" : "$1"}
    >
      {icon ? (
        <SvgUri
          uri={`https://raw.githubusercontent.com/primer/octicons/main/icons/${icon}-24.svg`}
          width="100%"
          height="100%"
          fill="white"
        />
      ) : (
        children
      )}
    </LinearGradient>
  );
};
