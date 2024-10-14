import React, { useRef } from "react";
const SuccessLottie = () => {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <lottie-player
      id="firstLottie"
      ref={ref}
      autoplay="false"
      loop="false"
      mode="normal"
      src={
        "https://lottie.host/dc812367-e269-42af-b58b-5860b3a69e61/4OtpWycfFp.json"
      }
      style={{ width: "200px", height: "200px" }}
    ></lottie-player>
  );
};
export default SuccessLottie;
