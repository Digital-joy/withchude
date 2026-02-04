import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionContext } from "../App";
import Scroll from "../app/classes/scroll";
import { FooterLite } from "../components/Footer";
import Header from "../components/Header";
import Loader from "../components/Loading";
import { NavLite } from "../components/Nav";
import PostPage from "../components/PostPage";
import { Helmet } from "react-helmet-async";

export default function Terms({
  document,
}: PropsWithChildren<{ document: PrismicDocument }>) {
  useEffect(() => {
    if (!document) return;
    window.$scroll = new Scroll("studio");
  }, [document]);

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [showLiked, setShowLiked] = useState("");
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(0);

  const [Type, setType] = useState("payment");
  const [Amount, setAmount] = useState(25);
  const [Other, setOther] = useState<string>(null);

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
        <title>Terms | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="support">
              <Header />
              <main>
                <div className="__support" id="support">
                  <NavLite page="Terms of Service" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}
                  {/* <Elements stripe={stripePromise} options={options}>
                    <form>
                      <PaymentElement />
                      <button>Submit</button>
                    </form>
                  </Elements> */}
                  <div className="support__body">
                    <div className="support__body__full">
                      <PrismicRichText field={document.data.content} />
                    </div>
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
