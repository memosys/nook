import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import { Text, View } from "tamagui";

export const EntityFollowersScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "EntityFollowers">>();

  return (
    <View backgroundColor="$background" height="100%">
      <Text>Followers</Text>
    </View>
  );
};
