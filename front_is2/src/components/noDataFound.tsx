import React, { useRef } from "react";

const NoDataFoundLottie = () => {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <lottie-player
      id="firstLottie"
      ref={ref}
      autoplay
      loop
      mode="normal"
      src={
        "https://lottie.host/0ead4371-b7a6-4beb-8ce3-355fd94ca9c7/aFnMFi5H46.json"
      }
      style={{ width: "300px", height: "300px" }}
    ></lottie-player>
  );
};

export default NoDataFoundLottie;
