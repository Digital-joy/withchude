import { motion, usePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import Video from "../../components/Video";
import videojs from "video.js";
import "videojs-landscape-fullscreen";
import "videojs-hotkeys";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext, supabase } from "../../App";
import Popup from "../../components/Popup";
import { Helmet } from "react-helmet-async";

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

  const handlePlayerReady = (player: any) => {
    player.addClass("Vid");
    player.play();
    console.log(player);
    playerRef.current = player;
  };

  const [vid, setVid] = useState<any>({});
  const params = useParams();
  const session = useContext(SessionContext);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = session?.user;

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
          session?.user?.user_metadata[params.class]?.includes("rent")
        ) {
          supabase
            .from("modules")
            .select()
            .eq("id", params?.id)
            .then((data) => {
              setVid(data.data[0]);
            });
        } else {
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
    // setVid()
  }, [params.id, session?.user?.email]);
  console.log(vid.metadata?.url);

  return (
    <>
      <Helmet>
        <title>{`WithChude - Masterclass | ${vid.title}`}</title>
      </Helmet>
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
                <div className="__video" id="video">
                  {vid.url && (
                    <Video
                      options={{
                        ...videoJsOptions,
                        // sources: vid.url.replace(".m3u8", ".m3u8?_s=vp-2.0.4"),
                        sources: vid.url
                          .replace("upload/sp_auto/", "upload/")
                          .replace(".m3u8", ".mp4"),
                      }}
                      onReady={handlePlayerReady}
                      vid={vid}
                      user={session.user as any}
                    />
                  )}
                </div>
              </main>
              {/* <Footer /> */}
            </div>
            {!session?.user && (
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
