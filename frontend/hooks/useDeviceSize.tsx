import * as React from "react";

export const useDeviceSize = () => {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  function handleDeviceSize() {
    if (window) {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  }

  React.useEffect(() => {
    handleDeviceSize();
    window.addEventListener("resize", handleDeviceSize);
    return () => window.removeEventListener("resize", handleDeviceSize);
  }, []);

  return { width, height };
};
