import { PropsWithChildren, useEffect } from "react";
import Scroll from "../../app/classes/scroll";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Join from "../../components/Join";
import { NavLite } from "../../components/Nav";
import { usePresence, motion } from "framer-motion";
import gsap from "gsap";
import PostPage from "../../components/PostPage";
import { Link } from "react-router-dom";
import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { Helmet } from "react-helmet-async";

export default function Events({
  document,
}: PropsWithChildren<{ document: PrismicDocument }>) {
  useEffect(() => {
    if (!document) return;
    window.$scroll = new Scroll("blog");
  }, [document]);

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

  return (
    <>
      <Helmet>
        <title>Events | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="events">
              <Header />
              <main>
                <div className="__events" id="events">
                  <NavLite page="Events" />
                  <div className="events__body">
                    {/* <div>
                      <h2>#CHUDESBOOKCLUB</h2>
                      <p>
                        {`Join the viral TV host Chude Jideonwo in the with a supportive network of individuals on a similar growth journey and benefit from a well-organized reading schedule and empathetic guidance based on real life experience. Experience meaningful changes in your mindset, habits, and life approach. This enriching and life-changing event is an opportunity to transform your life. \n\nSome have called it “group therapy”. It’s the ‘no judgement zone’. \n\nReserve your spot today and take the first step towards realizing your dreams - and living life with more clarity, contentment, peace and joy.`}
                      </p>
                    </div> */}

                    {document?.data.event.map((data, key) => (
                      <div className="event" key={key}>
                        <div className="event__left">
                          <h2>{data.title[0]?.text}</h2>
                          <PrismicRichText field={data.body} />
                          {data.signup_link?.url && (
                            <Link to={data.signup_link?.url} target="_blank">
                              Sign Up
                            </Link>
                          )}
                        </div>
                        <img src={data.cover?.url?.split("?")[0]} alt="" />
                      </div>
                    ))}
                  </div>
                  <Join />
                </div>
              </main>
              <Footer />
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  );
}
