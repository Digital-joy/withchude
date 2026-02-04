import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import { FooterLite } from "../components/Footer";
import Header from "../components/Header";
import Loading, { Loader2 } from "../components/Loading";
import { NavLite } from "../components/Nav";
import PostPage from "../components/PostPage";
import HideSvg from "../icons/hide";
import ShowSvg from "../icons/show";
import SvgVisa from "../icons/Visa";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import SvgMasterCard from "../icons/MasterCard";
import { Helmet } from "react-helmet-async";
// import { Visa } from "react-pay-icons"

export default function PaymentManageNew() {
  useEffect(() => {
    window.$scroll = new Scroll("studio");
  }, []);

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [showLiked, setShowLiked] = useState("");
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const [Password, setPassword] = useState("");
  const [Password2, setPassword2] = useState("");
  const [Password3, setPassword3] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [paidWithPaystack, setPaidWithPaystack] = useState(false);
  const [updateSubscription, setUpdateSubscription] = useState<{
    client_secret: string;
    amount: number;
    payment_method: string;
  } | null>(null);

  useEffect(() => {
    fetch(`${process.env.SERVER_URL}/retrieve/paystack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user?.user_metadata?.subscriptionId || "",
        email: session?.user?.email,
      }),
    }).then(async (res) => {
      if (res.ok) {
        const ok = await res.json();
        setDetails(ok);
        console.log(ok);
        setPaidWithPaystack(true);
      } else {
        setPaidWithPaystack(false);
        await fetch(`${process.env.SERVER_URL}/retrieve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: session?.user?.user_metadata?.subscriptionId || "",
            email: session?.user?.email,
          }),
        }).then(async (res) => {
          if (res.ok) {
            const ok = await res.json();
            setDetails(ok);
            console.log(ok);
          } else if (res.status == 400) {
            const notOkay = await res.json();
            setDetails(notOkay);
            if (notOkay.status == "past_due" && notOkay.payment_intent)
              setUpdateSubscription({
                client_secret: notOkay.payment_intent.client_secret,
                amount: notOkay.payment_intent.amount,
                payment_method: notOkay.card,
              });
          }
        });
      }
    });
  }, [session?.user?.user_metadata?.subscriptionId]);

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

  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setName(user?.data?.user?.user_metadata?.name);
      setEmail(user?.data?.user?.user_metadata?.email);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Manage Payment | WithChude</title>
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
                  <NavLite page="Manage Payment" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}
                  <div className="password__body">
                    <div className="password__body__left">
                      <Link
                        to={
                          session?.user?.user_metadata?.subscriptionId
                            ? "/payment/manage"
                            : "/payment"
                        }
                      >
                        {session?.user?.user_metadata?.subscriptionId ? (
                          <h3>Manage Payment</h3>
                        ) : (
                          "Payment"
                        )}
                      </Link>
                      <Link to={"/settings"}>Manage Account</Link>
                      <Link to={"/listen-later"}>View Listen Later</Link>
                      <Link to={"/watch/tags/My%20List"}>Open WatchList</Link>
                    </div>
                    {details && (
                      <>
                        <div
                          className="password__body__mid"
                          style={{
                            pointerEvents:
                              details?.last4 === "FREE" ? "none" : "auto",
                          }}
                        >
                          <div>
                            <h2>Payment Information</h2>
                            {updateSubscription && (
                              <p>
                                You have a subscription of $
                                {updateSubscription.amount / 100} that is past
                                due. Click on the button below to confirm your
                                subscription update.
                              </p>
                            )}
                            <h4>
                              {details.brand === "visa" && <SvgVisa />}
                              {details.brand === "mastercard" && (
                                <SvgMasterCard />
                              )}
                              **** **** **** {details.last4}
                            </h4>
                          </div>
                          {!(paidWithPaystack && !details.canceled) && (
                            <>
                              <div
                                style={{
                                  pointerEvents: details.canceled
                                    ? "none"
                                    : "auto",
                                }}
                                onClick={() => {
                                  setCanceling(true);

                                  if (updateSubscription) {
                                    setCanceling(false);
                                    stripe
                                      ?.confirmCardPayment(
                                        updateSubscription.client_secret,
                                        {
                                          setup_future_usage: "off_session",
                                          payment_method:
                                            updateSubscription.payment_method,
                                        }
                                      )
                                      .then((confirmPayment) => {
                                        if (confirmPayment.error) {
                                          setShowLiked(
                                            confirmPayment.error?.message ||
                                              "An error occured"
                                          );
                                          let liketimeout;
                                          clearTimeout(liketimeout);
                                          liketimeout = setTimeout(() => {
                                            gsap.to(".Vid__added", {
                                              opacity: 0,
                                            });
                                            setShowLiked("");
                                          }, 2500);
                                        } else if (
                                          confirmPayment.paymentIntent
                                            .status === "succeeded"
                                        ) {
                                          setShowLiked(
                                            "Subscription update confirmed"
                                          );
                                          let liketimeout;
                                          clearTimeout(liketimeout);
                                          liketimeout = setTimeout(() => {
                                            gsap.to(".Vid__added", {
                                              opacity: 0,
                                            });
                                            setShowLiked("");

                                            location.reload();
                                          }, 2500);
                                        }
                                      })
                                      .catch((e) => {
                                        setShowLiked(
                                          "Some error occured while trying to confirm subscription update."
                                        );
                                        let liketimeout;
                                        clearTimeout(liketimeout);
                                        liketimeout = setTimeout(() => {
                                          gsap.to(".Vid__added", {
                                            opacity: 0,
                                          });
                                          setShowLiked("");
                                        }, 2500);
                                      });
                                  } else {
                                    fetch(
                                      details.canceled
                                        ? `${process.env.SERVER_URL}/uncancel`
                                        : `${process.env.SERVER_URL}/cancel`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          name: session?.user?.user_metadata
                                            ?.name,
                                          email:
                                            session?.user?.user_metadata?.email,
                                          id:
                                            session?.user?.user_metadata
                                              ?.subscriptionId || "",
                                        }),
                                      }
                                    ).then(async (res) => {
                                      if (res.ok) {
                                        // const { data, error } = await supabase.auth.updateUser({
                                        //   data: { subscriptionId: null },
                                        // })
                                        setCanceling(false);
                                        navigate("/");
                                      }
                                    });
                                  }
                                }}
                              >
                                <Loader2 loading={canceling}>
                                  <button
                                    style={{
                                      color: updateSubscription
                                        ? "#0A8754"
                                        : "auto",
                                    }}
                                  >
                                    {updateSubscription ? (
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M2.75 12V16.25C2.75 17.9069 4.09315 19.25 5.75 19.25H11M2.75 12V7.75C2.75 6.09315 4.09315 4.75 5.75 4.75H18.25C19.9069 4.75 21.25 6.09315 21.25 7.75V12H2.75Z"
                                          stroke="#0A8754"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M16 16.5L18 18.5L22 14.5"
                                          stroke="#0A8754"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M2.75 12V16.25C2.75 17.9069 4.09315 19.25 5.75 19.25H11M2.75 12V7.75C2.75 6.09315 4.09315 4.75 5.75 4.75H18.25C19.9069 4.75 21.25 6.09315 21.25 7.75V12H2.75ZM16.75 16.75L19 19M19 19L21.25 21.25M19 19L16.75 21.25M19 19L21.25 16.75"
                                          stroke="#B00000"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    )}
                                    {updateSubscription
                                      ? `Confirm Subscription Update ($${
                                          updateSubscription.amount / 100
                                        })`
                                      : details.canceled
                                      ? "Re-subscribe"
                                      : "Cancel Subscription"}
                                  </button>
                                </Loader2>
                              </div>
                              {updateSubscription && (
                                <div
                                  style={{
                                    pointerEvents: details.canceled
                                      ? "none"
                                      : "auto",
                                  }}
                                  onClick={() => {
                                    setCanceling(true);

                                    fetch(`${process.env.SERVER_URL}/cancel`, {
                                      method: "POST",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        name: session?.user?.user_metadata
                                          ?.name,
                                        email:
                                          session?.user?.user_metadata?.email,
                                        id:
                                          session?.user?.user_metadata
                                            ?.subscriptionId || "",
                                      }),
                                    }).then(async (res) => {
                                      if (res.ok) {
                                        // const { data, error } = await supabase.auth.updateUser({
                                        //   data: { subscriptionId: null },
                                        // })
                                        setCanceling(false);
                                        navigate("/");
                                      }
                                    });
                                  }}
                                >
                                  <Loader2 loading={canceling}>
                                    <button
                                      style={{
                                        color: "auto",
                                      }}
                                    >
                                      <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                      >
                                        <path
                                          d="M2.75 12V16.25C2.75 17.9069 4.09315 19.25 5.75 19.25H11M2.75 12V7.75C2.75 6.09315 4.09315 4.75 5.75 4.75H18.25C19.9069 4.75 21.25 6.09315 21.25 7.75V12H2.75ZM16.75 16.75L19 19M19 19L21.25 21.25M19 19L16.75 21.25M19 19L21.25 16.75"
                                          stroke="#B00000"
                                          strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>

                                      {"Cancel Subscription"}
                                    </button>
                                  </Loader2>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        <div
                          className="password__body__right2"
                          style={{
                            pointerEvents:
                              details?.last4 === "FREE" ? "none" : "auto",
                          }}
                        >
                          <h2>Update Card Details</h2>
                          <label htmlFor="">Cardholder Name</label>
                          <input
                            placeholder="Name"
                            type="text"
                            value={Name}
                            onChange={(e) => {}}
                            readOnly
                          />
                          <label htmlFor="">Email Address</label>
                          <input
                            placeholder="Email"
                            type="email"
                            value={Email}
                            onChange={(e) => {}}
                            readOnly
                          />
                          {!paidWithPaystack && (
                            <>
                              <label htmlFor="">Card Number</label>
                              <CardElement
                                options={{
                                  hidePostalCode: true,
                                  style: {
                                    base: {
                                      fontFamily: "sans-serif",
                                      fontSize: "16px",
                                      lineHeight: "20px",
                                      letterSpacing: "-0.02em",
                                    },
                                  },
                                }}
                              />
                            </>
                          )}
                          <button
                            onClick={async () => {
                              setLoading(true);
                              let paymentMethod;
                              // create a payment method
                              if (!paidWithPaystack) {
                                paymentMethod =
                                  await stripe?.createPaymentMethod({
                                    type: "card",
                                    card: elements?.getElement(CardElement)!,
                                    billing_details: {
                                      name: Name,
                                      email: Email,
                                    },
                                  });
                              }

                              // call the backend to create subscription
                              try {
                                const response = await fetch(
                                  paidWithPaystack
                                    ? `${process.env.SERVER_URL}/update-payment-method/paystack`
                                    : `${process.env.SERVER_URL}/update-subscription`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      paymentMethod:
                                        paymentMethod?.paymentMethod?.id,
                                      subscriptionId:
                                        session.user.user_metadata
                                          .subscriptionId,
                                      subscription_code: details.code,
                                    }),
                                  }
                                )
                                  .then(async (res) => {
                                    if (res.ok && paidWithPaystack) {
                                      const data = await res.json();
                                      window.location.href = data.link;
                                      return;
                                    }
                                    if (res.ok) {
                                      setShowLiked("Updated Successfully");
                                      let liketimeout;
                                      clearTimeout(liketimeout);
                                      liketimeout = setTimeout(() => {
                                        gsap.to(".Vid__added", { opacity: 0 });
                                        setShowLiked("");
                                        navigate("/watch");
                                      }, 2500);
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
                                  })
                                  .catch((error2) => {
                                    setShowLiked("An error occured");
                                    let liketimeout;
                                    clearTimeout(liketimeout);
                                    liketimeout = setTimeout(() => {
                                      gsap.to(".Vid__added", { opacity: 0 });
                                      setShowLiked("");
                                    }, 2500);
                                    setLoading(false);
                                  });
                              } catch (error2) {
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
                            disabled={
                              !stripe && !elements?.getElement(CardElement)!
                            }
                          >
                            <Loading loading={loading}>
                              {paidWithPaystack
                                ? "Update Subscription with Paystack"
                                : "Update Payment Information"}
                            </Loading>
                          </button>
                        </div>
                      </>
                    )}
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
