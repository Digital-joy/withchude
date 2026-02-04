import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import countryToCurrency from "country-to-currency";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import Stripe from "stripe";
import { SessionContext, supabase } from "../../App";
import Scroll from "../../app/classes/scroll";
import { FooterLite } from "../../components/Footer";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { NavLite } from "../../components/Nav";
import PostPage from "../../components/PostPage";
import RoundCheckSvg from "../../icons/roundcheck";
import useGeoLocation from "react-ipgeolocation";
import getSymbolFromCurrency from "currency-symbol-map";
import Paystack from "@paystack/inline-js";
import Popup from "../../components/Country";
import AuthPopup from "../../components/Popup";
import SupportPopup from "../../components/popup/SupportPopup";
import { PrismicDocument } from "@prismicio/client";
import { Helmet } from "react-helmet-async";
import { activityService } from "../../app/services/supabse";
import { initial } from "underscore";

// const popup = new Paystack()

export default function Payment({
  document,
}: PropsWithChildren<{ document: PrismicDocument }>) {
  const [X, setX] = useState(false);
  const DEFAULT_AMOUNT = 8.99;
  useEffect(() => {
    // if (!X) return;
    window.$scroll = new Scroll("studio");
  }, [X]);

  const { country, error, isLoading } = useGeoLocation();
  const [showCountry, setShowCountry] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [payWithNaira, setPayWithNaira] = useState<boolean | undefined>(
    undefined
  );

  const [isPresent, safeToRemove] = usePresence();
  const session = useContext(SessionContext);
  const [pricing, setPricing] = useState([
    // { name: "Monthly", id: "price_1PUiJ4Ky2isPjDAkYacQlltf" },
    // { name: "Monthly", id: "price_1PaeGADyAAGaMpq3XlenhnJj" },
    // { name: "Annual", id: "price_1PaeHTDyAAGaMpq3ySOJzMXj" },
  ]);

  // useEffect(() => {
  //   setPayWithNaira(session?.user?.user_metadata.country === "NG");
  // }, []);

  useEffect(() => {
    if (isLoading || !country) return;
    setLoading(true);

    if (payWithNaira) {
      setPricing([
        {
          name: "Monthly",
          id: "",
          curr: "NGN",
          amount: "15000",
        },
        {
          name: "Annual",
          id: "",
          curr: "NGN",
          amount: "150000",
        },
      ]);
    } else {
      setPricing([
        {
          name: "Monthly",
          id: "",
          curr: "USD",
          amount: "8.99",
        },
        {
          name: "Annual",
          id: "",
          curr: "USD",
          amount: "89.99",
        },
      ]);
    }
    // const response = fetch(
    //   payWithNaira
    //     ? `${process.env.SERVER_URL}/create-subscription/paystack`
    //     : `${process.env.SERVER_URL}/create-subscription?country=${
    //         // session?.user?.user_metadata.country ?? "US"
    //         "US"
    //       }&interval=${"monthly"}`,
    //   {}
    // ).then(async (res) => {
    //   const data = await res.json();
    //   setLoading(false);
    //   setPricing([
    //     {
    //       name: "Monthly",
    //       id: data.id1,
    //       curr: data.currency,
    //       amount: data.price1,
    //     },
    //     {
    //       name: "Annual",
    //       id: data.id2,
    //       curr: data.currency,
    //       amount: data.price2,
    //     },
    //   ]);
    //   setPlan({
    //     name: "Annual",
    //     id: data.id2,
    //     curr: data.currency,
    //     amount: data.price2,
    //   });
    //   setX(true);
    // });
  }, [isLoading, payWithNaira]);

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

  // collect data from the user
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [PriceId, setPriceId] = useState();
  const [pricingText, setPricingText] = useState<string | undefined>();

  const stripe = useStripe();
  const elements = useElements();

  const [showLiked, setShowLiked] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !session?.user?.user_metadata.country) setShowCountry(true);
    else setShowCountry(false);
  }, [session?.user?.user_metadata.country]);

  const createSubscription = async () => {
    if (payWithNaira) {
      activityService.logAttemptedToPayUsingPaystack();
      // redirect("https://www.youtube.com/channel/UC3C0OxzGKuFKJUpv-Dn-6fA");
      location.href =
        "https://www.youtube.com/channel/UC3C0OxzGKuFKJUpv-Dn-6fA";
    } else {
      activityService.logAttemptedToPayUsingStripe();
      // redirect("https://vimeo.com/ondemand/withchude");
      location.href =
        "https://www.youtube.com/channel/UC3C0OxzGKuFKJUpv-Dn-6fA";
    }

    // if (payWithNaira) {
    //   setLoading(true);
    //   await fetch(
    //     `${process.env.SERVER_URL}/initialize-transaction-with-plan`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         email: Email,
    //         amount: Plan?.amount * 100,
    //         plan: Plan?.id,
    //         // plan: "PLN_t2k3anoy1pvcu9w",
    //         customer: session?.user?.user_metadata?.customer || "",
    //       }),
    //     }
    //   )
    //     .then((res) => {
    //       return res.json();
    //     })
    //     .then((data) => {
    //       activityService.logRedirectedToPaystackPaymentPage();
    //       window.location.href = data.authorization_url;
    //     })
    //     .catch((error) => {
    //       console.log("sub error: ", error);
    //       setShowLiked("An error occured");
    //       let liketimeout;
    //       clearTimeout(liketimeout);
    //       liketimeout = setTimeout(() => {
    //         gsap.to(".Vid__added", { opacity: 0 });
    //         setShowLiked("");
    //       }, 2500);
    //       setLoading(false);
    //     });
    //   return;
    // }
    // setLoading(true);
    // // create a payment method
    // const paymentMethod = await stripe?.createPaymentMethod({
    //   type: "card",
    //   card: elements?.getElement(CardElement)!,
    //   billing_details: {
    //     name: Name,
    //     email: Email,
    //   },
    // });

    // call the backend to create subscription
    // try {
    //   const response = await fetch(
    //     `${process.env.SERVER_URL}/create-subscription`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         paymentMethod: paymentMethod?.paymentMethod?.id,
    //         name: Name,
    //         email: Email,
    //         priceId: Plan?.id,
    //       }),
    //     }
    //   )
    //     .then(async (res) => {
    //       const resp = await res.json();
    //       // confirm the payment by the user
    //       const confirmPayment = await stripe?.confirmCardPayment(
    //         resp.clientSecret,
    //         {
    //           payment_method: paymentMethod?.paymentMethod?.id,
    //         }
    //       );
    //       if (confirmPayment.error) {
    //         setShowLiked(confirmPayment.error?.message || "An error occured");
    //         let liketimeout;
    //         clearTimeout(liketimeout);
    //         liketimeout = setTimeout(() => {
    //           gsap.to(".Vid__added", { opacity: 0 });
    //           setShowLiked("");
    //         }, 2500);
    //         setLoading(false);
    //       }
    //       if (confirmPayment.paymentIntent.status === "succeeded") {
    //         const { data, error } = await supabase.auth.updateUser({
    //           data: {
    //             subscriptionId: resp.subscriptionId,
    //             subscriptionStatus: "active",
    //             countryCode: session?.user?.user_metadata.country || country,
    //           },
    //         });
    //         await fetch(`${process.env.SERVER_URL}/payment-success`, {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({
    //             name: Name,
    //             email: Email,
    //             priceId: Plan?.id,
    //             plan: Plan.amount,
    //           }),
    //         });
    //         setShowLiked("Payment Successful");
    //         let liketimeout;
    //         clearTimeout(liketimeout);
    //         liketimeout = setTimeout(() => {
    //           gsap.to(".Vid__added", { opacity: 0 });
    //           setShowLiked("");
    //           navigate("/watch");
    //         }, 2500);
    //         setLoading(false);
    //       }
    //     })
    //     .catch((error2) => {
    //       setShowLiked("An error occured");
    //       let liketimeout;
    //       clearTimeout(liketimeout);
    //       liketimeout = setTimeout(() => {
    //         gsap.to(".Vid__added", { opacity: 0 });
    //         setShowLiked("");
    //       }, 2500);
    //       setLoading(false);
    //     });
    // } catch (error2) {
    //   setShowLiked("An error occured");
    //   let liketimeout;
    //   clearTimeout(liketimeout);
    //   liketimeout = setTimeout(() => {
    //     gsap.to(".Vid__added", { opacity: 0 });
    //     setShowLiked("");
    //   }, 2500);
    //   setLoading(false);
    // }
  };

  const [Plan, setPlan] = useState(pricing && pricing[1]);
  const [Currency, setCurrency] = useState(6689.89);
  const [loading, setLoading] = useState(true);
  const $stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  useEffect(() => {
    if (isLoading || (!pricing && pricing[0])) return;
    supabase.auth.getUser().then((y) => {
      // if (!y.data.user) {
      //   navigate("/")
      // }
    });
    setLoading(true);
    fetch(
      payWithNaira
        ? `${process.env.SERVER_URL}/retrieve/paystack`
        : `${process.env.SERVER_URL}/retrieve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.user_metadata?.subscriptionId || "",
          customer: session?.user?.user_metadata?.customer || "",
          email: session?.user?.email,
        }),
      }
    ).then(async (res) => {
      if (res.ok) {
        navigate("/payment/manage");
      }
    });

    // setName(user?.data?.user?.user_metadata?.name)
    // setEmail(user?.data?.user?.user_metadata?.email)
    setCurrency(Plan?.curr);
    setLoading(false);

    // if (!isLoading && session?.user)
    //   fetch(`${process.env.SERVER_URL}/welcome`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       name: session?.user?.user_metadata?.name,
    //       email: session?.user?.email,
    //     }),
    //   });
  }, [Plan, session?.user, isLoading]);

  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setName(user?.data?.user?.user_metadata?.name);
      setEmail(user?.data?.user?.user_metadata?.email);
    });
  }, []);

  // if (!pricing && pricing[0]) return

  return (
    <>
      <Helmet>
        <title>Payment | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="payment">
              <Header />
              <main>
                <div className="__payment" id="payment">
                  <NavLite page="Payment" />
                  {showLiked !== "" && (
                    <div className="Vid__added">
                      <p>{showLiked}</p>
                    </div>
                  )}
                  <div className="payment__body">
                    <div className="payment__body__left">
                      <h2>Get full access.</h2>
                      <p>
                        Every story told here helps someone feel seen, heard,
                        and whole.
                      </p>
                      <p>
                        By joining us, you're not just subscribing. You're
                        making space for more stories that matter—stories that
                        make Africa mentally, emotionally, and spiritually safe.
                      </p>
                      <p>Be part of this movement.</p>
                      <p>
                        For more payment options, kindly reach us at{" "}
                        <a href="mail:info@withchude.com.">
                          info@withchude.com.
                        </a>
                      </p>
                      <ul>
                        <li>
                          <RoundCheckSvg /> <span>Full Video catalogue</span>
                        </li>
                        <li>
                          <RoundCheckSvg /> <span>Full Podcasts catalogue</span>
                        </li>
                        <li>
                          <RoundCheckSvg /> <span>Full Films catalogue</span>
                        </li>
                        <li>
                          <RoundCheckSvg /> <span>Full Blog catalogue</span>
                        </li>
                        {/* <li>
                          <RoundCheckSvg /> <span>Full content catalogue</span>
                        </li> */}
                      </ul>
                    </div>
                    <div className="payment__body__right">
                      <h2>Pay with Card</h2>
                      {payWithNaira !== undefined && (
                        <div className="payment__switch">
                          <article
                            className={`flex-1 ${
                              payWithNaira === false ? "active" : ""
                            }`}
                            onClick={() => {
                              setPayWithNaira(false);
                              activityService.logSelectedStripePayment();
                            }}
                          >
                            <em></em>
                            <div>
                              <h5>Pay in Dollars</h5>
                            </div>
                          </article>
                          <article
                            className={`flex-1 ${payWithNaira ? "active" : ""}`}
                            onClick={() => {
                              setPayWithNaira(true);
                              activityService.logSelectedPaystackPayment();
                            }}
                          >
                            <em></em>
                            <div>
                              <h5>Pay in Naira</h5>
                            </div>
                          </article>
                        </div>
                      )}
                      <div className="payment__switch">
                        <article
                          className={`full-width ${
                            Plan?.name === "Annual" &&
                            payWithNaira !== undefined
                              ? "active"
                              : ""
                          }`}
                          onClick={() => {
                            setPlan(pricing && pricing[1]);
                            if (payWithNaira === undefined)
                              setPayWithNaira(false);
                            activityService.logSelectedYearlyPlan();
                          }}
                        >
                          <em></em>
                          <div>
                            <h5>Annual</h5>
                            <h4>
                              <i>
                                {getSymbolFromCurrency(Plan?.curr ?? "USD")}
                                {pricing && pricing.length
                                  ? pricing[1]?.amount?.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  : ""}
                              </i>
                              /year
                            </h4>
                            <p>
                              Most subscribers opt for the annual subscription
                              due to the benefit of uninterrupted watch times
                              plus two FREE months subscription.
                            </p>
                          </div>
                        </article>
                        <article
                          className={`flex-1 ${
                            Plan?.name === "Monthly" ? "active" : ""
                          }`}
                          onClick={() => {
                            setPlan(pricing && pricing[0]);
                            activityService.logSelectedMonthlyPlan();
                            if (payWithNaira === undefined)
                              setPayWithNaira(false);
                          }}
                        >
                          <em></em>
                          <div>
                            <h5>Monthly</h5>
                            <h4>
                              <i>
                                {getSymbolFromCurrency(Plan?.curr ?? "USD")}
                                {pricing && pricing.length
                                  ? pricing[0]?.amount?.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  : ""}
                              </i>
                              /month
                            </h4>
                          </div>
                        </article>
                        <Link
                          to="/contribute"
                          target="_blank"
                          className={`flex-1 payment_option`}
                          onClick={() => {
                            // navigate("/contribute", {
                            //   replace: true,
                            // });
                            setPayWithNaira(undefined);
                          }}
                        >
                          <em></em>
                          <div>
                            <h5>Support this work we are doing</h5>
                            {/* <h4>
                              <i>
                                {getSymbolFromCurrency(Plan?.curr ?? "USD")}
                                {pricing && pricing.length
                                  ? pricing[0]?.amount?.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ","
                                    )
                                  : ""}
                              </i>
                              /month
                            </h4> */}
                          </div>
                        </Link>
                      </div>
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
                      {payWithNaira ? (
                        <></>
                      ) : (
                        <>
                          {/* <label htmlFor="">Card Number</label>
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
                          /> */}
                        </>
                      )}
                      {
                      // !session.user ? (
                      //   <button
                      //     type="button"
                      //     onClick={() => {
                      //       setShowLogin(true);
                      //     }}
                      //   >
                      //     Login to pay
                      //   </button>
                      // ) : 
                      payWithNaira ? (
                        <button
                          type="button"
                          onClick={createSubscription}
                          disabled={payWithNaira === undefined}
                        >
                          {/* <Loading loading={loading || isLoading}> */}
                          {/* Pay with Paystack */}
                          Subscribe Now
                          {/* </Loading> */}
                        </button>
                      ) : (
                        <button
                          onClick={createSubscription}
                          disabled={
                            (!stripe && !elements?.getElement(CardElement)!) ||
                            payWithNaira === undefined
                          }
                        >
                          {/* <Loading loading={loading || isLoading}> */}
                          {/* Pay {Plan?.curr ?? "USD"} {"\t"}
                            {Plan?.amount ?? DEFAULT_AMOUNT} */}
                          Subscribe Now
                          {/* </Loading> */}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </main>
              <FooterLite />
            </div>
            <PostPage />
            {showCountry && session?.user && (
              <Popup
                Close={() => {
                  // setShowCountry(false)
                }}
              />
            )}
            {showLogin && (
              <AuthPopup
                Close={() => {
                  setShowLogin(false);
                  // navigate(-1);
                }}
              />
            )}
            <SupportPopup actionText="Proceed to Payment" document={document} />
          </div>
        </div>
      </motion.main>
    </>
  );
}

// const conversions = {
//   "Nigeria": "NGN",
//   "United Arab Emirates": "NGN",
// }
