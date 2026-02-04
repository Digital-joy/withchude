import React, { useRef } from "react";
import { VideoProps } from "../../app/types";
import { getVideoTitle } from "../../app/utils";
import { useDispatch } from "react-redux";
import { setVideoProps } from "../../app/redux/reducers/videoSlice";

export interface IRecommendedVideoItem
  extends React.ComponentPropsWithoutRef<"div"> {
  video: VideoProps;
}

const RecommendedVideoItem: React.FC<IRecommendedVideoItem> = ({
  video,
  className,
  ...divProps
}) => {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleShowModal = () => {
    dispatch(
      setVideoProps({
        video: video,
        muted: true,
        showPopup: true,
        paused: true,
      })
    );
  };

  return (
    <div
      className={`VideoItem__Recommended ${className}`}
      {...divProps}
      onClick={() => {
        handleShowModal();
      }}
    >
      <video
        className="w-full"
        src={video.url
          .replace("upload/sp_auto/", "upload/so_0,du_10/")
          .replace(".m3u8", ".mp4")}
        ref={videoRef}
        crossOrigin="anonymous"
        muted={true}
        autoPlay={true}
        loop={true}
        controls={false}
        //   onCanPlayThrough={() => setIsVideoLoaded(true)}
        //   style={{ display: canPlay() ? "block" : "none" }}
      ></video>
      <div className="absolute-full gradient-overlay VideoItem__Recommended__overlay">
        <p>{getVideoTitle(video)}</p>
      </div>
    </div>
  );
};

export default RecommendedVideoItem;
