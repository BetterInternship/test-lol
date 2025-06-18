/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-18 23:23:56
 * @ Modified time: 2025-06-18 23:33:59
 * @ Description:
 *
 * Gives you access to client dimensions in pixels.
 */

import { useLayoutEffect, useState } from "react";

/**
 * Client dimensions in pixels.
 *
 * @hook
 */
export const useClientDimensions = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handle_resize = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    setWidth(clientWidth);
    setHeight(clientHeight);
  };

  useLayoutEffect(() => {
    // Add a resize listener
    window.addEventListener("resize", handle_resize);

    // Do the computation as well
    handle_resize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handle_resize);
    };
  }, []);

  return {
    client_width: width,
    client_height: height,
  };
};
