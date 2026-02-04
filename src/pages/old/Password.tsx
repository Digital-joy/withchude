import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useState } from "react";
import { Link, Router, useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../../App";
import Scroll from "../../app/classes/scroll";
import { FooterLite } from "../../components/Footer";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { NavLite } from "../../components/Nav";
import PostPage from "../../components/PostPage";
import HideSvg from "../../icons/hide";
import ShowSvg from "../../icons/show";
import { Helmet } from "react-helmet-async";

export default function Password() {
  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [showLiked, setShowLiked] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [Password, setPassword] = useState("");
  const [Password2, setPassword2] = useState("");
  const [Password3, setPassword3] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

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

  async function changePassword(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: Password,
    });

    if (!error) {
      const { data, error: error2 } = await supabase.auth.updateUser({
        password: Password2,
      });
      if (!error2) {
        setShowLiked("Password changed");
        let liketimeout;
        clearTimeout(liketimeout);
        liketimeout = setTimeout(() => {
          gsap.to(".Vid__added", { opacity: 0 });
          setShowLiked("");
          navigate("/watch");
        }, 2500);
      } else {
        setShowLiked("An error occurred");
        let liketimeout;
        clearTimeout(liketimeout);
        liketimeout = setTimeout(() => {
          gsap.to(".Vid__added", { opacity: 0 });
          setShowLiked("");
        }, 2500);
      }
    } else {
      setShowLiked("Invalid Credentials");
      let liketimeout;
      clearTimeout(liketimeout);
      liketimeout = setTimeout(() => {
        gsap.to(".Vid__added", { opacity: 0 });
        setShowLiked("");
      }, 2500);
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Password | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="password">
              <Header />
              <main>
                <div className="__password" id="password">
                  <NavLite page="Manage Account" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}
                  {
                    <div className="password__body">
                      <div className="password__body__left">
                        <Link to={"/payment/manage"}>
                          <Link
                            to={
                              session?.user?.user_metadata?.subscriptionId
                                ? "/payment/manage"
                                : "/payment"
                            }
                          >
                            {session?.user?.user_metadata?.subscriptionId
                              ? "Manage Payment"
                              : "Payment"}
                          </Link>
                        </Link>
                        <Link to={"/settings"}>
                          <h3>Manage Account</h3>
                        </Link>
                        <Link to={"/listen-later"}>View Listen Later</Link>
                        <Link to={"/watch/tags/My%20List"}>Open WatchList</Link>
                      </div>
                      <div className="password__body__right">
                        <h2>Manage Account</h2>
                        <div className="password__switch"></div>
                        <label htmlFor="password">
                          Current Password
                          <div
                            className="Signup__password__show"
                            onClick={() => setShow(!show)}
                          >
                            {show2 ? <HideSvg /> : <ShowSvg />}{" "}
                          </div>
                        </label>
                        <input
                          type={show2 ? "text" : "password"}
                          id="password"
                          placeholder="········"
                          required
                          value={Password}
                          onInput={(e) => setPassword(e.currentTarget.value)}
                        />
                        <label htmlFor="password">
                          Enter New Password
                          <div
                            className="Signup__password__show"
                            onClick={() => setShow2(!show2)}
                          >
                            {show2 ? <HideSvg /> : <ShowSvg />}{" "}
                          </div>
                        </label>{" "}
                        <input
                          type={show2 ? "text" : "password"}
                          id="password"
                          placeholder="Enter New Password"
                          required
                          value={Password2}
                          onInput={(e) => setPassword2(e.currentTarget.value)}
                        />
                        <label htmlFor="password">
                          Confirm New Password
                          <div
                            className="Signup__password__show"
                            onClick={() => setShow2(!show2)}
                          >
                            {show ? <HideSvg /> : <ShowSvg />}{" "}
                          </div>
                        </label>{" "}
                        <input
                          type={show ? "text" : "password"}
                          id="password"
                          placeholder="Confirm New Password"
                          required
                          value={Password3}
                          onInput={(e) => setPassword3(e.currentTarget.value)}
                        />
                        <button
                          onClick={changePassword}
                          // disabled={!loading}
                          style={{
                            filter: `grayscale(${
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password) ||
                                /\d/.test(Password)) &&
                              Password.length > 7 &&
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password2) ||
                                /\d/.test(Password2)) &&
                              Password2.length > 7 &&
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password3) ||
                                /\d/.test(Password3)) &&
                              Password2.length > 7 &&
                              Password2 === Password3
                                ? 0
                                : 1
                            })`,
                            pointerEvents:
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password) ||
                                /\d/.test(Password)) &&
                              Password.length > 7 &&
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password2) ||
                                /\d/.test(Password2)) &&
                              Password2.length > 7 &&
                              (/[@_!#$%^&*()<>?/|}{~:]/.test(Password3) ||
                                /\d/.test(Password3)) &&
                              Password2.length > 7 &&
                              Password2 === Password3
                                ? "auto"
                                : "none",
                          }}
                        >
                          <Loading loading={loading}>Change Password</Loading>
                        </button>
                      </div>
                      {/* <div className="password__body__right3">
                        <h2>Delete Account</h2>
                        <p>Kindly Note that this is irreversible</p>
                        <button
                          onClick={async () => {
                            setLoading2(true)
                            try {
                              const response = await fetch(`${process.env.SERVER_URL}/delete`, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  id: session?.user.id,
                                }),
                              })
                                .then(async (res) => {
                                  if (res.ok) {
                                    await supabase.auth.signOut()
                                    navigate("/")
                                  }
                                })
                                .catch((error2) => {
                                  setShowLiked("An error occured")
                                  let liketimeout
                                  clearTimeout(liketimeout)
                                  liketimeout = setTimeout(() => {
                                    gsap.to(".Vid__added", { opacity: 0 })
                                    setShowLiked("")
                                  }, 2500)
                                  setLoading2(false)
                                })
                            } catch (error2) {
                              setShowLiked("An error occured")
                              let liketimeout
                              clearTimeout(liketimeout)
                              liketimeout = setTimeout(() => {
                                gsap.to(".Vid__added", { opacity: 0 })
                                setShowLiked("")
                              }, 2500)
                              setLoading2(false)
                            }
                          }}
                          disabled={!session.user}
                        >
                          <Loading loading={loading2}>Delete Account</Loading>
                        </button>
                      </div> */}
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
