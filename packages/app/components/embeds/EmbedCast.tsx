import { EmbedMedia } from "./EmbedMedia";
import { CdnAvatar } from "../cdn-avatar";
import { NookText, View, XStack, YStack } from "@nook/app-ui";
import { FarcasterCastResponseText } from "../farcaster/casts/cast-text";
import { FarcasterCastV1 } from "@nook/common/types";
import { formatTimeAgo } from "../../utils";
import { FarcasterPowerBadge } from "../farcaster/users/power-badge";
import { useRouter } from "solito/navigation";

export const EmbedCast = ({
  cast,
  disableLink,
}: {
  cast: FarcasterCastV1;
  disableLink?: boolean;
}) => {
  const router = useRouter();

  // @ts-ignore
  const handlePress = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const selection = window?.getSelection?.()?.toString();
    if (!selection || selection.length === 0) {
      if (event.ctrlKey || event.metaKey) {
        // metaKey is for macOS
        window.open(`/casts/${cast.hash}`, "_blank");
      } else {
        router.push(`/casts/${cast.hash}`);
      }
    }
  };

  return (
    <View
      cursor="pointer"
      transition="all 0.2s ease-in-out"
      hoverStyle={{
        // @ts-ignore
        transition: "all 0.2s ease-in-out",
        backgroundColor: "$color2",
      }}
      onPress={handlePress}
    >
      <YStack
        borderWidth="$0.5"
        borderColor="$borderColorBg"
        borderRadius="$4"
        padding="$2.5"
        gap="$1.5"
      >
        <XStack alignItems="center">
          <View marginRight="$2">
            <CdnAvatar src={cast.user.pfp} size="$1" />
          </View>
          <XStack gap="$1.5" alignItems="center" flexShrink={1}>
            <NookText fontWeight="700" numberOfLines={1} ellipsizeMode="tail">
              {`${
                cast.user.displayName ||
                cast.user.username ||
                `!${cast.user.fid}`
              }`}
            </NookText>
            <FarcasterPowerBadge
              badge={cast.user.badges?.powerBadge ?? false}
            />
            <NookText
              muted
              numberOfLines={1}
              ellipsizeMode="middle"
              flexShrink={1}
            >
              {`${
                cast.user.username
                  ? `@${cast.user.username}`
                  : `!${cast.user.fid}`
              } · ${formatTimeAgo(cast.timestamp)}`}
            </NookText>
          </XStack>
        </XStack>
        {(cast.text || cast.mentions.length > 0) && (
          <FarcasterCastResponseText cast={cast} disableLinks />
        )}
        {cast.embeds.length > 0 && <EmbedMedia cast={cast} />}
      </YStack>
    </View>
  );
};
