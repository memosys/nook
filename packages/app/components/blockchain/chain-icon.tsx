import { View } from "@nook/app-ui";
import { CHAINS } from "../../utils/chains";

export const ChainIcon = ({ chainId }: { chainId: string }) => {
  const chain = CHAINS[chainId];

  return (
    <View
      width={16}
      height={16}
      borderRadius="$10"
      overflow="hidden"
      display="inline-flex"
      backgroundColor="$color5"
    >
      {chain && (
        <img
          src={chain.image}
          style={{ width: "100%", height: "100%" }}
          alt={chain.name}
        />
      )}
    </View>
  );
};
