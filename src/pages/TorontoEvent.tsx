import { PropsWithChildren, useEffect, useState } from "react";
import Scroll from "../app/classes/scroll";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Join from "../components/Join";
import { NavLite } from "../components/Nav";
import { usePresence, motion } from "framer-motion";
import gsap from "gsap";
import PostPage from "../components/PostPage";
import { Link } from "react-router-dom";
import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { Helmet } from "react-helmet-async";
import StripeSingleItemCheckout from "../components/checkout/StripeSingleItemCheckout";

export default function TorontoEvent({
  documents,
}: PropsWithChildren<{ documents: PrismicDocument[] }>) {
  const [events, setEvents] = useState<PrismicDocument[]>([]);
  const [torontoEvent, setTorontoEvent] = useState<PrismicDocument | null>(
    null,
  );
  useEffect(() => {
    if (!documents) return;
    window.$scroll = new Scroll("blog");

    const evt = documents.find(
      (d) => d.uid == "chudes-hdsml-toronto-book-launch",
    );
    if (evt) {
      setTorontoEvent(evt);
    } else {
      // location.href = "/events";
    }
  }, [documents]);

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
        <title>Chude Jideonwo's Toronto Book Launch | #WithChude</title>
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
                  <div className="NavLite">
                    <Link to={"/"}>WithChude</Link>/
                    <Link to={"/events"}>{"Events"}</Link>/Chude Jideonwo's
                    Toronto Book Launch
                  </div>
                  <div className="events__body">
                    {torontoEvent && (
                      <div className="event">
                        <img
                          src={torontoEvent.data.cover?.url?.split("?")[0]}
                          alt=""
                        />
                        <div className="event__left">
                          <h2>{torontoEvent.data.title[0]?.text}</h2>
                          <PrismicRichText field={torontoEvent.data.body} />
                          <div className="links">
                            {torontoEvent.data.links &&
                              torontoEvent.data.links.map((link, index) => (
                                <>
                                  {link.stripe_price_id.length ? (
                                    <>
                                      <div className="checkout_container">
                                        <h6 className="mb-2">
                                          {link.text[0]?.text || "Sign Up"}
                                        </h6>
                                        <StripeSingleItemCheckout
                                          price_id={
                                            link.stripe_price_id[0].text
                                          }
                                        />
                                      </div>
                                    </>
                                  ) : (
                                    <Link
                                      to={link.link.url}
                                      target={link.link.target}
                                      key={index}
                                    >
                                      {link.text[0]?.text || "Sign Up"}
                                    </Link>
                                  )}
                                </>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
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
