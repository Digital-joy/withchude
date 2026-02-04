import { PropsWithChildren, useEffect } from "react";
import Scroll from "../../app/classes/scroll";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { NavLite } from "../../components/Nav";
import PostPage from "../../components/PostPage";
import { usePresence, motion } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import Testimonials from "../../components/Testimonials";
import { Helmet } from "react-helmet-async";

export default function Studio({
  document,
  testimonies,
}: PropsWithChildren<{
  document: PrismicDocument;
  testimonies: PrismicDocument;
}>) {
  useEffect(() => {
    if (!document || !testimonies) return;
    window.$scroll = new Scroll("studio");
  }, [document, testimonies]);

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

  if (!document || !testimonies) return <></>;

  return (
    <>
      <Helmet>
        <title>Studio | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="studio">
              <Header />
              <main>
                <div className="__studio" id="studio">
                  <NavLite page="Studio" />
                  <div className="studio__body">
                    {document && (
                      <PrismicRichText field={document.data?.heading} />
                    )}
                    <article>
                      {document?.data?.spaces?.map((data, index) => (
                        <span key={index}>
                          <PrismicRichText field={data["space-head"]} />
                          <PrismicRichText field={data["space-body"]} />
                        </span>
                      ))}
                    </article>
                    <h5>Critical Acclaim</h5>
                    <figure>
                      {document?.data.acclaim?.map((data, index) => (
                        <a
                          href={data["acclaim-link"]?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={index}
                        >
                          <span>
                            <svg
                              width="96"
                              height="97"
                              viewBox="0 0 96 97"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M74.9461 44.4844C74.6038 43.892 74.1792 43.3342 73.6725 42.8275L58.1578 27.3128C56.5957 25.7507 56.5957 23.2181 58.1578 21.656C59.7198 20.0939 62.2525 20.0938 63.8146 21.6559L79.3293 37.1706C85.5777 43.419 85.5777 53.5496 79.3293 59.798L63.8146 75.3128C62.2525 76.8749 59.7199 76.8749 58.1578 75.3128C56.5957 73.7507 56.5957 71.2181 58.1578 69.656L73.6725 54.1412C74.1792 53.6345 74.6037 53.0767 74.9461 52.4844L15.9862 52.4844C13.777 52.4844 11.9862 50.6935 11.9862 48.4844C11.9862 46.2752 13.777 44.4844 15.9862 44.4844H74.9461Z"
                                fill="black"
                              ></path>
                            </svg>
                            <PrismicRichText field={data["acclaim-title"]} />
                            {/* <img src={data["acclaim-logo"]?.url?.split("?")[0]} alt="" /> */}
                          </span>
                        </a>
                      ))}
                    </figure>
                    <Testimonials testimonies={testimonies} />
                    <h2>Want to work with us?</h2>
                  </div>
                  <Link to={"/contact"} className="JoinLite">
                    Get in touch
                    <svg width="96" height="97" viewBox="0 0 96 97" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M74.9461 44.4844C74.6038 43.892 74.1792 43.3342 73.6725 42.8275L58.1578 27.3128C56.5957 25.7507 56.5957 23.2181 58.1578 21.656C59.7198 20.0939 62.2525 20.0938 63.8146 21.6559L79.3293 37.1706C85.5777 43.419 85.5777 53.5496 79.3293 59.798L63.8146 75.3128C62.2525 76.8749 59.7199 76.8749 58.1578 75.3128C56.5957 73.7507 56.5957 71.2181 58.1578 69.656L73.6725 54.1412C74.1792 53.6345 74.6037 53.0767 74.9461 52.4844L15.9862 52.4844C13.777 52.4844 11.9862 50.6935 11.9862 48.4844C11.9862 46.2752 13.777 44.4844 15.9862 44.4844H74.9461Z"
                        fill="black"
                      />
                    </svg>
                  </Link>
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
