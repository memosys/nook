import {
  FarcasterUser,
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
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useNftStore } from "../../store/useNftStore";
import { useUserStore } from "../../store/useUserStore";

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
) => {
  const addNfts = useNftStore((state) => state.addNfts);
  return useInfiniteQuery<
    FetchNftsResponse,
    unknown,
    InfiniteData<FetchNftsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftFeed", JSON.stringify(filter)],
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
) => {
  const addCollections = useNftStore((state) => state.addCollections);
  return useInfiniteQuery<
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
) => {
  const addNfts = useNftStore((state) => state.addNfts);
  return useInfiniteQuery<
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
) => {
  const addCollections = useNftStore((state) => state.addCollections);
  return useInfiniteQuery<
    FetchNftCreatedCollectionsResponse,
    unknown,
    InfiniteData<FetchNftCreatedCollectionsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCreatedFeed", JSON.stringify(filter)],
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
) => {
  return useInfiniteQuery<
    FetchNftCollectorsResponse,
    unknown,
    InfiniteData<FetchNftCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCollectors", JSON.stringify(req)],
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
) => {
  const addUsers = useUserStore((state) => state.addUsers);
  return useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCollectorsFarcaster", JSON.stringify(req)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionFarcasterCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUser[];
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
) => {
  const addUsers = useUserStore((state) => state.addUsers);
  return useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCollectorsFollowing", JSON.stringify(req)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftCollectionFollowingCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUser[];
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
) => {
  const addNfts = useNftStore((state) => state.addNfts);
  return useInfiniteQuery<
    FetchNftsResponse,
    unknown,
    InfiniteData<FetchNftsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionNfts", collectionId],
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
) => {
  return useInfiniteQuery<
    FetchNftCollectorsResponse,
    unknown,
    InfiniteData<FetchNftCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectors", JSON.stringify(req)],
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
) => {
  const addUsers = useUserStore((state) => state.addUsers);
  return useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectorsFarcaster", JSON.stringify(req)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftFarcasterCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUser[];
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
) => {
  const addUsers = useUserStore((state) => state.addUsers);
  return useInfiniteQuery<
    FetchNftFarcasterCollectorsResponse,
    unknown,
    InfiniteData<FetchNftFarcasterCollectorsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectorsFollowing", JSON.stringify(req)],
    queryFn: async ({ pageParam }) => {
      const data = await fetchNftFollowingCollectors(req, pageParam);
      const users = data.data
        .filter((collector) => collector.user)
        .map((collector) => collector.user) as FarcasterUser[];
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
) => {
  return useInfiniteQuery<
    FetchNftEventsResponse,
    unknown,
    InfiniteData<FetchNftEventsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCollectors", JSON.stringify(req)],
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
) => {
  return useInfiniteQuery<
    FetchNftEventsResponse,
    unknown,
    InfiniteData<FetchNftEventsResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["nftCollectionCollectors", JSON.stringify(req)],
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
};
