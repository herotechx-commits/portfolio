import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoGridItemProps } from "@/types";

export const ExpandableBentoGridItem: React.FC<BentoGridItemProps> = ({
  className,
  title,
  description,
  header,
  icon,
  content,
  index,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Use the hook only when containerRef.current is not null
  useOutsideClick(containerRef as React.RefObject<HTMLDivElement>, handleClose);

  // Filter out conflicting animation event handlers
  const {
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onTransitionEnd,
    ...filteredProps
  } = props;

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              ref={containerRef}
              layoutId={`card-${title}`}
              className="relative z-[60] mx-auto my-4 md:my-10 h-fit max-w-5xl rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 font-sans md:p-10"
            >
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-white" />
              </button>
              <motion.p
                layoutId={`title-${title}`}
                className="mt-4 text-2xl md:text-5xl font-semibold uppercase text-white"
              >
                {title}
              </motion.p>
              <div className="py-4 md:py-10 text-white/70">
                {content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <motion.div
        layoutId={`card-${title}`}
        onClick={handleOpen}
        className={cn(
          "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input p-4 justify-between flex flex-col space-y-4 cursor-pointer",
          "bg-white/10 backdrop-blur-md border border-white/20",
          "hover:bg-white/20",
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...filteredProps}
      >
        {header}
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          {icon}
          <motion.div 
            layoutId={`title-${title}`}
            className="font-sans font-bold uppercase text-neutral-200 mb-2 mt-2 text-sm md:text-base"
          >
            {title}
          </motion.div>
          <div className="font-sans capitalize font-extralight text-neutral-600 text-xs dark:text-neutral-300">
            {description}
          </div>
        </div>
      </motion.div>
    </>
  );
};
