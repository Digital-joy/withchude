import { motion, usePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import Video from "../../components/Video";
import videojs from "video.js";
import "videojs-landscape-fullscreen";
import "videojs-hotkeys";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext, supabase } from "../../App";
import Popup from "../../components/Popup";
import { get } from "idb-keyval";
import { getRelatedVideos, isValidUUID } from "../../app/utils";
import { VideoProps } from "../../app/types";

export default function () {
  const playerRef = useRef(null);

  const videoJsOptions = {
    plugins: {
      hotkeys: {
        volumeStep: 0.1,
        seekStep: 5,
        enableModifiersForNumbers: false,
      },
    },
    autoplay: true,
    controls: true,
    playbackRates: [0.5, 1, 1.5, 2],
    textTrackSettings: false,
    // liveui: false,
    // liveTracker: {
    //   trackingThreshold: 0,
    // },
    controlBar: {
      // liveDisplay: false,
      // seekToLive: false,
      remainingTimeDisplay: { displayNegative: false, DurationDisplay: true },
      skipButtons: {
        forward: 10,
        backward: 10,
      },
      inactivityTimeout: 100,
      volumePanel: {
        inline: false,
      },
    },
    userActions: {
      click: false,
      doubleClick: false,
    },
    disablePictureInPicture: true,
    enableSmoothSeeking: true,
    experimentalSvgIcons: true,
    playsinline: true,
    preferFullWindow: true,
    responsive: true,
    fluid: true,
    sources:
      "https://res.cloudinary.com/dllm7gfit/video/upload/sp_auto/v1716958975/withchude/dkylmmyzkraocodyrwrp.m3u8",
  };

  const [related, setRelated] = useState<Array<VideoProps>>([]);

  const handlePlayerReady = (player: any) => {
    player.addClass("Vid");
    player.play();
    playerRef.current = player;
  };

  const [vid, setVid] = useState<any>({});
  const params = useParams();
  const session = useContext(SessionContext);
  const [showLogin, setShowLogin] = useState(false);
  const [goToPayment, setGoToPayment] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (vid && vid.title) {
      get("videos").then((data) => {
        setRelated(getRelatedVideos(vid, data, 9));
      });
    }
  }, [vid]);

  useEffect(() => {
    if (isFree) {
      setShowLogin(false);
    } else if (session && !session.user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [session, isFree]);

  useEffect(() => {
    const user = session?.user;

    supabase
      .from("videos")
      .select("free")
      .is("deleted_at", null)
      .eq(isValidUUID(params?.id) ? "uid" : "slug", params?.id)
      .then((data) => {
        const free = data.data[0].free;
        if (free) {
          setIsFree(true);
          supabase
            .from("videos")
            .select()
            .is("deleted_at", null)
            .eq(isValidUUID(params?.id) ? "uid" : "slug", params?.id)
            .then((data) => {
              setVid(data.data[0]);
            });
        } else {
          setIsFree(false);
          if (!user) {
            setShowLogin(true);
          } else {
            const response = fetch(
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
            ).then(async (res) => {
              if (
                res.ok ||
                session?.user?.user_metadata[params.id]?.includes("rent")
              ) {
                supabase
                  .from("videos")
                  .select()
                  .is("deleted_at", null)
                  .eq(isValidUUID(params?.id) ? "uid" : "slug", params?.id)
                  .then((data) => {
                    setVid(data.data[0]);
                    supabase
                      .from("users")
                      .select("watchlist")
                      .eq("id", session?.user?.id)
                      .then((data2) => {
                        let res = data2.data[0].watchlist || [];
                        if (res?.includes(data.data[0].uid)) {
                          res = res?.filter((x) => x !== data.data[0].uid);
                        }
                        res = [...res, data.data[0].uid];
                        supabase
                          .from("users")
                          .update({ watchlist: res })
                          .eq("id", session?.user?.id)
                          .select("watchlist")
                          .then((data) => {
                            // console.log(data);
                          });
                      });
                  });
              } else {
                setGoToPayment(true);
                navigate("/payment");
              }
              const resp = await res.json();
              const { data, error } = await supabase.auth.updateUser({
                data: { subscriptionStatus: resp.status },
              });
            });

            // const { data, error } = await supabase.rpc("listen", {
            //   id: podcast.uid,
            //   increment: 1,
            // })
          }
        }
        // setVid()
      });
  }, [params.id, session?.user?.email]);

  return (
    <>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="video">
              {/* <Header /> */}
              <main>
                <div className="__video relative" id="video">
                  {vid.url && (
                    <Video
                      options={{
                        ...videoJsOptions,
                        // sources: vid.url.replace(".m3u8", ".m3u8?_s=vp-2.0.4"),
                        sources: vid.url
                          .replace("upload/sp_auto/", "upload/")
                          .replace(".m3u8", ".mp4"),
                          tracks: vid.subtitle
                            ? [
                                {
                                  kind: "subtitles",
                                  src: vid.subtitle,
                                  srclang: "en",
                                  label: "English",
                                  default: true,
                                },
                              ]
                            : [],
                      }}
                      onReady={handlePlayerReady}
                      vid={vid}
                      related={related}
                      user={session.user as any}
                    />
                  )}
                </div>
              </main>
              {/* <Footer /> */}
            </div>
            {showLogin && !goToPayment && (
              <Popup
                Close={() => {
                  // setShowLogin(false)
                  navigate(-1);
                }}
              />
            )}
          </div>
        </div>
      </motion.main>
    </>
  );
}
