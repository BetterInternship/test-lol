import React from 'react';

interface ResponsiveIframeProps {
  src: string;
  title: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  className?: string;
  allowTransparency?: boolean;
  children?: React.ReactNode;
}

export const ResponsiveIframe: React.FC<ResponsiveIframeProps> = ({
  src,
  title,
  width,
  height,
  aspectRatio = "16/9",
  className = "",
  allowTransparency = true,
  children
}) => {
  const iframeStyle = width && height ? { width, height } : {};
  
  return (
    <div className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className}`}>
      {width && height ? (
        <iframe
          src={src}
          title={title}
          allowTransparency={allowTransparency}
          className="w-full border-0 rounded-lg"
          style={iframeStyle}
        >
          {children || `${title} could not be loaded.`}
        </iframe>
      ) : (
        <div className="relative w-full" style={{ aspectRatio }}>
          <iframe
            src={src}
            title={title}
            allowTransparency={allowTransparency}
            className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          >
            {children || `${title} could not be loaded.`}
          </iframe>
        </div>
      )}
    </div>
  );
};

export default ResponsiveIframe;
