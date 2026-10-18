import type { ReactNode } from "react";
import { Quote, Snowflake } from "lucide-react";
import type { WishDTO } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function WishCard({
  wish,
  children,
}: {
  wish: WishDTO;
  children?: ReactNode;
}) {
  return (
    <div className="frost-card relative overflow-hidden rounded-3xl p-6">
      <Quote
        size={72}
        className="absolute -right-3 -top-3 rotate-12 text-gold-400/10"
        aria-hidden
      />
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300">
          <Snowflake size={16} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">{wish.author}</p>
          <p className="text-[0.7rem] text-slate-400/60">{formatDate(wish.createdAt)}</p>
        </div>
        {children && <div className="ml-auto">{children}</div>}
      </div>
      <p className="font-display text-[1.05rem] font-medium leading-relaxed text-slate-100/95">
        {wish.text}
      </p>
    </div>
  );
}
