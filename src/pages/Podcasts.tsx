import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import Audio from "../components/Audio";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { NavLite } from "../components/Nav";
import PodcastsHero from "../components/PodcastsHero";
import PodcastsSection from "../components/PodcastsSection";
import Popup from "../components/Popup";
import PostPage from "../components/PostPage";
import { Searcher } from "../components/Searcher";
import { useSearchParams } from "react-router-dom";
import { paymentService } from "../app/services/supabse";

const q: string = "q";
export default function Podcasts() {
  const playerRef = useRef(null);
  const [active, setActive] = useState<any>(0);

  // Hook which returns a tuple. First element is the current URLSearchParams object and second element is the function to take in the new URLSearchParams object alongside a configuration object to either replace the query parameters or not alongside state.
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  const newQueryParameters: URLSearchParams = new URLSearchParams();

  // Temporary key of my query parameter

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
    console.log(player, 999);
    playerRef.current = player;
  };

  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [Search, setSearch] = useState(currentQueryParameters.get(q) ?? "");

  const [$vid, set$vid] = useState();
  const session = useContext(SessionContext);

  const PlayPodcast = async (podcast: any) => {
    setActive(null);
    const user = session?.user;

    if (!user) {
      set$vid(podcast);
      setShowLogin(true);
      setActive(0);
    } else {
      const paidViaPaystack = await paymentService.paidViaPaystack(
        user?.user_metadata?.subscriptionId || "",
        user?.email
      );
      const response = await fetch(
        paidViaPaystack
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
          setActive(0);
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
                  <NavLite page="Podcasts" />
                  <Searcher
                    text="Search for an episode..."
                    input={Search}
                    setInput={(val) => {
                      setSearch(val);
                      newQueryParameters.set(q, val);
                      setSearchParams(newQueryParameters);
                    }}
                  />
                  {(Search === "" || !Search) && (
                    <div>
                      <PodcastsHero PlayPodcast={PlayPodcast} active={active} />
                    </div>
                  )}
                  <div>
                    <PodcastsSection
                      title={
                        Search === "" || !Search
                          ? "All Episodes"
                          : `Search Results for ${Search}`
                      }
                      Search={Search}
                      PlayPodcast={PlayPodcast}
                      active={active}
                    />
                  </div>
                  {active ? (
                    <Audio
                      options={{
                        ...videoJsOptions,
                        sources: active?.url
                          .replace("upload/sp_auto/", "upload/")
                          .replace(".m3u8", ".mp3"),
                      }}
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
              <Footer />
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
