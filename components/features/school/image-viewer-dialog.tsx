"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/features/school/ui/dialog";
import { Button } from "@/components/features/school/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/features/school/ui/scroll-area";

interface ImageViewerDialogProps {
  images: Array<{ src: string; alt: string; error?: string | null }>;
  triggerButton?: React.ReactNode; // Optional custom trigger
  triggerLabel?: string; // Label for default button trigger
  dialogTitle?: string;
}

const ImageViewerDialog: React.FC<ImageViewerDialogProps> = ({
  images,
  triggerButton,
  triggerLabel = "View Images",
  dialogTitle = "Image Viewer",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) {
    return <span className="text-sm text-muted-foreground">No images.</span>;
  }

  const currentImage = images[currentImageIndex];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const handleOpen = () => {
    setCurrentImageIndex(0);
    setZoomLevel(1);
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={handleOpen}>
        {triggerButton || (
          <Button variant="outline" size="sm">
            {triggerLabel} ({images.filter((img) => !img.error).length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] w-full max-w-3xl flex-col p-0">
        <DialogHeader className="border-b p-4">
          <DialogTitle>
            {dialogTitle} -{" "}
            {currentImage?.alt || `Image ${currentImageIndex + 1}`}
          </DialogTitle>
        </DialogHeader>
        <div className="relative flex-grow overflow-hidden bg-muted/20 p-2">
          {currentImage?.error ? (
            <div className="flex h-full w-full items-center justify-center text-destructive">
              Error loading image: {currentImage.error}
            </div>
          ) : currentImage?.src ? (
            <ScrollArea className="h-full w-full">
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.2s ease-out",
                }}
              >
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200} // Provide base large dimensions
                  height={800}
                  className="max-h-full max-w-full object-contain"
                  priority
                />
              </div>
            </ScrollArea>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Image not available.
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t p-4">
          <div className="flex gap-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-12 w-12 overflow-hidden rounded border-2 ${index === currentImageIndex ? "border-primary" : "border-transparent"}`}
                disabled={!!img.error}
              >
                {img.error ? (
                  <div className="flex h-full w-full items-center justify-center bg-destructive/20 text-xs text-destructive">
                    Err
                  </div>
                ) : img.src ? (
                  <Image
                    src={img.src}
                    alt={`Thumb ${img.alt}`}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/20 text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5 || !!currentImage?.error}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3 || !!currentImage?.error}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetZoom}
              disabled={zoomLevel === 1 || !!currentImage?.error}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewerDialog;
