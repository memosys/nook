import {
  FarcasterUserV1,
  FetchNftCollectionsResponse,
  FetchNftCollectorsResponse,
  FetchNftCreatedCollectionsResponse,
  FetchNftEventsResponse,
  FetchNftFarcasterCollectorsResponse,
  FetchNftsResponse,
  GetNftCollectionCollectorsRequest,
  GetNftCollectionEventsRequest,
  GetNftCollectorsRequest,
  GetNftEventsRequest,
  NftFeedFilter,
  NftMarket,
  NftMutualsPreview,
  SimpleHashCollection,
  SimpleHashNFT,
} from "@nook/common/types";
import { makeRequest } from "../utils";
import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNftStore } from "../../store/useNftStore";
import { useUserStore } from "../../store/useUserStore";
import { useState } from "react";

export const fetchNftFeed = async (
  filter: NftFeedFilter,
  cursor?: string,
): Promise<FetchNftsResponse> => {
  return await makeRequest("/v1/nfts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, cursor }),
  });
};

export const useNftFeed = (
  filter: NftFeedFilter,
  initialData?: FetchNftsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addNfts = useNftStore((state) => state.addNfts);

  const queryKey = ["nftFeed", JSON.stringify(filter)];

  const props = useInfiniteQuery<
    FetchNftsResponse,
    unknown,
    InfiniteData<FetchNftsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftFeed(filter, pageParam);
      addNfts(data.data);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
    refetchOnWindowFocus: false,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectionFeed = async (
  filter: NftFeedFilter,
  cursor?: string,
): Promise<FetchNftCollectionsResponse> => {
  return await makeRequest("/v1/nfts/collections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, cursor }),
  });
};

export const useNftCollectionFeed = (
  filter: NftFeedFilter,
  initialData?: FetchNftCollectionsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftCollectionsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addCollections = useNftStore((state) => state.addCollections);

  const queryKey = ["nftCollectionFeed", JSON.stringify(filter)];

  const props = useInfiniteQuery<
    FetchNftCollectionsResponse,
    unknown,
    InfiniteData<FetchNftCollectionsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionFeed", JSON.stringify(filter)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionFeed(filter, pageParam);
      addCollections(
        data.data.map((collection) => collection.collection_details),
      );
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
    refetchOnWindowFocus: false,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftCollectionsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCreatedFeed = async (
  filter: NftFeedFilter,
  cursor?: string,
): Promise<FetchNftsResponse> => {
  return await makeRequest("/v1/nfts/created", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, cursor }),
  });
};

export const useNftCreatedFeed = (
  filter: NftFeedFilter,
  initialData?: FetchNftsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addNfts = useNftStore((state) => state.addNfts);

  const queryKey = ["nftCreatedFeed", JSON.stringify(filter)];

  const props = useInfiniteQuery<
    FetchNftsResponse,
    unknown,
    InfiniteData<FetchNftsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCreatedFeed", JSON.stringify(filter)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCreatedFeed(filter, pageParam);
      addNfts(data.data);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
    refetchOnWindowFocus: false,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectionCreatedFeed = async (
  filter: NftFeedFilter,
  cursor?: string,
): Promise<FetchNftCreatedCollectionsResponse> => {
  return await makeRequest("/v1/nfts/collections/created", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filter, cursor }),
  });
};

export const useNftCollectionCreatedFeed = (
  filter: NftFeedFilter,
  initialData?: FetchNftCreatedCollectionsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftCreatedCollectionsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addCollections = useNftStore((state) => state.addCollections);

  const queryKey = ["nftCollectionCreatedFeed", JSON.stringify(filter)];

  const props = useInfiniteQuery<
    FetchNftCreatedCollectionsResponse,
    unknown,
    InfiniteData<FetchNftCreatedCollectionsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionCreatedFeed(filter, pageParam);
      addCollections(data.data);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
    refetchOnWindowFocus: false,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftCreatedCollectionsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNft = async (nftId: string): Promise<SimpleHashNFT> => {
  return await makeRequest(`/v1/nfts/${nftId}`);
};

export const fetchNftMarkets = async (nftId: string): Promise<NftMarket> => {
  return await makeRequest(`/v1/nfts/${nftId}/markets`);
};

export const fetchNftCollection = async (
  collectionId: string,
): Promise<SimpleHashCollection> => {
  return await makeRequest(`/v1/nfts/collections/${collectionId}`);
};

export const fetchNftMutualsPreview = async (
  nftId: string,
): Promise<NftMutualsPreview> => {
  return await makeRequest(`/v1/nfts/${nftId}/mutuals-preview`);
};

export const fetchCollectionMutualsPreview = async (
  collectionId: string,
): Promise<NftMutualsPreview> => {
  return await makeRequest(
    `/v1/nfts/collections/${collectionId}/mutuals-preview`,
  );
};

export const fetchNftCollectionCollectors = async (
  req: GetNftCollectionCollectorsRequest,
  cursor?: string,
): Promise<FetchNftCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collections/collectors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtCollectionCollectors = (
  req: GetNftCollectionCollectorsRequest,
  initialData?: FetchNftCollectorsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftCollectorsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const queryKey = ["nftCollectionCollectors", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftCollectorsResponse,
    unknown,
    InfiniteData<FetchNftCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionCollectors(req, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectionFarcasterCollectors = async (
  req: GetNftCollectionCollectorsRequest,
  cursor?: string,
): Promise<FetchNftFarcasterCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collections/collectors/farcaster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtCollectionFarcasterCollectors = (
  req: GetNftCollectionCollectorsRequest,
  initialData?: FetchNftFarcasterCollectorsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftFarcasterCollectorsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addUsers = useUserStore((state) => state.addUsers);

  const queryKey = ["nftCollectionCollectorsFarcaster", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionFarcasterCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUserV1[];
      addUsers(users);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftFarcasterCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectionFollowingCollectors = async (
  req: GetNftCollectionCollectorsRequest,
  cursor?: string,
): Promise<FetchNftFarcasterCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collections/collectors/following", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtCollectionFollowingCollectors = (
  req: GetNftCollectionCollectorsRequest,
  initialData?: FetchNftFarcasterCollectorsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftFarcasterCollectorsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addUsers = useUserStore((state) => state.addUsers);

  const queryKey = ["nftCollectionCollectorsFollowing", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionFollowingCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUserV1[];
      addUsers(users);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftFarcasterCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchCollectionNfts = async (
  collectionId: string,
  cursor?: string,
): Promise<FetchNftsResponse> => {
  return await makeRequest(
    `/v1/nfts/collections/${collectionId}/nfts${
      cursor ? `?cursor=${cursor}` : ""
    }`,
  );
};

export const useCollectionNfts = (
  collectionId: string,
  initialData?: FetchNftsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addNfts = useNftStore((state) => state.addNfts);

  const queryKey = ["nftCollectionNfts", collectionId];

  const props = useInfiniteQuery<
    FetchNftsResponse,
    unknown,
    InfiniteData<FetchNftsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchCollectionNfts(collectionId, pageParam);
      addNfts(data.data);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
    refetchOnWindowFocus: false,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectors = async (
  req: GetNftCollectorsRequest,
  cursor?: string,
): Promise<FetchNftCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collectors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtCollectors = (
  req: GetNftCollectorsRequest,
  initialData?: FetchNftCollectorsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftCollectorsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const queryKey = ["nftCollectors", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftCollectorsResponse,
    unknown,
    InfiniteData<FetchNftCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectors(req, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftFarcasterCollectors = async (
  req: GetNftCollectorsRequest,
  cursor?: string,
): Promise<FetchNftFarcasterCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collectors/farcaster", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtFarcasterCollectors = (
  req: GetNftCollectorsRequest,
  initialData?: FetchNftFarcasterCollectorsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftFarcasterCollectorsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addUsers = useUserStore((state) => state.addUsers);

  const queryKey = ["nftCollectorsFarcaster", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftFarcasterCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUserV1[];
      addUsers(users);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftFarcasterCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftFollowingCollectors = async (
  req: GetNftCollectorsRequest,
  cursor?: string,
): Promise<FetchNftFarcasterCollectorsResponse> => {
  return await makeRequest("/v1/nfts/collectors/following", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNFtFollowingCollectors = (
  req: GetNftCollectorsRequest,
  initialData?: FetchNftFarcasterCollectorsResponse,
): UseInfiniteQueryResult<
  InfiniteData<FetchNftFarcasterCollectorsResponse>,
  unknown
> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const addUsers = useUserStore((state) => state.addUsers);

  const queryKey = ["nftCollectorsFollowing", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftFollowingCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUserV1[];
      addUsers(users);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftFarcasterCollectorsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftCollectionEvents = async (
  req: GetNftCollectionEventsRequest,
  cursor?: string,
): Promise<FetchNftEventsResponse> => {
  return await makeRequest("/v1/nfts/collections/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNftCollectionEvents = (
  req: GetNftCollectionEventsRequest,
  initialData?: FetchNftEventsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftEventsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const queryKey = ["nftCollectionEvents", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftEventsResponse,
    unknown,
    InfiniteData<FetchNftEventsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionEvents(req, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftEventsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};

export const fetchNftEvents = async (
  req: GetNftEventsRequest,
  cursor?: string,
): Promise<FetchNftEventsResponse> => {
  return await makeRequest("/v1/nfts/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, cursor }),
  });
};

export const useNftEvents = (
  req: GetNftEventsRequest,
  initialData?: FetchNftEventsResponse,
): UseInfiniteQueryResult<InfiniteData<FetchNftEventsResponse>, unknown> & {
  refresh: () => Promise<void>;
} => {
  const [isRefetching, setIsRefetching] = useState(false);
  const queryClient = useQueryClient();

  const queryKey = ["nftEvents", JSON.stringify(req)];

  const props = useInfiniteQuery<
    FetchNftEventsResponse,
    unknown,
    InfiniteData<FetchNftEventsResponse>,
    string[],
    string | undefined
  >({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftEvents(req, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [undefined],
        }
      : undefined,
    initialPageParam: initialData?.nextCursor,
  });

  const refresh = async () => {
    setIsRefetching(true);
    queryClient.setQueryData<InfiniteData<FetchNftEventsResponse>>(
      queryKey,
      (data) => {
        if (!data) return undefined;
        return {
          pages: data.pages.slice(0, 1),
          pageParams: data.pageParams.slice(0, 1),
        };
      },
    );
    await props.refetch();
    setIsRefetching(false);
  };

  return { ...props, refresh, isRefetching };
};
