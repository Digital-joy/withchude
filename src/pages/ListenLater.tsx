import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import Audio from "../components/Audio";
import Footer, { FooterLite } from "../components/Footer";
import Header from "../components/Header";
import { NavLite } from "../components/Nav";
import PodcastsHero from "../components/PodcastsHero";
import PodcastsSection from "../components/PodcastsSection";
import Popup from "../components/Popup";
import PostPage from "../components/PostPage";
import { Searcher } from "../components/Searcher";
import PodcastsLiked from "../components/PodcastsLiked";
import { Helmet } from "react-helmet-async";

export default function ListenLater() {
  const playerRef = useRef(null);
  const [active, setActive] = useState<any>(0);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    liveui: false,
    controlBar: {
      liveDisplay: false,
      seekToLive: false,
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
      "https://res.cloudinary.com/dllm7gfit/video/upload/v1716911211/utomp3.com_-_After_my_very_public_divorce_I_cried_out_to_God_desperately_for_a_new_wife_for_12_years_bctrqh.mp3",
  };

  const handlePlayerReady = (player: any) => {
    player.addClass("Vid");
    player.play();
    playerRef.current = player;
  };

  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [Search, setSearch] = useState("");

  const [$vid, set$vid] = useState();
  const session = useContext(SessionContext);

  const PlayPodcast = async (podcast: any) => {
    setActive(null);
    const user = await session?.user;

    if (!user) {
      set$vid(podcast);
      setShowLogin(true);
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
      ).then(async (res) => {
        if (res.ok) {
          setActive(podcast);
          const { data, error } = await supabase.rpc("listen", {
            id: podcast.uid,
            increment: 1,
          });
        } else {
          location.href =
            "https://podcasts.apple.com/podcast/withchude/id1503042267";
        }
        const resp = await res.json();
        const { data, error } = await supabase.auth.updateUser({
          data: { subscriptionStatus: resp.status },
        });
      });
    }
  };

  const Next = () => {
    PlayPodcast($vid);
  };

  async function CheckUser() {}

  useEffect(() => {
    if (!isPresent) {
      setActive(0);
      playerRef.current = null;
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true });
          safeToRemove();
        },
      });
      //      .to(".PostPage", { scaleY: 1, duration: 1, ease: "expo" }, 0)
    }
  }, [isPresent]);

  return (
    <>
      <Helmet>
        <title>Listen Later | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="podcasts">
              <Header />
              <main>
                <div className="__podcasts" id="podcasts">
                  <NavLite page="ListenLater" />
                  <PodcastsLiked
                    title={""}
                    Search={Search}
                    PlayPodcast={PlayPodcast}
                    active={active}
                  />
                  {active ? (
                    <Audio
                      options={{ ...videoJsOptions, sources: active?.url }}
                      podcast={active}
                      onReady={handlePlayerReady}
                    />
                  ) : active === 0 ? (
                    <></>
                  ) : (
                    <div className="noaudio"></div>
                  )}
                </div>
              </main>
              <FooterLite />
            </div>
            <PostPage />
            {showLogin && (
              <Popup
                Close={() => {
                  setShowLogin(false);
                }}
                Next={Next}
              />
            )}
          </div>
        </div>
      </motion.main>
    </>
  );
}
