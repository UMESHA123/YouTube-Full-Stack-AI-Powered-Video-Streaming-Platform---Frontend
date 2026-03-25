
import { redirect } from "next/navigation";

export default function ChannelRootPage({
  params,
}: {
  params: { userId: string };
}) {
  redirect(`/channel/${params.userId}/videos`);
}
