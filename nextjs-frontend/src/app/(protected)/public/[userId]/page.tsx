import { redirect } from "next/navigation";

export default function PublicChannelRootPage({
  params,
}: {
  params: { userId: string };
}) {
  redirect(`/public/${params.userId}/videos`);
}
