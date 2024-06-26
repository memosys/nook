import { FarcasterCastQuotes } from "@nook/app/features/farcaster/cast-screen/cast-quotes";
import { fetchCastQuotes } from "@nook/app/api/farcaster/casts";

export default async function CastQuotes({
  params,
}: { params: { hash: string } }) {
  const initialData = await fetchCastQuotes(params.hash);
  return <FarcasterCastQuotes hash={params.hash} initialData={initialData} />;
}
