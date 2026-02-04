import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../App";
import Scroll from "../../app/classes/scroll";
import { FooterLite } from "../../components/Footer";
import Header from "../../components/Header";
import Loader from "../../components/Loading";
import { NavLite } from "../../components/Nav";
import PostPage from "../../components/PostPage";
import { Helmet } from "react-helmet-async";

export default function Contribute({
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
        <title>Contribute | WithChude</title>
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
                  <NavLite page="Contribute" />
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
                    <div className="support__body__left">
                      <PrismicRichText field={document.data.content} />
                    </div>
                    <div className="support__body__right">
                      <li className={open === 0 ? "open" : ""}>
                        <h3 onClick={() => setOpen(open === 0 ? -1 : 0)}>
                          {document.data.support[0].title[0].text}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 7.91699L10 12.917L15 7.91699"
                              stroke="black"
                              strokeWidth="2.63077"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </h3>
                        <PrismicRichText
                          field={document.data.support[0].body}
                        />
                        <aside>
                          <i>Payment Frequency</i>
                          <div>
                            <span
                              className={Type === "payment" && "active"}
                              onClick={() => {
                                setType("payment");
                              }}
                            >
                              One off
                            </span>
                            <span
                              className={Type === "subscription" && "active"}
                              onClick={() => {
                                setType("subscription");
                              }}
                            >
                              Monthly
                            </span>
                            <span
                              className={Type === "subscription2" && "active"}
                              onClick={() => {
                                setType("subscription2");
                              }}
                            >
                              Annually
                            </span>
                          </div>
                        </aside>
                        <aside>
                          <i>Amount</i>
                          <div>
                            <span
                              className={Amount === 25 && "active"}
                              onClick={() => {
                                setAmount(25);
                              }}
                            >
                              $25
                            </span>
                            <span
                              className={Amount === 50 && "active"}
                              onClick={() => {
                                setAmount(50);
                              }}
                            >
                              $50
                            </span>
                            <span
                              className={Amount === 150 && "active"}
                              onClick={() => {
                                setAmount(150);
                              }}
                            >
                              $150
                            </span>
                            <span
                              className={Amount === 500 && "active"}
                              onClick={() => {
                                setAmount(500);
                              }}
                            >
                              $500
                            </span>
                            <span
                              className={Amount === 0 && "active"}
                              onClick={() => {
                                setAmount(0);
                              }}
                            >
                              Other
                            </span>
                          </div>
                          <input
                            className={Amount === 0 && "active"}
                            value={Other}
                            // type="number"
                            onInput={(e) => {
                              setOther(e.currentTarget.value);
                            }}
                            placeholder="Enter Amount"
                          />
                        </aside>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            const paymentIntent = await fetch(
                              `${process.env.SERVER_URL}/checkout`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  mode: Type,
                                  amount: Amount === 0 ? Number(Other) : Amount,
                                }),
                              }
                            );
                            if (paymentIntent.ok) {
                              const json = await paymentIntent.json();
                              location.assign(json.url);
                              setLoading(false);
                            } else {
                              setShowLiked("An error occured");
                              let liketimeout;
                              clearTimeout(liketimeout);
                              liketimeout = setTimeout(() => {
                                gsap.to(".Vid__added", { opacity: 0 });
                                setShowLiked("");
                              }, 2500);
                              setLoading(false);
                            }
                          }}
                        >
                          <Loader loading={loading}>
                            {document.data.support[0]["cta-text"][0].text}
                          </Loader>
                        </button>
                      </li>
                      {/* <li className={open === 1 ? "open" : ""}>
                        <h3 onClick={() => setOpen(open === 1 ? -1 : 1)}>
                          {document.data.support[1].title[0].text}
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M5 7.91699L10 12.917L15 7.91699"
                              stroke="black"
                              strokeWidth="2.63077"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </h3>
                        <PrismicRichText field={document.data.support[1].body} />
                        <button>{document.data.support[1]["cta-text"][0].text}</button>
                      </li> */}
                      <li className={open === 2 ? "open" : ""}>
                        <h3 onClick={() => setOpen(open === 2 ? -1 : 2)}>
                          {document.data.support[2].title[0].text}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 7.91699L10 12.917L15 7.91699"
                              stroke="black"
                              strokeWidth="2.63077"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </h3>
                        <PrismicRichText
                          field={document.data.support[2].body}
                        />
                        <aside>
                          <i>Payment Frequency</i>
                          <div>
                            <span
                              className={Type === "payment" && "active"}
                              onClick={() => {
                                setType("payment");
                              }}
                            >
                              One off
                            </span>
                            <span
                              className={Type === "subscription" && "active"}
                              onClick={() => {
                                setType("subscription");
                              }}
                            >
                              Monthly
                            </span>
                            <span
                              className={Type === "subscription2" && "active"}
                              onClick={() => {
                                setType("subscription2");
                              }}
                            >
                              Annually
                            </span>
                          </div>
                        </aside>
                        <aside>
                          <i>Amount</i>
                          <div>
                            <span
                              className={Amount === 25 && "active"}
                              onClick={() => {
                                setAmount(25);
                              }}
                            >
                              $25
                            </span>
                            <span
                              className={Amount === 50 && "active"}
                              onClick={() => {
                                setAmount(50);
                              }}
                            >
                              $50
                            </span>
                            <span
                              className={Amount === 150 && "active"}
                              onClick={() => {
                                setAmount(150);
                              }}
                            >
                              $150
                            </span>
                            <span
                              className={Amount === 500 && "active"}
                              onClick={() => {
                                setAmount(500);
                              }}
                            >
                              $500
                            </span>
                            <span
                              className={Amount === 0 && "active"}
                              onClick={() => {
                                setAmount(0);
                              }}
                            >
                              Other
                            </span>
                          </div>
                          <input
                            className={Amount === 0 && "active"}
                            value={Other}
                            // type="number"
                            onInput={(e) => {
                              setOther(e.currentTarget.value);
                            }}
                            placeholder="Enter Amount"
                          />
                        </aside>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            const paymentIntent = await fetch(
                              `${process.env.SERVER_URL}/checkout`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  mode: Type,
                                  amount: Amount === 0 ? Number(Other) : Amount,
                                }),
                              }
                            );
                            if (paymentIntent.ok) {
                              const json = await paymentIntent.json();
                              location.assign(json.url);
                              setLoading(false);
                            } else {
                              setShowLiked("An error occured");
                              let liketimeout;
                              clearTimeout(liketimeout);
                              liketimeout = setTimeout(() => {
                                gsap.to(".Vid__added", { opacity: 0 });
                                setShowLiked("");
                              }, 2500);
                              setLoading(false);
                            }
                          }}
                        >
                          <Loader loading={loading}>
                            {document.data.support[2]["cta-text"][0].text}
                          </Loader>
                        </button>
                      </li>
                      <li className={open === 3 ? "open" : ""}>
                        <h3 onClick={() => setOpen(open === 3 ? -1 : 3)}>
                          {document.data.support[3].title[0].text}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 7.91699L10 12.917L15 7.91699"
                              stroke="black"
                              strokeWidth="2.63077"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </h3>
                        <PrismicRichText
                          field={document.data.support[3].body}
                        />
                        <aside>
                          <i>Payment Frequency</i>
                          <div>
                            <span
                              className={Type === "payment" && "active"}
                              onClick={() => {
                                setType("payment");
                              }}
                            >
                              One off
                            </span>
                            <span
                              className={Type === "subscription" && "active"}
                              onClick={() => {
                                setType("subscription");
                              }}
                            >
                              Monthly
                            </span>
                            <span
                              className={Type === "subscription2" && "active"}
                              onClick={() => {
                                setType("subscription2");
                              }}
                            >
                              Annually
                            </span>
                          </div>
                        </aside>
                        <aside>
                          <i>Amount</i>
                          <div>
                            <span
                              className={Amount === 25 && "active"}
                              onClick={() => {
                                setAmount(25);
                              }}
                            >
                              $25
                            </span>
                            <span
                              className={Amount === 50 && "active"}
                              onClick={() => {
                                setAmount(50);
                              }}
                            >
                              $50
                            </span>
                            <span
                              className={Amount === 150 && "active"}
                              onClick={() => {
                                setAmount(150);
                              }}
                            >
                              $150
                            </span>
                            <span
                              className={Amount === 500 && "active"}
                              onClick={() => {
                                setAmount(500);
                              }}
                            >
                              $500
                            </span>
                            <span
                              className={Amount === 0 && "active"}
                              onClick={() => {
                                setAmount(0);
                              }}
                            >
                              Other
                            </span>
                          </div>
                          <input
                            className={Amount === 0 && "active"}
                            value={Other}
                            // type="number"
                            onInput={(e) => {
                              setOther(e.currentTarget.value);
                            }}
                            placeholder="Enter Amount"
                          />
                        </aside>
                        <button
                          onClick={async () => {
                            setLoading(true);
                            const paymentIntent = await fetch(
                              `${process.env.SERVER_URL}/checkout`,
                              {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  mode: Type,
                                  amount: Amount === 0 ? Number(Other) : Amount,
                                }),
                              }
                            );
                            if (paymentIntent.ok) {
                              const json = await paymentIntent.json();
                              location.assign(json.url);
                              setLoading(false);
                            } else {
                              setShowLiked("An error occured");
                              let liketimeout;
                              clearTimeout(liketimeout);
                              liketimeout = setTimeout(() => {
                                gsap.to(".Vid__added", { opacity: 0 });
                                setShowLiked("");
                              }, 2500);
                              setLoading(false);
                            }
                          }}
                        >
                          <Loader loading={loading}>
                            {document.data.support[3]["cta-text"][0].text}
                          </Loader>
                        </button>
                      </li>
                      <li className={open === 4 ? "open" : ""}>
                        <h3 onClick={() => setOpen(open === 4 ? -1 : 4)}>
                          {document.data.support[4].title[0].text}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 7.91699L10 12.917L15 7.91699"
                              stroke="black"
                              strokeWidth="2.63077"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </h3>
                        <PrismicRichText
                          field={document.data.support[4].body}
                        />
                        <button
                          onClick={async () => {
                            location.assign(
                              document.data.support[4]["cta-link"]?.url
                            );
                          }}
                        >
                          <Loader loading={loading}>
                            {document.data.support[4]["cta-text"][0].text}
                          </Loader>
                        </button>
                      </li>
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
