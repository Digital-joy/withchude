import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { get } from "idb-keyval";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Popup from "../components/Popup";
import PostPage from "../components/PostPage";
import Sections from "../components/Sections";
import VideoSection from "../components/VideoSection";
import HeroAlt from "../components/HeroAlt";
import { Helmet } from "react-helmet-async";
import { slugify } from "../app/utils";
import HeroStatic from "../components/HeroStatic";

export default function Watch() {
  useEffect(() => {
    window.$scroll = new Scroll("watch");
  }, []);

  const [isPresent, safeToRemove] = usePresence();

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

  const [Latest, setLatest] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setLatest(data);
    });
  }, []);

  const [Popular, setPopular] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setPopular(
        data.slice().sort(function (a, b) {
          if (a.views > b.views) {
            return -1;
          } else if (a.views < b.views) {
            return 1;
          }
          return 0;
        })
      );
    });
  }, []);

  const [WithChude, setWithChude] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setWithChude(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("WithChude".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [ChudeExplains, setChudeExplains] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setChudeExplains(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("ChudeExplains".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [Specials, setSpecials] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setSpecials(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("Specials".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [TheMusicPlaylist, setTheMusicPlaylist] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setTheMusicPlaylist(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("TheMusicPlaylist".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [WithChudeShorts, setWithChudeShorts] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setWithChudeShorts(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("WithChudeShorts".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [Clubs, setClubs] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setClubs(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("club".toLowerCase())) return true;
        })
      );
    });
  }, []);

  const [TheJoy150, setTheJoy150] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setTheJoy150(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("TheJoy150".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [TheHustle, setTheHustle] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setTheHustle(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("TheHustle".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [WhatILearntToday, setWhatILearntToday] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setWhatILearntToday(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("WhatILearntToday".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [Japa, setJapa] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setJapa(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("Japa".toLowerCase())) return true;
        })
      );
    });
  }, []);

  const [MasterClass, setMasterClass] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setMasterClass(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("MasterClass".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [OurRecommendations, setOurRecommendations] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setOurRecommendations(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("Recommendations".toLowerCase()))
            return true;
        })
      );
    });
  }, []);

  const [Films, setFilms] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setFilms(
        data.slice().filter(function (a) {
          if (a.tag?.toLowerCase().includes("Films".toLowerCase())) return true;
        })
      );
    });
  }, []);

  // const [List, setList] = useState([])
  // useEffect(() => {
  //   get("videos").then((data) => {
  //     supabase.auth.getUser().then((res) => {
  //       setList(
  //         data.slice().filter(function (a) {
  //           if (res?.data?.user?.user_metadata[a.uid] === "later") return true
  //         })
  //       )
  //     })
  //   })
  // }, [])

  const [active, setActive] = useState<any>(0);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [$vid, set$vid] = useState("");
  const session = useContext(SessionContext);

  const [List, setList] = useState([]);
  useEffect(() => {
    get("videos").then((data) => {
      setList(
        data.slice().filter(function (a) {
          if (session?.user?.user_metadata[a.uid] === "later") return true;
        })
      );
    });
  }, [session?.user]);

  const [Continue, setContinue] = useState([]);
  useEffect(() => {
    if (!session?.user?.email) return;
    supabase
      .from("users")
      .select("watchlist")
      .eq("id", session?.user?.id)
      .then((data2) => {
        get("videos").then((data) => {
          const found = data
            .slice()
            .filter(function (a) {
              if (data2.data[0].watchlist.includes(a.uid)) return true;
            })
            .slice(0, 10);
          setContinue(
            data2.data[0].watchlist
              .reverse()
              .map((id) => found.find((x) => x.uid === id))
          );
        });
      });
  }, [session?.user?.email]);

  const PlayVideo = async (id: string, free?: boolean) => {
    setActive(null);
    const user = session?.user;

    if (free) return navigate("/watch/" + id);
    if (!user) {
      set$vid(id);
      !free && setShowLogin(true);
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
          location.href =
            "https://www.youtube.com/channel/UC3C0OxzGKuFKJUpv-Dn-6fA";
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

  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  return (
    <>
      <Helmet>
        <title>Watch | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="watch">
              <Header />
              <main>
                <div className="__home" id="home">
                  <HeroStatic />
                  <Sections>
                    <VideoSection
                      title="Latest"
                      // more="Latest"
                      items={Latest}
                      PlayVideo={PlayVideo}
                      user={user}
                      showMore={false}
                    />
                    {/* <VideoSection
                      title="Recommendations"
                      more="Recommendations"
                      items={OurRecommendations}
                      PlayVideo={PlayVideo}
                      user={user}
                      showMore={false}
                    />
                    <VideoSection
                      title="Most Popular"
                      // more="Most Popular"
                      items={Popular}
                      PlayVideo={PlayVideo}
                      user={user}
                      showMore={false}
                    />
                    <VideoSection
                      title="Continue Watching"
                      // showProgress={true}
                      showMore={false}
                      items={Continue}
                      // more=""
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="My List"
                      more="My List"
                      items={List}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#WithChude"
                      more="_WithChude"
                      items={WithChude}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="Films"
                      more="Films"
                      items={Films}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#ChudeExplains"
                      more="_ChudeExplains"
                      items={ChudeExplains}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#ChudesClubs"
                      more="_Club"
                      items={Clubs}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#TheMusicPlaylist"
                      more="_TheMusicPlaylist"
                      items={TheMusicPlaylist}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#WithChudeShorts"
                      more="_WithChudeShorts"
                      items={WithChudeShorts}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#TheJoy150"
                      more="_TheJoy150"
                      items={TheJoy150}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#TheHustle"
                      more="_TheHustle"
                      items={TheHustle}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="Japa"
                      more="Japa"
                      items={Japa}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="Masterclasses"
                      more="Masterclasses"
                      items={MasterClass}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="#WhatILearntToday"
                      more="WhatILearntToday"
                      items={WhatILearntToday}
                      PlayVideo={PlayVideo}
                      user={user}
                    />
                    <VideoSection
                      title="Specials"
                      more="Specials"
                      items={Specials}
                      PlayVideo={PlayVideo}
                      user={user}
                    /> */}
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
