import { useContext, useEffect, useRef, useState } from "react";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import RightSvg from "../../icons/right";
import { useAppDispatch, useAppSelector } from "../../app/redux/hooks";
import { PrismicRichText, useSinglePrismicDocument } from "@prismicio/react";
import { PrismicDocument } from "@prismicio/client";
import {
  setVideoMuted,
  setVideoPopupShown,
} from "../../app/redux/reducers/videoSlice";
import { Link, useNavigate } from "react-router-dom";
import PlaySvg from "../../icons/play";
import { SessionContext, supabase } from "../../App";
import { setLoginShown } from "../../app/redux/reducers/loginSlice";
import { setToastProps } from "../../app/redux/reducers/toastSlice";
import { showToaster, showToasterPromise } from "../Toast";
import { createThumbnail } from "../../app/utils";

export interface IVideoPopup extends IPopupWrapper {
  actionText?: string;
  PlayVideo?: (x: string, free?: boolean) => void;
}

/**
 *
 * @param PlayVideo deprecated
 * @returns
 */
const VideoPopupOld: React.FC<IVideoPopup> = ({
  actionText = "Proceed",
  onClose,
  PlayVideo = (x: string, free: boolean) => {},
  className,
  children,
  ...popupProps
}) => {
  const dispatch = useAppDispatch();
  const videoProps = useAppSelector((state) => state.video);
  const [muted, setMuted] = useState<boolean>(false);
  const session = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setVideoMuted(true));
    setMuted(true);
  }, []);

  const handleClose = () => {
    dispatch(setVideoPopupShown(false));
    onClose();
  };

  const handlePopupDisable = () => {
    // disableVideoPopup();
    // setVisible(false);
  };

  const handlePlayVideo = async (id: string, free?: boolean) => {
    const user = session?.user;

    if (free) return navigate("/watch/" + id);
    if (!user) {
      !free && dispatch(setLoginShown(true));
    } else {
      const response = await fetch(
        session.isLocal
          ? `${process.env.SERVER_URL}/retrieve/paystack`
          : `${process.env.SERVER_URL}/retrieve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.user_metadata?.subscriptionId || "",
            email: user?.email,
          }),
        }
      )
        .then(async (res) => {
          if (res.ok) {
            navigate("/watch/" + id);
          } else {
            navigate("/payment");
          }
          const resp = await res.json();
          const { data, error } = await supabase.auth.updateUser({
            data: { subscriptionStatus: resp.status },
          });
        })
        .catch((e) => {
          const { showAction, delayedHideAction } = showToasterPromise({
            message: "Some error occured.",
            show: true,
            persist: false,
            timeout: 500,
          });

          // Dispatch the "show" action
          dispatch(showAction);

          // Handle the delayed hide action
          delayedHideAction().then((hideAction) => {
            if (hideAction) {
              dispatch(hideAction); // Dispatch the "hide" action after timeout
            }
          });
        });

      // const { data, error } = await supabase.rpc("listen", {
      //   id: podcast.uid,
      //   increment: 1,
      // })
    }
  };

  if (!videoProps.video || !videoProps.showPopup || !document) return null;

  const { video } = videoProps;
  const title =
    video?.episode +
    " " +
    (video?.episode[0] && video?.title[0] ? ":" : "") +
    " " +
    video?.title;

  return videoProps.showPopup ? (
    <PopupWrapper
      onClose={handleClose}
      className={`Popup Video_Popup ${className}`}
      {...popupProps}
    >
      <div className="video__container">
        <div className="video__overlay"></div>
        {/* <video
          src={video.url
            .replace("upload/sp_auto/", "upload/so_0,du_30/")
            .replace(".m3u8", ".mp4")}
          // ref={vidRef}
          crossOrigin="anonymous"
          // muted={!hovered}
          autoPlay={true}
          loop={true}
          controls={false}
          // onCanPlayThrough={() => setIsVideoLoaded(true)}
          // style={{ display: canPlay() ? "block" : "none" }}
        ></video> */}
        <figure
        // style={{ display: canPlay() ? "none" : "block" }}
        >
          <img src={createThumbnail(video.thumbnail, video.url)} alt="" />
        </figure>
        <div className="video__container__cta">
          <h2 className="video__title">{title}</h2>
          <Link
            to={"/watch/"}
            onClick={(e) => {
              e.preventDefault();
              handlePlayVideo(video.slug ?? video.uid, video.free).then(() => {
                handleClose();
              });
            }}
          >
            <PlaySvg />
            <span>Watch Full Episode</span>
          </Link>
        </div>
      </div>
      <section className="Video_Popup__wrapper">
        {/* <div className="Video_Popup__heading">
        </div> */}

        <div className="Video_Popup__content video__description">
          {video.description?.length ? video.description : "No description"}
        </div>
      </section>
    </PopupWrapper>
  ) : (
    <></>
  );
};

export default VideoPopupOld;
