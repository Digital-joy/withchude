import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import $Header from "../app/classes/header-alt";
import PlaySvg from "../icons/play";
import { supabase } from "../App";
import { get } from "idb-keyval";
import {
  MAX_PINNED_VIDEOS,
  createSnippet,
  createThumbnail,
} from "../app/utils";
import { useAppDispatch, useAppSelector } from "../app/redux/hooks";
import { VideoProps } from "../app/types";
import { setVideoProps } from "../app/redux/reducers/videoSlice";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import ChevronRightIcon from "../icons/ChevronRightIcon";

export default function HeroAlt() {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null); // Reference to the scrollable element
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [filtered, setFiltered] = useState([
    {
      uid: "",
      snippet: "",
      episode: "",
      title: "",
      thumbnail: "",
      url: "",
      description: "",
      tag: "",
    },
  ]);
  const [muted, setMuted] = useState(true);
  const [saveMute, setSaveMute] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const globallyMuted = useAppSelector((state) => state.video.muted);
  const [showArrowLeft, setShowArrowLeft] = useState<boolean>(false);
  const [showArrowRight, setShowArrowRight] = useState<boolean>(true);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return; // Only move if dragging
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; // Distance moved
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (globallyMuted) setMuted(true);
    else setMuted(saveMute ? true : false);
  }, [globallyMuted]);

  useEffect(() => {
    get("homeSnippets").then((data) => {
      setFiltered(data ?? []);
      const x = document.querySelectorAll(
        ".Hero video"
      ) as unknown as HTMLVideoElement[];
      x.forEach((vid) => vid.play());
      gsap.delayedCall(2, () => {
        window.$header = new $Header(data);
        // setMuted(false)
        // setSaveMute(false)
      });
    });
  }, []);

  function useTicker(callback, paused = false) {
    useLayoutEffect(() => {
      if (!paused && callback) {
        gsap.ticker.add(callback);
      }
      return () => {
        gsap.ticker.remove(callback);
      };
    }, [callback, paused]);
  }

  const EMPTY = {};
  function useInstance(value = {}) {
    const ref = useRef(EMPTY);
    if (ref.current === EMPTY) {
      ref.current = typeof value === "function" ? value() : value;
    }
    return ref.current;
  }

  // Function for Mouse Move Scale Change
  function getScale(diffX, diffY) {
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    return Math.min(distance / 800, 0.25);
  }

  // Function For Mouse Movement Angle in Degrees
  function getAngle(diffX, diffY) {
    return (Math.atan2(diffY, diffX) * 180) / Math.PI;
  }

  const jellyRef = useRef(null);
  const textRef = useRef(null);
  const textRef2 = useRef(null);
  // Save pos and velocity Objects
  const pos: any = useInstance(() => ({ x: 0, y: 0 }));
  const vel: any = useInstance(() => ({ x: 0, y: 0 }));
  const set: any = useInstance();

  useLayoutEffect(() => {
    set.x = gsap.quickSetter(jellyRef.current, "x", "px");
    set.y = gsap.quickSetter(jellyRef.current, "y", "px");
    set.r = gsap.quickSetter(jellyRef.current, "rotate", "deg");
    set.sx = gsap.quickSetter(jellyRef.current, "scaleX");
    set.sy = gsap.quickSetter(jellyRef.current, "scaleY");
    set.rt = gsap.quickSetter(textRef.current, "rotate", "deg");
  }, []);

  // Start Animation loop
  const loop = useCallback(() => {
    // Calculate angle and scale based on velocity
    var rotation = getAngle(vel.x, vel.y);
    var scale = getScale(vel.x, vel.y);

    set.x(pos.x);
    set.y(pos.y);
    if (innerWidth >= 768) set.r(rotation);
    set.sx(1 + scale);
    set.sy(1 - scale);
    if (innerWidth >= 768) set.rt(-rotation);
  }, []);

  // Run on Mouse Move
  useLayoutEffect(() => {
    // Caluclate Everything Function
    const setFromEvent = (e) => {
      // Mouse X and Y
      const x = e.clientX;
      const y = e.clientY;
      const mx = e.movementX;
      const my = e.movementY;
      const speed = 0.35;

      // Animate Pos Object and calculate Vel Object Velocity
      gsap.to(pos, {
        x: x,
        y: y,
        duration: 0.35,
        onUpdate: () => {
          vel.x = x - pos.x;
          vel.y = y - pos.y;
        },
      });

      loop();
    };

    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  const handleShowVideoModal = (video: VideoProps) => {
    dispatch(
      setVideoProps({
        video: video,
        muted: true,
        showPopup: true,
        paused: true,
      })
    );
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft: currentScrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (currentScrollLeft > 0) {
        setShowArrowLeft(true);
      } else {
        setShowArrowLeft(false);
      }

      if (currentScrollLeft < maxScrollLeft) {
        setShowArrowRight(true);
      } else {
        setShowArrowRight(false);
      }
    }
  };

  const handleArrowShow = useCallback((className: string) => {
    gsap.timeline().to(className, {
      opacity: 1,
    });
  }, []);

  const handleArrowHide = useCallback((className: string) => {
    gsap.timeline().to(className, {
      opacity: 0,
    });
  }, []);

  const handleArrowClick = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      if (direction === "left" && showArrowLeft) {
        gsap.to(".Hero__medias", {
          scrollLeft: scrollRef.current.scrollLeft - 210.66,
          duration: 1,
        });
      } else if (direction === "right" && showArrowRight) {
        gsap.to(".Hero__medias", {
          scrollLeft: scrollRef.current.scrollLeft + 210.66,
          duration: 1,
        });
      }
    }
  }, [showArrowLeft, showArrowRight]);

  useEffect(() => {
    if (showArrowLeft) {
      handleArrowShow(".Hero__medias__arrow.left");
    } else {
      handleArrowHide(".Hero__medias__arrow.left");
    }
  }, [showArrowLeft]);

  useEffect(() => {
    if (showArrowRight) {
      handleArrowShow(".Hero__medias__arrow.right");
    } else {
      handleArrowHide(".Hero__medias__arrow.right");
    }
  }, [showArrowRight]);

  useTicker(loop);

  return (
    <>
      <section className="Hero">
        {/* {filtered.map((vid) => ( */}
        <div className="Hero__media__active">
          <video
            playsInline
            src={
              filtered && createSnippet(filtered[0].snippet, filtered[0].url)
            }
            crossOrigin="anonymous"
            muted={muted}
            // muted={muted}
            autoPlay={true}
            loop={true}
            controls={false}
            onLoadStart={(e) => e.currentTarget.play()}
            onLoadedMetadata={(e) => e.currentTarget.play()}
            onLoad={(e) => e.currentTarget.play()}
          ></video>
          <div className="Hero__noise">
            <video
              playsInline
              src="/videos/noise.mp4"
              muted={true}
              loop
            ></video>
          </div>
        </div>
        {/* ))} */}
        <div
          className="container-div"
          onMouseEnter={() => {
            gsap.fromTo(
              ".container-div",
              { opacity: 0 },
              { opacity: 1, delay: loaded ? 0 : 0.2 }
            );
            setLoaded(true);
            setMuted(saveMute);
          }}
          onClick={() => {
            if (innerWidth < 768) setMuted(!muted);
          }}
          onMouseLeave={() => {
            gsap.fromTo(".container-div", { opacity: 1 }, { opacity: 0 });
            setSaveMute(muted);
            setMuted(true);
          }}
        >
          <div
            ref={jellyRef}
            id={"jelly-id"}
            className="jelly-blob"
            onClick={() => {
              setMuted(!muted);
              const x = document.querySelectorAll(
                ".Hero video"
              ) as unknown as HTMLVideoElement[];
              x.forEach((vid) => vid.play());
            }}
          >
            <div
              ref={textRef}
              id={"text-id"}
              className="inside-text"
              data-desktop=""
            >
              {muted ? "Unmute" : "Mute"}
            </div>
            <div
              ref={textRef2}
              id={"text-id2"}
              className="inside-text"
              data-mobile=""
            >
              {muted ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M0.7675 5.48556C0.804 4.88156 0.8225 4.57906 0.9795 4.28856C1.13893 4.00747 1.37939 3.78095 1.6695 3.63857C1.97 3.50007 2.3135 3.50007 3 3.50007C3.256 3.50007 3.384 3.50007 3.508 3.47907C3.63064 3.4583 3.75023 3.42235 3.864 3.37207C3.979 3.32157 4.086 3.25106 4.2995 3.11006L4.4095 3.03807C5.68 2.19957 6.316 1.78007 6.85 1.96257C6.9525 1.99757 7.0515 2.04756 7.14 2.11006C7.601 2.43406 7.6365 3.18857 7.7065 4.69707C7.7293 5.13108 7.7438 5.56549 7.75 6.00007C7.75 6.26607 7.7325 6.74407 7.7065 7.30257C7.6365 8.81157 7.6015 9.56557 7.14 9.89007C7.05076 9.95265 6.95313 10.0023 6.85 10.0376C6.3165 10.2196 5.6805 9.80057 4.409 8.96207L4.3 8.89007C4.0865 8.74907 3.98 8.67856 3.8645 8.62756C3.75071 8.57745 3.63112 8.54167 3.5085 8.52107C3.384 8.50007 3.256 8.50007 3 8.50007C2.313 8.50007 1.97 8.50007 1.67 8.36157C1.37971 8.21926 1.13907 7.99274 0.9795 7.71157C0.8225 7.42057 0.8045 7.11857 0.7675 6.51407C0.756522 6.34295 0.750686 6.17154 0.75 6.00007C0.75 5.83857 0.7565 5.66456 0.7675 5.48556Z"
                    stroke="white"
                    strokeWidth="0.75"
                  />
                  <path
                    opacity="0.5"
                    d="M11 5L9 7M9 5L11 7"
                    stroke="white"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M0.7675 5.48556C0.804 4.88156 0.8225 4.57906 0.9795 4.28856C1.13893 4.00747 1.37939 3.78095 1.6695 3.63857C1.97 3.50007 2.3135 3.50007 3 3.50007C3.256 3.50007 3.384 3.50007 3.508 3.47907C3.63064 3.4583 3.75023 3.42235 3.864 3.37207C3.979 3.32157 4.086 3.25106 4.2995 3.11006L4.4095 3.03807C5.68 2.19957 6.316 1.78007 6.85 1.96257C6.9525 1.99757 7.0515 2.04756 7.14 2.11006C7.601 2.43406 7.6365 3.18857 7.7065 4.69707C7.7293 5.13108 7.7438 5.56549 7.75 6.00007C7.75 6.26607 7.7325 6.74407 7.7065 7.30257C7.6365 8.81157 7.6015 9.56557 7.14 9.89007C7.05076 9.95265 6.95313 10.0023 6.85 10.0376C6.3165 10.2196 5.6805 9.80057 4.409 8.96207L4.3 8.89007C4.0865 8.74907 3.98 8.67856 3.8645 8.62756C3.75071 8.57745 3.63112 8.54167 3.5085 8.52107C3.384 8.50007 3.256 8.50007 3 8.50007C2.313 8.50007 1.97 8.50007 1.67 8.36157C1.37971 8.21926 1.13907 7.99274 0.9795 7.71157C0.8225 7.42057 0.8045 7.11857 0.7675 6.51407C0.756522 6.34295 0.750686 6.17154 0.75 6.00007C0.75 5.83857 0.7565 5.66456 0.7675 5.48556Z"
                    stroke="white"
                    strokeWidth="0.75"
                  />
                  <path
                    opacity="0.5"
                    d="M10.107 3.77344C10.7103 4.30568 11.0834 5.04098 11.0834 5.85318C11.0834 6.66535 10.7103 7.40065 10.107 7.93288M9.04639 4.70921C9.37815 5.00195 9.58335 5.40635 9.58335 5.85306C9.58335 6.29976 9.37815 6.70418 9.04639 6.99691"
                    stroke="white"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        {filtered.map((vid) => (
          <div className="Hero__media__active2" key={vid.uid}>
            <h2>
              <span style={{ textTransform: "uppercase" }}>{vid.episode}</span>
              {vid.episode !== "" && vid.title !== "" && ":"} {vid.title}
            </h2>
            <Link
              // to={"/watch/" + vid.uid}
              to="#"
              onClick={() => {
                handleShowVideoModal(vid as VideoProps);
              }}
            >
              <PlaySvg />
              <span>Watch Full Episode</span>
            </Link>
          </div>
        ))}
        <div
          className="Hero__medias"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
        >
          {filtered.map((vid, index) => (
            <figure
              className="Hero__media"
              key={vid.uid}
              onClick={() => {
                window.$header.videosTl.progress(
                  (1 / MAX_PINNED_VIDEOS) * index
                );

                const x = document.querySelectorAll(
                  ".Hero video"
                ) as unknown as HTMLVideoElement[];
                x.forEach((vid) => vid.play());
              }}
            >
              <img src={createThumbnail(vid.thumbnail, vid.url)} alt="" />
            </figure>
          ))}
          <div className="Hero__medias__arrows">
            <div className="Hero__medias__arrows_wrapper">
              <ChevronLeftIcon
                className="Hero__medias__arrow left"
                onClick={() => {
                  handleArrowClick("left");
                }}
              />
              <ChevronRightIcon
                className="Hero__medias__arrow right"
                onClick={() => {
                  handleArrowClick("right");
                }}
              />
            </div>
          </div>
          <div className="Hero__playhead"></div>
          <aside onClick={() => setMuted(!muted)}></aside>
        </div>
      </section>
    </>
  );
}
