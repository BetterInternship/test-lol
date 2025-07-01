import { useClientDimensions } from "@/hooks/use-dimensions";
import { useAppContext } from "@/lib/ctx-app";

export const PDFPreview = ({ url }: { url: string }) => {
  const { isMobile } = useAppContext();
  const { clientWidth, clientHeight } = useClientDimensions();

  return (
    <div className="px-6 pb-6">
      <iframe
        allowTransparency={true}
        className="w-full h-screen border border-gray-200 rounded-sm"
        style={{
          width: isMobile
            ? Math.min(clientWidth * 0.9, 600)
            : Math.min(clientWidth * 0.5, 600),
          height: clientHeight * 0.75,
          minHeight: "600px",
          maxHeight: "800px",
          background: "#FFFFFF",
        }}
        src={url + "#toolbar=0&navpanes=0&scrollbar=1"}
      >
        Resume could not be loaded.
      </iframe>
    </div>
  );
};
