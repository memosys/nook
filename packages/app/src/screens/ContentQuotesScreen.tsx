import { NookPanelType } from "@nook/common/types";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types";
import { Panel } from "@/components/panels/Panels";
import { View } from "tamagui";

export const ContentQuotesScreen = () => {
  const {
    params: { contentId },
  } = useRoute<RouteProp<RootStackParamList, "ContentQuotes">>();

  return (
    <View backgroundColor="$background" height="100%">
      <Panel
        panel={{
          type: NookPanelType.PostQuotes,
          args: {
            targetContentId: contentId,
          },
        }}
      />
    </View>
  );
};
