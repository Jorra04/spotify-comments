import { TrackInfo } from "@/components";
import styles from "./styles.module.css";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: trackId } = await params;

  return (
    <div className={styles.trackContainer}>
      <TrackInfo trackId={trackId} />
    </div>
  );
}
