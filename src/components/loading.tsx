import React, { useRef } from "react";
const Loading = () => {
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
        "https://lottie.host/d5cef7de-8c5f-4082-98f2-bad961cfd4f3/doVo3DpYFQ.json"
      }
      style={{ width: "300px", height: "300px" }}
    ></lottie-player>
  );
};
export default Loading;
