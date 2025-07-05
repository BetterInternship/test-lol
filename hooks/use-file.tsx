/**
 * @ Author: Mo David
 * @ Create Time: 2025-06-19 06:01:21
 * @ Modified time: 2025-07-05 23:25:23
 * @ Description:
 *
 * Properly handles dealing with files stored in GCS and their local state.
 * Synchronizes the hash for caching and shit.
 */

import { useCallback, useImperativeHandle, useRef, useState } from "react";

interface IUseFile {
  url: string;
  loading: boolean;
  sync: () => Promise<void>;
}

// Valid MimeTypes
type MimeType =
  | "text/plain"
  | "text/html"
  | "application/json"
  | "application/pdf"
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/webp"
  | "video/mp4"
  | "audio/mpeg";

/**
 * Synchronizes a gcs-stored file's state with the server's.
 *
 * @hook
 */
export const useFile = ({
  route,
  fetcher,
  defaultURL = "",
}: {
  route: string;
  fetcher: () => Promise<any>;
  defaultURL?: string;
}): IUseFile => {
  const [url, setURL] = useState(defaultURL);
  const [loading, setLoading] = useState(true);

  /**
   * Performs a sync by requesting for the hash of the file from the server.
   * It will then use this hash to request the file each time.
   *
   * @returns
   */
  const synchronize = useCallback(async () => {
    const { success, empty, hash } = await fetcher();

    // Something went wrong
    if (!success) {
      console.error("Could not fetch file.");
      setLoading(false);
      return;
    }

    // File has not been uploaded by host / source
    if (empty) {
      setLoading(false);
      return;
    }

    // Update url
    setURL(`${process.env.NEXT_PUBLIC_API_URL}${route}?hash=${hash}`);
    setLoading(false);
  }, [route]);

  return {
    url,
    loading,
    sync: synchronize,
  };
};

export interface IFileUploadRef {
  open: () => void;
  getFile: () => File | null;
}

/**
 * Handles file uploads.
 * Creates an invisible input component for the file upload.
 * Note that if allowedTypes is not provided, any file is accepted by default.
 * An empty array means nothing is accepted.
 * maxSize is the max file size in MB.
 *
 * @component
 */
export const FileUpload = ({
  allowedTypes,
  maxSize = 1,
  onSelect,
  ref,
}: {
  allowedTypes?: MimeType[];
  maxSize?: number;
  onSelect?: (file?: File | null) => void;
  ref: React.Ref<IFileUploadRef>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const accept = allowedTypes?.join(", ").slice(0, -2);

  // Expose the API of the FileUpload component
  useImperativeHandle(
    ref,
    () => ({
      open: () => fileInputRef.current?.click(),
      getFile: () => file,
    }),
    []
  );

  /**
   * When a file is selected, the state is updated.
   * Upload is handled separately in case we don't want those to execute at the same time.
   *
   * @param event
   * @returns
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check valid file types
    if (allowedTypes && !allowedTypes.includes(file.type as MimeType)) {
      alert("Please upload the correct file type.");
      return;
    }

    // Check file size
    if (file.size > Math.floor(maxSize * 1024 * 1024)) {
      alert("File size must be less than " + maxSize + "MB.");
      return;
    }

    // Call the callback after a delay to account for state change
    setFile(file);
    setTimeout(() => onSelect && onSelect(file));
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        style={{ display: "none" }}
      />
    </>
  );
};
