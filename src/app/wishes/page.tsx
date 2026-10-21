import * as WishesViewModule from "@/components/WishesView";
import { getWishes } from "@/lib/data";

export const dynamic = "force-dynamic";

const WishesView =
  (WishesViewModule as any).default ||
  (WishesViewModule as any).WishesView;

export default async function WishesPage() {
  let wishes: any[] = [];

  try {
    wishes = await getWishes();
  } catch (error) {
    console.error("Failed to load wishes:", error);
  }

  return <WishesView wishes={wishes} initialWishes={wishes} />;
}
