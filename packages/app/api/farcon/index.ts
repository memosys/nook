import { FetchUsersResponse } from "../../types";
import { makeRequest } from "../utils";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const fetchFarconAttendees = async (
  following?: boolean,
  cursor?: string,
) => {
  return await makeRequest("/farcon/attendees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      following,
      cursor,
    }),
  });
};

export const useFarconAttendees = (
  following?: boolean,
  initialData?: FetchUsersResponse,
) => {
  const queryClient = useQueryClient();
  return useInfiniteQuery<
    FetchUsersResponse,
    unknown,
    InfiniteData<FetchUsersResponse>,
    string[],
    string | undefined
  >({
    queryKey: ["farcon-attendees", (following || false).toString()],
    queryFn: async ({ pageParam }) => {
      const data = await fetchFarconAttendees(following, pageParam);
      for (const user of data.data) {
        queryClient.setQueryData(["user", user.username], user);
      }
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
