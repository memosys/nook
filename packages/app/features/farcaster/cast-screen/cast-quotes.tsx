"use client";

import { useCastQuotes } from "../../../api/farcaster/casts";
import { Loading } from "../../../components/loading";
import { FarcasterInfiniteFeed } from "../cast-feed/infinite-feed";

export const FarcasterCastQuotes = ({ hash }: { hash: string }) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useCastQuotes(hash);

  if (isLoading) {
    return <Loading />;
  }

  const casts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FarcasterInfiniteFeed
      queryKey={["cast-quotes", hash]}
      casts={casts}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
    />
  );
};
