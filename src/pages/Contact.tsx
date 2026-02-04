import { useForm } from "@formspree/react";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../App";
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

export default function Contact() {
  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [showLiked, setShowLiked] = useState("");
  const [loading, setLoading] = useState(false);

  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [Copy, setCopy] = useState(false);

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

  const navigate = useNavigate();

  const [state, handleSubmit] = useForm("xovaqweq");

  return (
    <>
      <Helmet>
        <title>Contact us | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content ">
            <div className="content" id="content" data-template="contact">
              <Header />
              <main>
                <div className="__contact" id="contact">
                  <NavLite page="Contact Us" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}
                  {
                    <div className="contact__body">
                      <div className="contact__body__left">
                        <h2>Get in touch to work with us!</h2>
                        <p>
                          Fill in the details in the contact form and a member
                          of our team will respond to you shortly.
                        </p>
                        <i>Or send an e-mail</i>
                        <a
                          href="mailto:info@withchude.com"
                          onClick={async (e) => {
                            e.preventDefault();
                            await navigator.clipboard.writeText(
                              "info@withchude.com"
                            );
                            setCopy(true);
                          }}
                        >
                          info@withchude.com
                          {Copy ? (
                            <svg
                              className="svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.5}
                              >
                                <circle cx={12} cy={12} r={10}></circle>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m8.5 12.5l2 2l5-5"
                                ></path>
                              </g>
                            </svg>
                          ) : (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M8 8V7.2C8 6.0799 8 5.51984 8.21799 5.09202C8.40973 4.71569 8.71569 4.40973 9.09202 4.21799C9.51984 4 10.0799 4 11.2 4H16.8C17.9201 4 18.4802 4 18.908 4.21799C19.2843 4.40973 19.5903 4.71569 19.782 5.09202C20 5.51984 20 6.0799 20 7.2V12.8C20 13.9201 20 14.4802 19.782 14.908C19.5903 15.2843 19.2843 15.5903 18.908 15.782C18.4802 16 17.9201 16 16.8 16H16M16 11.2V16.8C16 17.9201 16 18.4802 15.782 18.908C15.5903 19.2843 15.2843 19.5903 14.908 19.782C14.4802 20 13.9201 20 12.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V11.2C4 10.0799 4 9.51984 4.21799 9.09202C4.40973 8.71569 4.71569 8.40973 5.09202 8.21799C5.51984 8 6.0799 8 7.2 8H12.8C13.9201 8 14.4802 8 14.908 8.21799C15.2843 8.40973 15.5903 8.71569 15.782 9.09202C16 9.51984 16 10.0799 16 11.2Z"
                                stroke="#ADADAD"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </a>
                        <i data-desktop>Social Media</i>
                        <div data-desktop>
                          <a
                            href="https://x.com/chude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <XSvg />
                            @Chude
                          </a>
                          <a
                            href="https://web.facebook.com/WithChude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FbSvg />
                            @withChude
                          </a>
                          <a
                            href="https://www.instagram.com/chudeity"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IgSvg />
                            @chudeity
                          </a>
                          <a
                            href="https://www.youtube.com/@WithChude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <YoutubeSvg />
                            @withChude
                          </a>
                        </div>
                      </div>
                      <form
                        className="contact__body__right"
                        action="https://formspree.io/f/xovaqweq"
                        onSubmit={handleSubmit}
                      >
                        {state.succeeded ? (
                          <svg
                            className="svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <circle cx={12} cy={12} r={10}></circle>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.5 12.5l2 2l5-5"
                              ></path>
                            </g>
                          </svg>
                        ) : (
                          <>
                            <label htmlFor="name">
                              Name
                              <div
                                className="Signup__contact__show"
                                onClick={() => setShow(!show)}
                              ></div>
                            </label>{" "}
                            <input
                              id="name"
                              name="name"
                              placeholder="e.g. John Doe"
                              required
                              value={Name}
                              onInput={(e) => setName(e.currentTarget.value)}
                            />
                            <label htmlFor="email">E-mail Address</label>{" "}
                            <input
                              id="email"
                              name="email"
                              placeholder="e.g. john@e-mail.com"
                              required
                              value={Email}
                              onInput={(e) => setEmail(e.currentTarget.value)}
                            />
                            {/* <ValidationError prefix="Email" field="email" errors={state.errors} /> */}
                            <label htmlFor="message">
                              Message
                              <div
                                className="Signup__contact__show"
                                onClick={() => setShow2(!show2)}
                              ></div>
                            </label>{" "}
                            <textarea
                              id="message"
                              name="message"
                              placeholder="Type your message here"
                              required
                              value={Message}
                              onInput={(e) => setMessage(e.currentTarget.value)}
                            />
                            <button
                              disabled={state.submitting}
                              style={{
                                filter: `grayscale(${
                                  Name.length > 1 &&
                                  Email.length > 5 &&
                                  Message.length > 0
                                    ? 0
                                    : 1
                                })`,
                                pointerEvents:
                                  Name.length > 1 &&
                                  Email.length > 5 &&
                                  Message.length > 0
                                    ? "auto"
                                    : "none",
                              }}
                            >
                              <Loading loading={loading || state.submitting}>
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
                                Send Message
                              </Loading>
                            </button>
                            {/* <ValidationError prefix="Message" field="message" errors={state.errors} /> */}
                          </>
                        )}
                      </form>
                      <div className="contact__body__left">
                        <i data-mobile>Social Media</i>
                        <div data-mobile>
                          <a
                            href="https://x.com/chude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <XSvg />
                            @Chude
                          </a>
                          <a
                            href="https://web.facebook.com/WithChude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FbSvg />
                            @withChude
                          </a>
                          <a
                            href="https://www.instagram.com/chudeity"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IgSvg />
                            @chudeity
                          </a>
                          <a
                            href="https://www.youtube.com/@WithChude"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <YoutubeSvg />
                            @withChude
                          </a>
                        </div>
                      </div>
                    </div>
                  }
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
