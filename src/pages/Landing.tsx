import { PrismicDocument } from "@prismicio/client";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { PropsWithChildren, useEffect } from "react";
import Scroll from "../app/classes/scroll";
import Categories from "../components/Categories";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Join from "../components/Join";
import PostPage from "../components/PostPage";
import Preloader from "../components/Preloader";
import Updates from "../components/Updates";
import Watching from "../components/Watching";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";
import HeroAlt from "../components/HeroAlt";
import BooksCarousel from "../components/BooksCarousel";
import HeroStatic from "../components/HeroStatic";
import EventSection from "../components/EventSection";
import EventCarousel from "../components/EventCarousel";

export default function Landing({
  document,
  blog,
  books,
}: PropsWithChildren<{
  document: PrismicDocument;
  blog: PrismicDocument[];
  books: PrismicDocument;
}>) {
  useEffect(() => {
    if (!document || !blog || !blog[0]) return;
    gsap.delayedCall(1, () => {
      window.$scroll = new Scroll("home");
    });
  }, [document, blog]);

  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true });
          safeToRemove();
        },
      });
      // .to(".PostPage", { scaleY: 1, duration: 1, ease: "expo" }, 0)
    }
  }, [isPresent]);

  if (!document) return <></>;

  return (
    <>
      <SEO
        title="Learning React Helmet!"
        description="Beginner friendly page for learning React Helmet."
        name="Company name."
        type="article"
      />
      <Helmet>
        <title>
          #WithChude | Films, series and podcasts from Africa for your mind,
          heart and spirit
        </title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <Preloader />
            <div className="content" id="content" data-template="home">
              <Header />
              <main>
                <div className="__home" id="home">
                  {/* <HeroAlt /> */}
                  <HeroStatic />
                  {/* <EventCarousel /> */}
                  <Updates document={blog} />
                  <Watching reels={document} />
                  {/* <EventSection /> */}
                  <BooksCarousel bookDocument={books} />
                  <Join
                    className="no-scroll withchude_live_background"
                    style={{
                      paddingTop: "10rem"
                    }}
                  />
                  <FAQ faqs={document} />
                  {/* <Testimonials /> */}
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

// Custom Export
export { getDocumentProps };

// getDocumentProps() can use fetched data to provide <title> and <meta name="description">
function getDocumentProps(pageProps) {
  return {
    title: "jskjsjs",
    description: "sojssksk",
  };
}
