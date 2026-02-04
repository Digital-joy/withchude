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

export default function Eventi({
  documents,
}: PropsWithChildren<{ documents: PrismicDocument[] }>) {
  const [events, setEvents] = useState<PrismicDocument[]>([]);
  useEffect(() => {
    if (!documents) return;
    window.$scroll = new Scroll("blog");

    if (documents.length) {
      const uid2 = "the-joy-retreat";
      const uid3 = "chudes-hdsml-toronto-book-launch";
      const uid1 = "hdsml-city-tours";
      const sortedPages = documents.sort(
        (a, b) =>
          new Date(b.last_publication_date).getTime() -
          new Date(a.last_publication_date).getTime()
      );

      // Step 2: Extract and reorder the priority pages
      const priorityPages = [
        sortedPages.find((p) => p.uid === uid1),
        sortedPages.find((p) => p.uid === uid2),
        sortedPages.find((p) => p.uid === uid3),
      ].filter(Boolean); // Remove any null if not found

      // Step 3: Remove priority pages from the sorted list
      const restPages = sortedPages.filter(
        (p) => p.uid !== uid1 && p.uid !== uid2 && p.uid !== uid3
      );

      // Step 4: Combine: [uid1, uid2, rest...]
      const finalDocuments = [...priorityPages, ...restPages].reverse();
      setEvents(finalDocuments);
      console.log(
        "Events",
        finalDocuments.map((e) => e.uid)
      );
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

                    {events.map((event, key) => (
                      <div className="event" key={key}>
                        <img
                          src={event.data.cover?.url?.split("?")[0]}
                          alt=""
                        />
                        <div className="event__left">
                          <h2>{event.data.title[0]?.text}</h2>
                          <PrismicRichText field={event.data.body} />
                          <div className="links">
                            {(event.data.links && event.data.links.length) ?
                              event.data.links.map((link, index) => (
                                <>
                                  {link.stripe_price_id.length ? (
                                    <>
                                    <div className="checkout_container">
                                      <h6 className="mb-2">{link.text[0]?.text || "Sign Up"}</h6>
                                      <StripeSingleItemCheckout
                                        price_id={link.stripe_price_id[0].text}
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
                              )) : <></>}
                          </div>
                        </div>
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
