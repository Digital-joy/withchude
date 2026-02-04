import { useForm } from "@formspree/react";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import { FooterLite } from "../components/Footer";
import Header from "../components/Header";
import Loading from "../components/Loading";
import { NavLite } from "../components/Nav";
import PostPage from "../components/PostPage";
import FbSvg from "../icons/fb";
import IgSvg from "../icons/ig";
import XSvg from "../icons/x";
import YoutubeSvg from "../icons/youtube";
import { Helmet } from "react-helmet-async";

export default function NewsletterUnsubscribe() {
  const location = useLocation();

  // Extract the "code" search parameter
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId");

  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [showLiked, setShowLiked] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  const handleUnsubscribe = () => {
    setLoading(true);

    fetch(`${process.env.SERVER_URL}/newsletter/unsubscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.status == 200) {
          setShowLiked(data.message);
          let liketimeout;
          clearTimeout(liketimeout);
          liketimeout = setTimeout(() => {
            gsap.to(".Vid__added", { opacity: 0 });
            setShowLiked("");
          }, 5000);
          setLoading(false);
        } else {
          setShowLiked(data.message);
          let liketimeout;
          clearTimeout(liketimeout);
          liketimeout = setTimeout(() => {
            gsap.to(".Vid__added", { opacity: 0 });
            setShowLiked("");
          }, 5000);
          setLoading(false);
        }
      })
      .catch(() => {
        setShowLiked(
          "Some error occured while trying to unsubscribe from mailing list. Please try again."
        );
        let liketimeout;
        clearTimeout(liketimeout);
        liketimeout = setTimeout(() => {
          gsap.to(".Vid__added", { opacity: 0 });
          setShowLiked("");
        }, 5000);
        setLoading(false);
      });
  };

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

  const [state, handleSubmit] = useForm("xovaqweq");

  return (
    <>
      <Helmet>
        <title>Unsubscribe From Mailing List | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content ">
            <div className="content" id="content" data-template="unsubscribe">
              <Header />
              <main>
                <div className="__unsubscribe" id="unsubscribe">
                  <NavLite page="Unsubscribe from Mailing List" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}

                  <div className="unsubscribe__body">
                    <h2>Unsubscribe from our Mailing List</h2>
                    <p>Click the button below to unsubscribe from our mailing list.</p>

                    <button disabled={loading} onClick={handleUnsubscribe}>
                      <Loading loading={loading}>
                        <svg
                          width="23"
                          height="23"
                          viewBox="0 0 23 23"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_1585_806)">
                            <path
                              d="M8.48623 14.1419L10.0183 12.6098M8.48623 14.1419L3.30078 11.3135L15.2037 7.42439L11.3147 19.3274L8.48623 14.1419Z"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1585_806">
                              <rect
                                width="16"
                                height="16"
                                fill="white"
                                transform="translate(0 11.3135) rotate(-45)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Unsubscribe
                      </Loading>
                    </button>
                  </div>
                </div>
              </main>
              <FooterLite />
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  );
}

// const conversions = {
//   "Nigeria": "NGN",
//   "United Arab Emirates": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
//   "Nigeria": "NGN",
// }
