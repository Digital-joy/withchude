import { PropsWithChildren, useEffect } from "react";
import Scroll from "../../app/classes/scroll";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Join from "../../components/Join";
import { NavLite } from "../../components/Nav";
import { usePresence, motion } from "framer-motion";
import gsap from "gsap";
import PostPage from "../../components/PostPage";
import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { Helmet } from "react-helmet-async";

export default function Books({
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
        <title>Books | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="books">
              <Header />
              <main>
                <div className="__books" id="books">
                  <NavLite page="Books" />
                  <div className="books__body">
                    {document?.data.book.map((data, key) => (
                      <div className="book" key={key}>
                        <div className="book__left">
                          <h2>{data.title[0]?.text}</h2>
                          <h6>{data.authpr[0]?.text}</h6>
                          <PrismicRichText field={data.description} />
                          <button>
                            Get it on
                            {data.link1?.url && (
                              <a
                                href={data.link1?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data["link1-logo"]?.url && (
                                  <img
                                    src={data["link1-logo"]?.url?.split("?")[0]}
                                    alt=""
                                  />
                                )}
                              </a>
                            )}
                            {data.link2?.url && (
                              <a
                                href={data.link2?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data["link2-logo"]?.url && (
                                  <img
                                    src={data["link2-logo"]?.url?.split("?")[0]}
                                    alt=""
                                  />
                                )}
                              </a>
                            )}
                            {data.link3?.url && (
                              <a
                                href={data.link3?.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {data["link3-logo"]?.url && (
                                  <img
                                    src={data["link3-logo"]?.url?.split("?")[0]}
                                    alt=""
                                  />
                                )}
                              </a>
                            )}
                          </button>
                        </div>
                        <img src={data.cover?.url?.split("?")[0]} alt="" />
                      </div>
                    ))}
                  </div>
                  <div className="book__footer">
                    {/* <div>
                      <h3>
                        <i>About</i> the Author
                      </h3>
                      <p>
                        Chude Jideonwo is a storyteller, using the research and evidence on human flourishing across disciplines
                        to inspire new narratives about politics, markets, faith, identity and society in Africa.
                      </p>
                      <p>
                        He is founder of Joy, Inc., a benefit corporation which has an ambitious mission to transform Sub-Saharan
                        Africa into a mental, emotional and spiritual safe space. All of Joy, Inc.’s profits are invested in
                        charities including The Joy Hub – a co-working space and walk-in center for young people dealing with
                        mental health challenges, with a focus on depression and anxiety.
                      </p>
                    </div>
                    <img src="/images/blog1.webp" alt="" /> */}
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
