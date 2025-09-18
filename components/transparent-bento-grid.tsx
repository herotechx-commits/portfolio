import { cn } from "@/lib/utils";
import { BentoGridProps } from "@/types";

export const TransparentBentoGrid: React.FC<BentoGridProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "grid auto-rows-[18rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
