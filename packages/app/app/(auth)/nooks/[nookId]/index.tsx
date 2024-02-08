import { useRef, useState } from "react";
import { Dimensions } from "react-native";
import { View, Text, XStack, YStack, AnimatePresence, useTheme } from "tamagui";
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useAppSelector } from "@hooks/useAppSelector";
import { Feed } from "@components/feed";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function NookPage() {
  const activeNook = useAppSelector((state) => state.user.activeNook);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [tabLayouts, setTabLayouts] = useState<{ width: number; x: number }[]>(
    [],
  );

  const theme = useTheme();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / SCREEN_WIDTH);
      runOnJS(setCurrentIndex)(index);
    },
  });

  const handlePress = (index: number) => {
    const x = index * SCREEN_WIDTH;
    scrollViewRef.current?.scrollTo({ x, animated: true });
    setCurrentIndex(index); // Update the current index as well
  };

  const indicatorStyle = useAnimatedStyle(() => {
    if (tabLayouts.length <= 1) {
      // Handle single item case
      return {
        transform: [{ translateX: tabLayouts[0]?.x || 0 }], // Or any default starting position
        width: tabLayouts[0]?.width || SCREEN_WIDTH, // Or the width of the single tab if different
      };
    }
    // Assuming each panel has the same width as the screen
    const translateX = interpolate(
      scrollX.value,
      tabLayouts.map((_, index) => index * SCREEN_WIDTH),
      tabLayouts.map((tab, index) => tab.x), // Assuming `tab.x` is the starting position of each tab
    );

    // Assuming the width of the indicator should match the width of the tab
    // This could be a fixed value or dynamically calculated if tabs have different widths
    const width = interpolate(
      scrollX.value,
      tabLayouts.map((_, index) => index * SCREEN_WIDTH),
      tabLayouts.map((tab) => tab.width), // Assuming `tab.width` is the width of each tab
    );

    return {
      transform: [{ translateX: translateX }],
      width: width,
    };
  });

  const activeColor = theme.$color12.val;
  const inactiveColor = theme.$gray11.val;

  const animatedTextStyles = activeNook.panels.map((_, index) =>
    useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH, // Previous tab
        index * SCREEN_WIDTH, // Current tab
        (index + 1) * SCREEN_WIDTH, // Next tab
      ];

      const color = interpolateColor(
        scrollX.value,
        inputRange,
        [inactiveColor, activeColor, inactiveColor], // Colors for transitioning: from inactive to active to inactive
      );

      return { color, fontWeight: "700" };
    }),
  );

  return (
    <View backgroundColor="$background" theme={activeNook.theme}>
      <YStack borderBottomWidth="$1" borderColor="$borderColor">
        <XStack
          paddingHorizontal="$5"
          paddingVertical="$1"
          gap="$2"
          alignItems="flex-end"
        >
          {activeNook.panels.map((panel, i) => (
            <View
              key={panel.id}
              onLayout={(event) => {
                const { width, x } = event.nativeEvent.layout;
                const newLayouts = [...tabLayouts];
                newLayouts[i] = { width, x };
                setTabLayouts(newLayouts);
              }}
              paddingHorizontal="$1"
            >
              <Animated.Text
                onPress={() => handlePress(i)}
                // fontWeight={currentIndex === i ? "700" : "500"}
                style={animatedTextStyles[i]}
              >
                {panel.name}
              </Animated.Text>
            </View>
          ))}
        </XStack>
        <Animated.View
          style={[{ height: 2, backgroundColor: "white" }, indicatorStyle]}
        />
      </YStack>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        bounces={false}
      >
        {activeNook.panels.map((panel) => (
          <View
            key={panel.id}
            style={{
              width: SCREEN_WIDTH,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View width="100%">
              <Feed filter={panel.filter} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
