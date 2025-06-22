export type ImageOutputMap = {
  file: File;
  base64: string;
  blob: Blob;
  buffer: Buffer;
};

export interface ImageSize {
  width: number;
  height: number;
}

export interface FileDimension extends Blob {
  dimensions?: ImageSize;
}