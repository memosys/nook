import { EmbedImage } from "./image";
import { EmbedQuotePost } from "./quote";
import {
  Content,
  ContentData,
  ContentType,
  Entity,
  PostData,
  UrlMetadata,
} from "@flink/common/types";
import { Text } from "tamagui";
import { EmbedFrame } from "./frame";
import { Linking } from "react-native";
import { EmbedUrl } from "./url";
import { EmbedTwitter } from "./twitter";
import { EmbedVideo } from "./video";

export const Embed = ({
  data,
  embed,
  entityMap,
  contentMap,
}: {
  data: PostData;
  embed: string;
  entityMap: Record<string, Entity>;
  contentMap: Record<string, Content<ContentData>>;
}) => {
  const content = contentMap[embed];
  if (content) {
    switch (content.type) {
      case ContentType.POST:
      case ContentType.REPLY: {
        const data = content.data as PostData;
        return (
          <EmbedQuotePost
            key={embed}
            data={data}
            entityMap={entityMap}
            contentMap={contentMap}
          />
        );
      }
      case ContentType.URL: {
        const metadata = content.data as UrlMetadata;
        if (
          content.contentId.includes("imgur.com") ||
          metadata.contentType?.startsWith("image/")
        ) {
          return <EmbedImage key={embed} embed={content.contentId} />;
        }

        if (
          metadata.contentType?.startsWith("video/") ||
          metadata.contentType === "application/x-mpegURL"
        ) {
          return <EmbedVideo key={embed} embed={content.contentId} />;
        }

        if (metadata.metadata?.frame) {
          return <EmbedFrame data={data} metadata={metadata} />;
        }

        if (embed.includes("twitter.com") || embed.includes("x.com")) {
          return <EmbedTwitter key={embed} metadata={metadata} />;
        }

        return <EmbedUrl key={embed} embed={embed} metadata={metadata} />;
      }
    }
  }

  return (
    <Text key={embed} onPress={() => Linking.openURL(embed)}>
      {embed}
    </Text>
  );
};