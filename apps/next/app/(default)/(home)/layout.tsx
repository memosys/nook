import { getServerSession } from "@nook/app/server/session";
import { ReactNode } from "react";
import { TabNavigation } from "@nook/app/features/tabs";
import { MobileNavigationHeader } from "../../../components/MobileNavigation";

export default async function Home({ children }: { children: ReactNode }) {
  const session = await getServerSession();

  const tabs = session
    ? [
        {
          id: "following",
          label: "Following",
          href: "/",
          auth: true,
        },
        {
          id: "for-you",
          label: "For you",
          href: "/for-you",
          auth: true,
        },
      ]
    : [
        {
          id: "trending",
          label: "Trending",
          href: "/",
        },
      ];

  return (
    <>
      <MobileNavigationHeader />
      <TabNavigation tabs={tabs} session={session}>
        {children}
      </TabNavigation>
    </>
  );
}
