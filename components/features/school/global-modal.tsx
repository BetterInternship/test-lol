"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/features/school/ui/dialog";
import { useModalContext } from "@/components/features/school/providers/global-modal-provider";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/features/school/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/features/school/ui/drawer";

export default function GlobalModal() {
  const {
    modalOpen,
    setModalOpen,
    title,
    component,
    description,
    containerClassName,
    shouldScroll,
    scrollClassName,
    isDismissible,
    isResponsive,
    headerComponent,
  } = useModalContext();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    if (!isDismissible) {
      event.preventDefault();
    }
  };

  const handlePointerDownOutside = (event: { preventDefault: () => void }) => {
    if (!isDismissible) {
      event.preventDefault();
    }
  };

  if (isResponsive && !isDesktop) {
    return (
      <Drawer
        open={modalOpen}
        onOpenChange={setModalOpen}
        dismissible={isDismissible}
      >
        <DrawerContent className={cn("p-4 sm:p-6")}>
          <DrawerHeader>
            {headerComponent ? (
              <>
                <DrawerTitle className="hidden" />
                {headerComponent}
              </>
            ) : (
              <>
                <DrawerTitle
                  className={cn(
                    title ? "text-[0.75rem] sm:text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] font-semibold" : "hidden"
                  )}
                >
                  {title}
                </DrawerTitle>
                <DrawerDescription
                  className={cn(
                    description
                      ? "mt-1 text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] lg:text-[1.25rem] text-muted-foreground"
                      : "hidden"
                  )}
                >
                  {description}
                </DrawerDescription>
              </>
            )}
          </DrawerHeader>
          {shouldScroll ? (
            <ScrollArea
              className={cn(
                "h-[45vh] sm:h-[60vh] md:h-[70vh]",
                scrollClassName,
              )}
            >
              {component}
            </ScrollArea>
          ) : (
            component
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent
        className={cn("p-4 sm:p-6", containerClassName)}
        onEscapeKeyDown={handleEscapeKeyDown}
        onPointerDownOutside={handlePointerDownOutside}
      >
        <DialogHeader
          className={cn(
            title || description || headerComponent ? "" : "hidden"
          )}
        >
          {headerComponent ?? (
            <>
              <DialogTitle
                className={cn(
                  title ? "text-[0.75rem] sm:text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] font-semibold" : "hidden"
                )}
              >
                {title}
              </DialogTitle>
              <DialogDescription
                className={cn(
                  description
                    ? "mt-1 text-[0.5rem] sm:text-[0.75rem] md:text-[1rem] lg:text-[1.25] text-muted-foreground"
                    : "hidden"
                )}
              >
                {description}
              </DialogDescription>
            </>
          )}
        </DialogHeader>
        {shouldScroll ? (
          <ScrollArea className={cn("h-[45vh] sm:h-[60vh] md:h-[70vh]", scrollClassName)}>
            {component}
          </ScrollArea>
        ) : (
          component
        )}
      </DialogContent>
    </Dialog>
  );
}
