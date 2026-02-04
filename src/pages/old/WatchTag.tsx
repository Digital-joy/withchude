import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { get } from "idb-keyval";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SessionContext, supabase } from "../../App";
import Scroll from "../../app/classes/scroll";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { VidLoader } from "../../components/Loading";
import Popup from "../../components/Popup";
import PostPage from "../../components/PostPage";
import Sections from "../../components/Sections";
import VideoItem from "../../components/VideoItem";
import VideoItemWithModal from "../../components/VideoItemWithModal";
import { Helmet } from "react-helmet-async";

export default function WatchTag() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.$scroll = new Scroll("watch");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const location = useLocation();
  const params = useParams();

  const [active, setActive] = useState<any>(0);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [$vid, set$vid] = useState("");
  const session = useContext(SessionContext);

  const PlayVideo = async (id: string, free?: boolean) => {
    setActive(null);
    const user = session?.user;

    if (free) navigate("/watch/" + id);
    if (!user) {
      set$vid(id);
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
          navigate("/watch/" + id);
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
  };

  const Next = () => {
    PlayVideo($vid);
  };

  const [Category, setCategory] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      if (params.id === "Most Popular Episodes") {
        setCategory(
          data
            .filter((x) => x.url !== "")
            .sort(function (a, b) {
              if (a.views > b.views) {
                return -1;
              } else if (a.views < b.views) {
                return 1;
              }
              return 0;
            })
            .reverse()
            .slice(0, 30)
        );
      } else if (params.id === "My List") {
        setLoading(true);
        setCategory(
          data
            .filter((x) => x.url !== "")
            .filter(function (a) {
              if (session?.user?.user_metadata[a.uid] === "later") return true;
            })
        );
        setLoading(false);
      } else {
        setCategory(
          data.slice().filter(function (a) {
            if (
              a.tag
                ?.toLowerCase()
                .includes(
                  `${params.id
                    ?.toLowerCase()
                    ?.slice(0, -2)
                    ?.replace("_", "")}`.toLowerCase()
                )
            )
              return true;
          })
        );
      }
    });
  }, [params, session?.user]);

  useEffect(() => {
    if (!isPresent) {
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true });
          safeToRemove();
        },
      });
      //      .to(".PostPage", { scaleY: 1, duration: 1, ease: "expo" }, 0)
    }
  }, [isPresent]);

  // if (loading) return <></>

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(session?.user);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Watch - ${params.id.replace("_", "#")} | WithChude`}</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="tag">
              <Header />
              <main>
                <div className="__tag" id="tag">
                  <h2>{params.id.replace("_", "#")}</h2>
                  <Sections>
                    <div className="VideoSection__videos__wrapper">
                      {loading ? (
                        <VidLoader />
                      ) : (
                        <div className="VideoSection__videos">
                          {Category.map((data) => (
                            <>
                              {/* <VideoItem
                              key={data.uid}
                              uid={data.uid}
                              url={data.url}
                              free={data?.free}
                              title={data?.episode + " " + (data?.episode[0] && data?.title[0] ? ":" : "") + " " + data?.title}
                              showProgress={false}
                              description={data.description}
                              tag={data.tag}
                              thumbnail={data.thumbnail}
                              PlayVideo={PlayVideo}
                              user={user}
                            /> */}
                              <VideoItemWithModal
                                key={data?.uid}
                                video={data}
                                showProgress={false}
                                PlayVideo={PlayVideo}
                                user={user}
                              />
                            </>
                          ))}
                        </div>
                      )}
                    </div>
                  </Sections>
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
