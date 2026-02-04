import { UserResponse } from "@supabase/supabase-js";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import { createThumbnail } from "../app/utils";
import AddSvg from "../icons/add";
import PlaySvg from "../icons/play";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { setVideoMuted } from "../app/redux/reducers/videoSlice";

const VideoItem: FC<{
  title: string;
  url: string;
  tag: string;
  showProgress: boolean;
  thumbnail: string;
  uid: string;
  description: string;
  PlayVideo: (x: string, free?: boolean) => void;
  user: UserResponse;
  free?: boolean;
}> = ({
  uid,
  title,
  showProgress,
  thumbnail,
  tag,
  description,
  url,
  PlayVideo,
  user,
  free = false,
}) => {
  const dispatch = useAppDispatch()
  const [Later, setLater] = useState(false);
  const session = useContext(SessionContext);
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<boolean>(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const globalVideoProps = useAppSelector((state) => state.video);
  const [muted, setMuted] = useState<boolean>(false);
  const vidRef = useRef<HTMLVideoElement|null>(null);

  useEffect(() => {
    setLater(!!(session?.user?.user_metadata[uid] === "later"));
  }, [session?.user]);

  useEffect(() => {
    if(vidRef.current){
      if(hovered) {
        vidRef.current.play()
      }else {
        vidRef.current.pause()
      }
    }
  }, [hovered, isVideoLoaded]);

  const handleHover = () => {
    setHovered(true);
    dispatch(setVideoMuted(true))
    setMuted(false)
    vidRef.current && vidRef.current.paused && vidRef.current.play()
  };

  const handleLeave = () => {
    setHovered(false);
    dispatch(setVideoMuted(false))
    setMuted(true)
    vidRef.current && !vidRef.current.paused && vidRef.current.pause()
  };

  const canPlay = () => hovered && (isVideoLoaded || (vidRef.current && !vidRef.current.paused))

  return (
    <div
      className="VideoItem"
      onClick={() => {
        PlayVideo(uid, free);
      }}
      onMouseOver={() => handleHover()}
      onMouseLeave={() => handleLeave()}
    >
      {hovered && !isVideoLoaded && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          width="24"
          height="24"
          className="VideoItem__spinner"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#ccc"
            strokeWidth="4"
            strokeDasharray="125.6"
            strokeDashoffset="0"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke"
              values="#ccc;#888;#ccc"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      )}
      {/* {hovered && isVideoLoaded ? ( */}
        {/* <video
          src={url
            .replace("upload/sp_auto/", "upload/so_0,du_30/")
            .replace(".m3u8", ".mp4")}
          ref={vidRef}
          crossOrigin="anonymous"
          muted={!(hovered)}
          autoPlay={true}
          loop={true}
          controls={false}
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          style={{ display: canPlay() ? "block" : "none" }}
        ></video> */}
      {/* ) : ( */}
        <figure
          // style={{ display: canPlay() ? "none" : "block" }}
        >
          <img src={createThumbnail(thumbnail, url)} alt="" />
        </figure>
      {/* )} */}
      <h5>{title}</h5>
      {free && <p>Free</p>}
      {showProgress && (
        <div className="VideoItem__progress">
          <span></span>
        </div>
      )}
      <div className="VideoItem__hover">
        <div>
          <Link
            to={"/watch/"}
            className="VideoItem__cta"
            onClick={(e) => {
              e.preventDefault();
              PlayVideo(uid);
            }}
          >
            <PlaySvg />
            <span>Watch Full Episode</span>
          </Link>
          <button
            className="VideoItem__add"
            onClick={async (e) => {
              const data = {};
              e.preventDefault();
              e.stopPropagation();
              if (!Later) {
                localStorage.setItem(uid, "later");
                data[uid] = "later";
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                });
                setLater(true);
              } else {
                localStorage.removeItem(uid);
                data[uid] = null;
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                });
                setLater(false);
              }
            }}
          >
            {Later ? <></> : <AddSvg />}
            <span>{Later ? "Added to Watchlist" : "Add to Watchlist"}</span>
          </button>
        </div>
        {/* <h6>{tag.replace(/,$/, "").replace(/,$/, "").replace(/,/, ", ")}</h6>
        <h4>{title}</h4>
        <p>{description}</p> */}
      </div>
    </div>
  );
};

export default VideoItem;
