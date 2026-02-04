import { PropsWithChildren, useEffect } from "react";
import Scroll from "../../app/classes/scroll";
import BlogHero from "../../components/BlogHero";
import BlogSection from "../../components/BlogSection";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Join from "../../components/Join";
import { NavLite } from "../../components/Nav";
import { Searcher } from "../../components/Searcher";
import { usePresence, motion } from "framer-motion";
import PostPage from "../../components/PostPage";
import gsap from "gsap";
import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import ContactSection from "../../components/ContactSection";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function AboutContact({
  document,
}: PropsWithChildren<{ document: PrismicDocument }>) {
  useEffect(() => {
    if (!document) return;
    window.$scroll = new Scroll("about");
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

  if (!document) return <></>;

  return (
    <>
      <Helmet>
        <title>About us | WithChude</title>
        <meta
          name="description"
          content="Films, series and podcast from Nigeria and Africa-for your mental, emotional and spiritual health."
        />
        <meta
          property="og:description"
          content="Films, series and podcast from Nigeria and Africa-for your mental, emotional and spiritual health."
        />
        <meta
          property="twitter:description"
          content="Films, series and podcast from Nigeria and Africa-for your mental, emotional and spiritual health."
        />
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="about">
              <Header />
              <main>
                <div className="__about" id="about">
                  <NavLite page="About" />
                  {document?.data.section?.map((data, index) => (
                    <div className="about__body" key={index}>
                      <div className="about__body__left">
                        <PrismicRichText field={data.title} />
                        <PrismicRichText field={data.body} />
                      </div>
                      <PrismicRichText field={data.image} />
                      <img src={data["image"]?.url?.split("?")[0]} alt="" />
                    </div>
                  ))}
                  <ContactSection id="contact" />
                  <Join className="no-scroll" />
                </div>
              </main>
              <Footer className="no-scroll" />
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  );
}
