import VidForward from "/public/images/vidForward.svg?raw";
import VidRewind from "/public/images/vidRewind.svg?raw";
import VidAdd from "/public/images/vidadd.svg?raw";
import VidComments from "/public/images/vidcomment.svg?raw";
import VidPause from "/public/images/vidpause.svg?raw";
import VidPlay from "/public/images/vidplay.svg?raw";
import VidShare from "/public/images/vidshare.svg?raw";
import VidBack from "/public/images/arrow-left.svg?raw";
import VidClose from "/public/images/vidclose.svg?raw";
import VidVol0 from "/public/images/vidvol0.svg?raw";
import VidVol1 from "/public/images/vidvol1.svg?raw";
import VidVol2 from "/public/images/vidvol2.svg?raw";
import VidVol3 from "/public/images/vidvol3.svg?raw";

import { User, UserResponse } from "@supabase/supabase-js";
import gsap from "gsap";
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-landscape-fullscreen";
import "videojs-hotkeys";
import "videojs-playbackrate-adjuster";

import { SessionContext, supabase } from "../App";
import CloseSvg from "../icons/close";
import SendAltEmoji from "../icons/send-alt";
import ShareIgSvg from "../icons/shareIg";
import ShareFbSvg from "../icons/sharefb";
import ShareTikSvg from "../icons/sharetik";
import ShareXSvg from "../icons/sharex";
import StarSvg from "../icons/star";
import Comment from "./Comment";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import AddSvg from "../icons/add";
import {
  DocumentWithFullscreen,
  exitFullScreen,
  extractTitleText,
  getRelatedVideos,
  isFullScreen,
  openTwitterWindow,
  requestFullScreen,
  toogleFullScreen,
} from "../app/utils";
import ArrowLeftIcon from "../icons/arrow-left";
import { get } from "idb-keyval";
import RecommendedVideoItem from "./video/RecommendedVideoItem";
import { VideoProps } from "../app/types";
import VideoItemWithModal from "./VideoItemWithModal";
import VideoSection from "./VideoSection";
import { useAppSelector } from "../app/redux/hooks";
import { videoService } from "../app/services/supabse";
import Player from "video.js/dist/types/player";
import { useVideoWatchTracker } from "../app/hooks/useVideoWatchTracker";
import { useVideoViewTracker } from "../app/hooks/useVideoViewTracker";

// Add the missing definitions:
interface HTMLBodyElement {
  requestFullscreen();
  webkitRequestFullscreen();
}

const Video: FC<{
  options: { autoplay: boolean; sources: string; tracks?: any[] };
  vid: any;
  onReady: any;
  related?: VideoProps[];
  user: UserResponse;
}> = ({ options, onReady, vid: VideoDetails, related = [], user }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [showDesc, setShowDesc] = useState(false);
  const [showLiked, setShowLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [Copy, setCopy] = useState(false);
  const [isNearEnd, setIsNearEnd] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const recognitionRef = useRef(null);
  const globalVideoProps = useAppSelector((state) => state.video);
  const [videoStatId, setVideoStatId] = useState<string | undefined>();

  useEffect(() => {
    if (isNearEnd) {
      handleShowRelated();
    } else {
      handleHideRelated();
    }
  }, [isNearEnd]);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      if (videoElement) {
        const remainingTime = videoElement.duration - videoElement.currentTime;
        if (remainingTime <= 5 && remainingTime > 0) {
          if (!isNearEnd) {
            setIsNearEnd(true);
          }
        } else {
          setIsNearEnd(false); // Reset when not in the last 5 seconds
        }
      }
    };

    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isNearEnd]);

  const handleShowRelated = useCallback(() => {
    return gsap.timeline().to(".Vid__overlay", {
      visibility: "visible",
      opacity: 1,
    });
  }, []);

  const handleHideRelated = useCallback(() => {
    return gsap.timeline().to(".Vid__overlay", {
      visibility: "hidden",
      opacity: 0,
    });
  }, []);

  React.useEffect(() => {
    // if (!session.user) return
    // Initialize Web Speech API
    // if ("webkitSpeechRecognition" in window) {
    //   const recognition = new webkitSpeechRecognition();
    //   recognition.lang = "en-US";
    //   recognition.continuous = true;

    //   recognition.onresult = (event) => {
    //     let transcript = "";
    //     for (let i = event.resultIndex; i < event.results.length; i++) {
    //       transcript += event.results[i][0].transcript + " ";
    //     }
    //     setSubtitles(transcript);
    //   };

    //   recognitionRef.current = recognition;
    // }

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const later = !!(
        session?.user?.user_metadata[VideoDetails?.uid] === "later"
      );
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));

      const handleTimeUpdate = () => {
        if (player) {
          const remainingTime = player.duration() - player.currentTime();
          if (remainingTime <= 5) {
            setIsNearEnd(true);
          } else {
            setIsNearEnd(false);
          }
        }
      };

      document.querySelector(
        ".vjs-volume-panel button"
      ).innerHTML = `${VidVol0} ${VidVol1} ${VidVol2} ${VidVol3} `;
      document.querySelector(".vjs-skip-backward-10").innerHTML = VidRewind;
      document.querySelector(".vjs-skip-forward-10").innerHTML = VidForward;
      document.querySelector(".vjs-big-play-button").innerHTML = VidPlay;
      document.querySelector(
        ".vjs-play-control"
      ).innerHTML = `${VidPlay} ${VidPause}`;
      console.log(player.duration() - player.currentTime());
      player.one("loadedmetadata", () => {
        var duration = player.duration();
        if (duration === Infinity || duration === 0) {
          document
            .querySelector(".vjs-play-progress .vjs-time-tooltip")
            .setAttribute("data-length", `-`);
          return;
        }
        var mzminutes = Math.floor(duration / 60);
        var mzseconds = Math.floor(duration - mzminutes * 60);
        console.log(mzminutes + ":" + mzseconds);
        document
          .querySelector(".vjs-play-progress .vjs-time-tooltip")
          .setAttribute(
            "data-length",
            "/" +
              `${mzminutes < 10 ? "0" + mzminutes : mzminutes}` +
              ":" +
              `${mzseconds < 10 ? "0" + mzseconds : mzseconds}`
          ); // console.log(`Duration of Video ${duration}`)
        if (
          document.querySelector(
            ".vjs-progress-control .vjs-play-progress .vjs-time-tooltip"
          )
        ) {
          const old = document.querySelector(".vjs-current-time");
          old.parentElement.removeChild(old);
        }
      });
      player.one("durationchange", () => {
        var duration = player.duration();
        console.log(player.duration());
        if (duration === Infinity || duration === 0) {
          document
            .querySelector(".vjs-play-progress .vjs-time-tooltip")
            .setAttribute("data-length", `-`);
          return;
        }
        var mzminutes = Math.floor(duration / 60);
        var mzseconds = Math.floor(duration - mzminutes * 60);
        document
          .querySelector(".vjs-play-progress .vjs-time-tooltip")
          .setAttribute(
            "data-length",
            "/" +
              `${mzminutes < 10 ? "0" + mzminutes : mzminutes}` +
              ":" +
              `${mzseconds < 10 ? "0" + mzseconds : mzseconds}`
          ); // console.log(`Duration of Video ${duration}`)
        // document.querySelector("video").setAttribute("playsinline", "false") // console.log(`Duration of Video ${duration}`)
        if (
          document.querySelector(
            ".vjs-progress-control .vjs-play-progress .vjs-time-tooltip"
          )
        ) {
          const old = document.querySelector(".vjs-current-time");
          old.parentElement.removeChild(old);
        }
      });
      player.on("timeupdate", handleTimeUpdate);
      player.on("ended", () => {
        setIsNearEnd(true);
      }); // Listen for the ended event

      const vidadd = document.createElement("figure");
      let liketimeout;
      vidadd.onclick = async () => {
        const data = {};
        console.log(
          Later,
          !!(session?.user?.user_metadata[VideoDetails?.uid] === "later"),
          88
        );
        if (!(session?.user?.user_metadata[VideoDetails?.uid] === "later")) {
          localStorage.setItem(VideoDetails?.uid, "later");
          data[VideoDetails?.uid] = "later";
          const { data: res, error } = await supabase.auth.updateUser({
            data,
          });
          clearTimeout(liketimeout);
          liketimeout = setTimeout(() => {
            gsap.to(".Vid__added", { opacity: 0 });
          }, 1000);
        } else {
          localStorage.removeItem(VideoDetails?.uid);
          data[VideoDetails?.uid] = null;
          const { data: res, error } = await supabase.auth.updateUser({
            data,
          });
        }
        setShowLiked(
          !(session?.user?.user_metadata[VideoDetails?.uid] === "later")
        );
        vidadd.classList.toggle("liked");
      };
      vidadd.className = later ? "Vid__add liked" : "Vid__add";
      vidadd.innerHTML = VidAdd;

      const vidback = document.createElement("figure");
      vidback.className = "Vid__back";
      vidback.onclick = () => navigate(-1);
      vidback.innerHTML = VidBack;

      const vidcomments = document.createElement("figure");
      vidcomments.className = "Vid__comments";
      vidcomments.onclick = () => setShowComments(true);
      vidcomments.innerHTML = VidComments;

      const vidshare = document.createElement("figure");
      vidshare.className = "Vid__share";
      vidshare.onclick = () => setShowShare(true);
      vidshare.innerHTML = VidShare;

      const vidclose = document.createElement("figure");
      vidclose.className = "Vid__close";
      vidclose.onclick = () => {
        if (innerWidth < 768) {
          if (fullscreen) {
            setFullscreen(false);
            exitFullScreen(document);
          } else {
            const temp = location.pathname.split("/");
            temp.pop();
            navigate(temp.join("/"));
            // navigate(-1)
          }
          // document.querySelector<HTMLButtonElement>(".vjs-fullscreen-control").click()
        } else {
          const temp = location.pathname.split("/");
          temp.pop();
          // navigate(temp.join("/"))
          navigate(-1);
        }
      };
      vidclose.innerHTML = VidClose;

      const vidtrack = document.createElement("div");
      vidtrack.className = "Vid__track";

      const vidfull = document.createElement("figure");
      vidfull.className = "Vid__full";
      vidfull.onclick = () => {
        // setFullscreen(!fullscreen)
        requestFullScreen(document.body);
        if (isFullScreen) {
          exitFullScreen(document as unknown as DocumentWithFullscreen);
        }
      };
      vidfull.innerHTML = `<button>
      <svg width="1em" height="1em" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M9.944 1.25H10a.75.75 0 0 1 0 1.5c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812c-.423.423-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.289a.75.75 0 0 1-1.5 0v-.056c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m8.345 1.64c-1.027-.138-2.382-.14-4.289-.14a.75.75 0 0 1 0-1.5h.056c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433V10a.75.75 0 0 1-1.5 0c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812M2 13.25a.75.75 0 0 1 .75.75c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14a.75.75 0 0 1 0 1.5h-.056c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V14a.75.75 0 0 1 .75-.75m20 0a.75.75 0 0 1 .75.75v.056c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H14a.75.75 0 0 1 0-1.5c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289a.75.75 0 0 1 .75-.75"
          clipRule="evenodd"
        ></path>
      </svg>
    </button>`;

      const vidtagWrapper = document.createElement("div");
      vidtagWrapper.className = "vidtagWrapper";
      vidtagWrapper.onclick = () => setShowDesc(!showDesc);
      const vidtag = document.createElement("div");
      const vidname = document.createElement("h3");
      const videp = document.createElement("h4");
      const vidicon = document.createElement("div");
      vidname.textContent = VideoDetails.title;
      videp.textContent = VideoDetails.episode;
      vidicon.innerHTML = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.72628 4.10227C9.94595 3.8826 10.3021 3.8826 10.5218 4.10227L17.1353 10.7158C18.673 12.2534 18.673 14.7465 17.1353 16.2842L10.5218 22.8978C10.3021 23.1174 9.94595 23.1174 9.72628 22.8978C9.50661 22.6781 9.50661 22.3219 9.72628 22.1023L16.3398 15.4887C17.4381 14.3904 17.4381 12.6096 16.3398 11.5113L9.72628 4.89776C9.50661 4.67809 9.50661 4.32194 9.72628 4.10227Z" fill="#AAAAAA"/>
      </svg>
      `;
      vidtag.append(videp, vidname);
      vidtagWrapper.append(vidtag, vidicon);

      document
        .querySelector(".vjs-control-bar")
        .append(
          vidadd,
          vidshare,
          vidclose,
          vidtrack,
          vidfull,
          vidcomments,
          vidtagWrapper,
          vidback
        );
      trackRef.current = vidtrack;

      const vid = document.querySelector(
        ".Vid__wrapper"
      ) as unknown as HTMLElement;
      let timeout = 0;
      vid.onmousemove = function () {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          player.userActive(false);
        }, 2000);
      };

      playerRef.current.landscapeFullscreen({
        fullscreen: {
          // enterOnRotate: true,
          // exitOnRotate: true,
          alwaysInLandscapeMode: true,
          iOS: true,
        },
      });

      async function View() {
        const { data, error } = await supabase.rpc("watch", {
          id: VideoDetails.uid,
          increment: 1,
        });

        console.log(data, error);
      }

      View();
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      if (player.src() === options.sources) return;
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // useEffect(() => {
  //   const player = playerRef.current;

  //   if (player && recognitionRef.current) {
  //     player.on("play", () => recognitionRef.current.start());
  //     player.on("pause", () => recognitionRef.current.stop());
  //     player.on("ended", () => recognitionRef.current.stop());
  //   }
  // }, []);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    const player = playerRef.current;

    if (player) {
      // Mute video if popup is shown
      if (globalVideoProps.showPopup) {
        player.muted(true);
      } else {
        player.muted(false);
      }
    }
  }, [globalVideoProps.showPopup]);

  useVideoWatchTracker(
    playerRef.current,
    () => {
      videoService
        .updateWatchTime(User.id, VideoDetails.uid, 30, videoStatId)
        .then((data) => {
          setVideoStatId(data?.uid);
        });
    },
    30
  );
  // useVideoViewTracker(playerRef.current, () => {
  //   console.log("🎉 User watched 1 minute of video!");
  //   // Call your DB/API to increment view count
  //   videoService.updateViews(User.id, VideoDetails.uid);
  // });

  const [comment, setComment] = useState("");
  const [$Comments, set$Comments] = useState([]);
  const [User, setUser] = useState<User>();
  const session = useContext(SessionContext);

  const [Later, setLater] = useState(false);

  useEffect(() => {
    setLater(!!(session?.user?.user_metadata[VideoDetails?.uid] === "later"));
  }, [session?.user, VideoDetails.uid, VideoDetails.id]);

  function deleteComment(id: string) {
    set$Comments($Comments.slice().filter((comment) => comment.uid !== id));
  }

  useEffect(() => {
    if ($Comments[0]) return;
    if (location.pathname.split("/")[3]) {
      if (!VideoDetails.id) return;
      supabase
        .from("comments")
        .select()
        .eq("course", VideoDetails.id)
        .then((data) => {
          set$Comments(data.data.slice().reverse());
        });
    }
    if (!VideoDetails.uid) return;
    supabase
      .from("comments")
      .select()
      .eq("video", VideoDetails.uid)
      .then((data) => {
        set$Comments(data.data.slice().reverse());
      });
  }, [VideoDetails.uid, VideoDetails.id]);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  const [fullscreen, setFullscreen] = useState(false);

  const getFullScreen = () => fullscreen;

  useEffect(() => {
    const SeekBar = videojs.getComponent("SeekBar") as any;

    SeekBar.prototype.getPercent = function getPercent() {
      // Allows for smooth scrubbing, when player can't keep up.
      const time = this.player_.scrubbing()
        ? this.player_.getCache().currentTime
        : this.player_.currentTime();
      // const time = this.player_.currentTime()
      const percent = time / this.player_.duration();
      return percent >= 1 ? 1 : percent;
    };

    SeekBar.prototype.handleMouseMove = function handleMouseMove(event) {
      const bounds = trackRef.current.getBoundingClientRect();
      let newTime = getFullScreen()
        ? gsap.utils.clamp(
            0,
            1,
            (event.touches[0].clientY - bounds.top) / bounds.height
          ) * this.player_.duration()
        : this.calculateDistance(event) * this.player_.duration();
      if (newTime === this.player_.duration()) {
        newTime = newTime - 0.1;
      }
      this.player_.currentTime(newTime);
      this.update();
    };
  }, [fullscreen]);

  return (
    <>
      <div
        data-vjs-player
        className={fullscreen ? "Vid__wrapper active" : "Vid__wrapper inactive"}
        translate="no"
      >
        {/* <ArrowLeftIcon className="Vid__Back__wrapper"/> */}
        <div ref={videoRef} translate="no" />
        {showDesc && (
          <div className="Vid__desc__wrapper">
            <div className="Vid__desc">
              <div onClick={() => setShowDesc(!showDesc)}>
                <article>
                  <h4>{VideoDetails.episode}</h4>
                  <h3>{VideoDetails.title}</h3>
                </article>
                <CloseSvg />
              </div>
              <h6>Description</h6>
              <p>
                {VideoDetails.description || "No description for this video"}
              </p>
            </div>
          </div>
        )}
        {showLiked && (
          <div className="Vid__added">
            <StarSvg />
            <p>Added to Watchlist.</p>
          </div>
        )}
        {showComments && (
          <div className="Vid__Comments__wrapper">
            <div className="Vid__Comments">
              <div onClick={() => setShowComments(!showComments)}>
                <article>
                  <h4>Comments</h4>
                </article>
                <CloseSvg />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  supabase
                    .from("comments")
                    .insert([
                      {
                        by: User.user_metadata.name,
                        text: comment,
                        video: VideoDetails.uid,
                        course: VideoDetails.id,
                      },
                    ])
                    .select()
                    .then((data) => {
                      set$Comments([...data.data, ...$Comments]);
                      setComment("");
                    });
                }}
              >
                <textarea
                  placeholder="Start typing to add a comment..."
                  name="comment"
                  id="comment"
                  value={comment}
                  onInput={(e) => setComment(e.currentTarget.value)}
                ></textarea>
                {/* <EmojiIcon /> */}
                {comment[0] && (
                  <button>
                    <span>Post</span>
                    <SendAltEmoji />
                    {/* <EmojiPicker /> */}
                  </button>
                )}
              </form>
              {$Comments.map(({ by, created_at, text, uid }) => (
                <Comment
                  key={uid}
                  name={by}
                  time={created_at}
                  comment={text}
                  id={uid}
                  deleteComment={deleteComment}
                />
              ))}
            </div>
          </div>
        )}
        {showShare && (
          <div className="Vid__Share__wrapper">
            <div className="Vid__Share">
              <h4>Share this</h4>
              <figure onClick={() => setShowShare(false)}>
                <CloseSvg />
              </figure>
              <div>
                {/* <i
                  onClick={(e) => {
                    e.preventDefault()
                    const text = extractTitleText("h3")
                    const link = window.location.href
                    openTwitterWindow(text, link)
                  }}
                >
                  <ShareIgSvg />
                </i> */}
                <i
                  onClick={(e) => {
                    e.preventDefault();
                    const text = extractTitleText("h3");
                    const link = window.location.href;
                    openTwitterWindow(text, link);
                  }}
                >
                  <ShareXSvg />
                </i>
                <i
                  onClick={(e) => {
                    e.preventDefault();
                    const text = extractTitleText("h3");
                    const link = window.location.href;
                    window
                      .open(
                        `https://www.facebook.com/sharer/sharer.php?u=${text} ${link}`,
                        "_blank"
                      )
                      .focus();
                  }}
                >
                  <ShareFbSvg />
                </i>
                <i
                  onClick={(e) => {
                    e.preventDefault();
                    const text = extractTitleText("h3");
                    const link = window.location.href;
                    window
                      .open(`https://wa.me/?text=${text} ${link}`, "_blank")
                      .focus();
                  }}
                >
                  <ShareTikSvg />
                </i>
              </div>
              <p>
                {window.location.href}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigator.clipboard.writeText(window.location.href);
                    setCopy(true);
                  }}
                >
                  {Copy ? (
                    <svg
                      className="svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <circle cx={12} cy={12} r={10}></circle>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.5 12.5l2 2l5-5"
                        ></path>
                      </g>
                    </svg>
                  ) : (
                    "Copy"
                  )}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="Vid__mobile">
        <div className="Vid__mobile__header">
          <button
            onClick={() => {
              // document.querySelector<HTMLButtonElement>(".vjs-fullscreen-control").click()
              setFullscreen(true);
              requestFullScreen(document.body);
            }}
          >
            <svg width="1em" height="1em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M9.944 1.25H10a.75.75 0 0 1 0 1.5c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812c-.423.423-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.289a.75.75 0 0 1-1.5 0v-.056c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m8.345 1.64c-1.027-.138-2.382-.14-4.289-.14a.75.75 0 0 1 0-1.5h.056c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433V10a.75.75 0 0 1-1.5 0c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812M2 13.25a.75.75 0 0 1 .75.75c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14a.75.75 0 0 1 0 1.5h-.056c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V14a.75.75 0 0 1 .75-.75m20 0a.75.75 0 0 1 .75.75v.056c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H14a.75.75 0 0 1 0-1.5c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289a.75.75 0 0 1 .75-.75"
                clipRule="evenodd"
              ></path>
            </svg>
            Enter Full Screen
          </button>
          <button
            className="VideoItem__add"
            onClick={async () => {
              const data = {};
              if (!Later) {
                localStorage.setItem(VideoDetails?.uid, "later");
                data[VideoDetails?.uid] = "later";
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                });
                setLater(true);
              } else {
                localStorage.removeItem(VideoDetails?.uid);
                data[VideoDetails?.uid] = null;
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
        <p className="Video__mobile__tag">{VideoDetails.tag}</p>
        <h3 className="Video__mobile__title">{VideoDetails.title}</h3>
        <p className="Video__mobile__description">
          {VideoDetails.description || "No description for this video"}
        </p>
        <div className="Vid__Comments__wrapper">
          <div className="Vid__Comments">
            <div onClick={() => setShowComments(!showComments)}>
              <article>
                <h4>Comments</h4>
              </article>
              <CloseSvg />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                supabase
                  .from("comments")
                  .insert([
                    {
                      by: User.user_metadata.name,
                      text: comment,
                      video: VideoDetails.uid,
                      course: VideoDetails.id,
                    },
                  ])
                  .select()
                  .then((data) => {
                    set$Comments([...data.data, ...$Comments]);
                    setComment("");
                  });
              }}
            >
              <textarea
                placeholder="Start typing to add a comment..."
                name="comment"
                id="comment"
                value={comment}
                onInput={(e) => setComment(e.currentTarget.value)}
              ></textarea>
              {/* <EmojiIcon /> */}
              {comment[0] && (
                <button>
                  <span>Post</span>
                  <SendAltEmoji />
                  {/* <EmojiPicker /> */}
                </button>
              )}
            </form>
            {$Comments.map(({ by, created_at, text, uid }) => (
              <Comment
                key={uid}
                name={by}
                time={created_at}
                comment={text}
                id={uid}
                deleteComment={deleteComment}
              />
            ))}
          </div>
        </div>
        <VideoSection
          title="Related"
          items={related}
          showProgress={false}
          showMore={false}
          user={user}
          style={{
            marginTop: "4rem",
            // marginBottom: "6rem",
          }}
        />
      </div>
      <div className="Vid__overlay .Vid__related translate-center">
        {related.slice(0, 9).map((relatedVideo, i) => (
          <RecommendedVideoItem
            key={relatedVideo.uid}
            className=""
            video={relatedVideo}
          />
        ))}
      </div>
    </>
  );
};

export default Video;
