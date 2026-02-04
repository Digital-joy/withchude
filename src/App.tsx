import { Analytics } from "@vercel/analytics/react";
import {
  PrismicProvider,
  usePrismicDocumentsByType,
  useSinglePrismicDocument,
} from "@prismicio/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Session, createClient } from "@supabase/supabase-js";
import { AnimatePresence } from "framer-motion";
import { get, set } from "idb-keyval";
import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import About from "./pages/About";
import AboutContact from "./pages/AboutContact";
import Article from "./pages/Article";
import Blog from "./pages/Blog";
import Books from "./pages/Books";
import Contact from "./pages/Contact";
import DefaultSite from "./pages/Defaultsite";
import Events from "./pages/Events";
import Films from "./pages/Films";
import Landing from "./pages/Landing";
import ListenLater from "./pages/ListenLater";
import Password from "./pages/Password";
import Payment from "./pages/old/Payment";
import PaymentManage from "./pages/PaymentManage";
import Podcasts from "./pages/Podcasts";
import Signup from "./pages/Signup";
import Studio from "./pages/Studio";
import Travelogue from "./pages/Travelogue";
import Video from "./pages/Video";
import Watch from "./pages/Watch";
import WatchTag from "./pages/WatchTag";
import { client, client2, client3 } from "./prismic";
import MasterClass from "./pages/MasterClass";
import MasterClassId from "./pages/MasterClassId";
import Course from "./pages/Course";
import Updates from "./pages/Updates";
import useGeoLocation from "react-ipgeolocation";
import { HelmetProvider } from "react-helmet-async";
import Terms from "./pages/Terms";
import TravelogueAll from "./pages/TravelogueAll";
import TravelogueFilms from "./pages/TravelogueFilms";
import StoreProvider from "./components/StoreProvider";
import Contribute from "./pages/Contribute";
import {
  checkFirstInteractionTime,
  firstInteractionTimeHasExceeded,
  firstInteractionTimeIsWithinLimits,
  getFirstInteractionTime,
  getSurveyPopupTime,
  surveyCompleted,
} from "./app/helpers/date-utils";
import SurveyPopup from "./components/popup/SurveyPopup";
import Toast, { showToaster } from "./components/Toast";
import { useAppDispatch, useAppSelector } from "./app/redux/hooks";
import { setToastProps, setToastShown } from "./app/redux/reducers/toastSlice";
import SharePopup from "./components/popup/SharePopup";
import { setShareShown } from "./app/redux/reducers/shareSlice";
import { MAX_PINNED_VIDEOS, slugify } from "./app/utils";
import Popup from "./components/Popup";
import { setLoginShown } from "./app/redux/reducers/loginSlice";
import { setVideoPopupShown } from "./app/redux/reducers/videoSlice";
import VideoPopup from "./components/popup/VIdeoPopup";
import { surveyService } from "./app/services/supabse";
import { setActiveSurvey } from "./app/redux/reducers/surveySlice";
import NewsletterPopup from "./components/popup/NewsletterPopup";
import { setNewsletterShown } from "./app/redux/reducers/newsletterSlice";
import ContactDetailsPopup from "./components/popup/ContactDetailsPopup";
import PaymentNew from "./pages/PaymentNew";
import PaymentManageNew from "./pages/PaymentManageNew";
import RedirectToExternal from "./components/RedirectToExternal";
import NewsletterUnsubscribe from "./pages/NewsletterUnsubscribe";
import IIYM from "./pages/IIYM";
import Eventi from "./pages/Eventi";
import TorontoEvent from "./pages/TorontoEvent";

const helmetContext = {};

const key = process.env.STRIPE_PUBLISHABLE_KEY;
export const stripePromise = loadStripe(key); // starts with pk_

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const SessionContext = createContext<Session & { isLocal: boolean }>(
  null
);

function createHomeSnippets(setLoading) {
  supabase
    .from("videos")
    .select()
    .is("deleted_at", null)
    .neq("url", "")
    .order("published", { ascending: false })
    .lte("published", new Date().toISOString())
    .then((data) => {
      localStorage.setItem("loaded", "x");
      if (!data.error) {
        const firstSnippets = data.data
          ?.sort(function (a, b) {
            if (a.published > b.published) {
              return -1;
            }
            if (a.published < b.published) {
              return 1;
            }
            return 0;
          })
          .filter((vid, index) => {
            return index === 0 || vid.favourite;
          })
          .filter((_, index) => index < MAX_PINNED_VIDEOS + 1);
        set(
          "homeSnippets",
          firstSnippets.length > MAX_PINNED_VIDEOS
            ? firstSnippets
                .filter((vid, index) => {
                  return vid.favourite;
                })
                .filter((_, index) => index < MAX_PINNED_VIDEOS)
            : firstSnippets
        );
      }
      setLoading((loading) => [...loading.slice(), Math.random()]);
    });
}

function createPodcasts(setLoading) {
  supabase
    .from("podcasts")
    .select()
    .order("published", { ascending: false })
    .lte("published", new Date().toISOString())
    .then((data) => {
      localStorage.setItem("loaded", "x");
      if (!data.error) {
        set(
          "podcasts",
          data?.data?.sort(function (a, b) {
            if (a.published > b.published) {
              return -1;
            }
            if (a.published < b.published) {
              return 1;
            }
            return 0;
          })
        );
      }
      setLoading((loading) => [...loading.slice(), Math.random()]);
    });
}

function createBlogs(setLoading) {
  supabase
    .from("blogs")
    .select()
    .order("published", { ascending: false })
    .lte("published", new Date().toISOString())
    .then((data) => {
      localStorage.setItem("loaded", "x");
      if (!data.error) {
        set(
          "blogs",
          data?.data?.sort(function (a, b) {
            if (a.published > b.published) {
              return -1;
            }
            if (a.published < b.published) {
              return 1;
            }
            return 0;
          })
        );
      }
      setLoading((loading) => [...loading.slice(), Math.random()]);
    });
}

function createVideos(setLoading) {
  supabase
    .from("videos")
    .select(
      `
      *,
      video_tags(tag_id, tags(name))
    `
    )
    .is("deleted_at", null)
    // .neq("url", "")
    .order("published", { ascending: false })
    .lte("published", new Date().toISOString())
    .then((d) => {
      // Motidy response such that tags names are added as property value
      d.data = d.data.map((video) => ({
        ...video,
        tags: video.video_tags.map((vt) => vt.tags.name), // Extract tag names
      }));

      return d;
    })
    .then((data) => {
      localStorage.setItem("loaded", "x");
      if (!data.error) {
        set(
          "videos",
          data?.data?.sort(function (a, b) {
            if (a.published > b.published) {
              return -1;
            }
            if (a.published < b.published) {
              return 1;
            }
            return 0;
          })
        );
      }
      setLoading((loading) => [...loading.slice(), Math.random()]);
    });
}

function createCourses(setLoading) {
  supabase
    .from("masterclass")
    .select()
    .neq("active", false)
    .order("created_at", { ascending: false })
    // .lte("published", new Date().toISOString())
    .then((data) => {
      localStorage.setItem("loaded", "x");
      if (!data.error) {
        set(
          "masterclass",
          data?.data?.sort(function (a, b) {
            if (a.created_at > b.created_at) {
              return -1;
            }
            if (a.created_at < b.created_at) {
              return 1;
            }
            return 0;
          })
        );
      }
      setLoading((loading) => [...loading.slice(), Math.random()]);
    });
}

const App = () => {
  useEffect(() => {
    if (localStorage.getItem("loaded") === "x") setLoading([1, 2, 3, 4, 5]);
    createHomeSnippets(setLoading);
    createPodcasts(setLoading);
    createVideos(setLoading);
    createBlogs(setLoading);
    createCourses(setLoading);
  }, []);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState([]);
  const { country, error, isLoading } = useGeoLocation();

  useEffect(() => {
    supabase.auth.updateUser({}).then(() => {});
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession({
          ...session,
          isLocal:
            (session && session?.user?.user_metadata.countryCode
              ? session?.user?.user_metadata.countryCode === "NG"
              : session?.user?.user_metadata.country === "NG") ||
            session?.user?.user_metadata.country === "NG",
        });
      }
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, []);
  if (loading.length < 5) return <></>;
  return (
    <>
      <Analytics />
      <StoreProvider>
        <HelmetProvider context={helmetContext}>
          <SessionContext.Provider value={{ ...session }}>
            <PrismicProvider client={client}>
              <BrowserRouter>
                <Inner />
              </BrowserRouter>
            </PrismicProvider>
          </SessionContext.Provider>
        </HelmetProvider>
      </StoreProvider>
    </>
  );
};

export default App;

function Inner() {
  const dispatch = useAppDispatch();
  const loginProps = useAppSelector((state) => state.login);
  const location = useLocation();
  const [films] = useSinglePrismicDocument("films");
  const [events] = useSinglePrismicDocument("events");
  const [eventi] = usePrismicDocumentsByType("eventi");
  const [studio] = useSinglePrismicDocument("studio");
  const [about] = useSinglePrismicDocument("about");
  const [faq] = useSinglePrismicDocument("faq");
  const [support] = useSinglePrismicDocument("support");
  const [terms] = useSinglePrismicDocument("terms");
  const [books] = useSinglePrismicDocument("books");
  const [blogs] = usePrismicDocumentsByType("article", {
    pageSize: 100,
    client: client2,
  });
  const [impact] = usePrismicDocumentsByType("impact", {
    pageSize: 100,
    client: client3,
  });
  const [travels] = usePrismicDocumentsByType("travelogue", {
    pageSize: 100,
    client: client3,
  });

  getSurveyPopupTime();

  const [copy, setCopy] = useState<any>();

  useEffect(() => {
    get("copy").then((data) => setCopy(data));
    // Check first interaction on component mount
    checkFirstInteractionTime();

    // Display any custom messages on toaster
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");

    if (message && message !== "") {
      dispatch(
        showToaster({
          show: true,
          persist: false,
          message: message,
          timeout: 5000,
        })
      );
      setTimeout(() => {
        dispatch(setToastShown(false));
      }, 5000);
    }

    // Set active survey
    surveyService.getEnabledSurvey().then((data) => {
      dispatch(setActiveSurvey(data));
    });

    // Listen for user interactions
    const handleActivity = () => {
      if (!surveyCompleted()) {
        checkFirstInteractionTime();
        // console.log({
        //   "first interaction": getFirstInteractionTime(),
        //   "within limits": firstInteractionTimeIsWithinLimits(),
        //   exceeded: firstInteractionTimeHasExceeded(),
        // });
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  useEffect(() => {
    if (
      !films ||
      !events ||
      !eventi ||
      !studio ||
      !about ||
      !faq ||
      !support ||
      !books ||
      !blogs ||
      !impact ||
      !travels ||
      !terms
    )
      return;
    set("copy", {
      films,
      events,
      eventi,
      studio,
      about,
      faq,
      support,
      books,
      blogs,
      impact,
      travels,
      terms,
    });
    setCopy({
      films,
      events,
      eventi,
      studio,
      about,
      faq,
      support,
      books,
      blogs,
      impact,
      travels,
      terms,
    });
  }, [
    films,
    events,
    studio,
    about,
    faq,
    support,
    books,
    blogs,
    impact,
    travels,
    terms,
  ]);

  return (
    <Elements stripe={stripePromise}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <Landing
                document={copy?.faq}
                blog={copy?.blogs?.results}
                books={copy?.books}
              />
            }
          />
          <Route path="/defaultsite" element={<DefaultSite />} />
          <Route
            path="/blog"
            element={<Blog document={copy?.blogs?.results} />}
          />
          <Route
            path="/updates"
            element={<Updates document={copy?.blogs?.results} />}
          />
          <Route
            path="/blog/:id"
            element={<Article document={copy?.blogs?.results} type="blog" />}
          />
          <Route
            path="/update/:id"
            element={<Article document={copy?.blogs?.results} type="update" />}
          />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/masterclass" element={<MasterClass />} />
          <Route path="/masterclass/:id" element={<MasterClassId />} />
          <Route path="/masterclass/:class/:id" element={<Course />} />
          <Route path="/listen-later" element={<ListenLater />} />
          <Route path="/podcasts/:id" element={<Podcasts />} />
          <Route
            path="/about"
            element={<AboutContact document={copy?.about} />}
          />
          <Route path="/films" element={<Films document={copy?.films} />} />
          <Route
            path="/studio"
            element={<Studio document={copy?.studio} testimonies={faq} />}
          />
          <Route path="/watch" element={<Watch />} />
          <Route path="/watch/tags/:id" element={<WatchTag />} />
          <Route path="/books" element={<Books document={copy?.books} />} />
          {/* <Route path="/shop" element={<Books document={copy?.books} />} /> */}
          <Route
            path="/shop"
            element={<RedirectToExternal url="https://shop.withchude.com" />}
          />
          {/* <Route path="/events" element={<Events document={copy?.events} />} /> */}
          <Route path="/events" element={<Eventi documents={copy?.eventi?.results} />} />
          <Route path="/events/toronto" element={<TorontoEvent documents={copy?.eventi?.results} />} />
          <Route path="/event" element={<Eventi documents={copy?.eventi?.results} />} />
          <Route path="/event/toronto" element={<TorontoEvent documents={copy?.eventi?.results} />} />
          <Route path="/watch/:id" element={<Video />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/impact"
            element={<Travelogue document={copy?.impact?.results} />}
          />
          <Route
            path="/impact/all"
            element={<TravelogueAll document={copy?.travels?.results} />}
          />
          <Route
            path="/impact/films"
            element={<TravelogueFilms document={copy?.films} />}
          />
          <Route
            path="/payment"
            element={<Payment document={copy?.support} />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/contribute"
            element={<Contribute document={copy?.support} />}
          />
          <Route
            path="/support"
            element={<Contribute document={copy?.support} />}
          />
          <Route path="/terms" element={<Terms document={copy?.terms} />} />
          <Route path="/payment/manage" element={<PaymentManageNew />} />
          <Route path="/diezani" element={<IIYM />} />
          <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
          <Route path="/settings" element={<Password />} />
        </Routes>
        <SurveyPopup />
        <NewsletterPopup onClose={() => dispatch(setNewsletterShown(false))} />
        <ContactDetailsPopup
          onClose={() => dispatch(setNewsletterShown(false))}
        />
        <SharePopup onClose={() => dispatch(setShareShown(false))} />
        <VideoPopup onClose={() => dispatch(setVideoPopupShown(false))} />
        <Toast style={{ background: "#f8a519" }} />
        {loginProps.show && (
          <Popup
            Close={() => {
              // setShowLogin(false)
              dispatch(setLoginShown(false));
            }}
          />
        )}
      </AnimatePresence>
    </Elements>
  );
}

const test = {
  id: "pm_1PUYyZKy2isPjDAkmFe9wkJf",
  object: "payment_method",
  allow_redisplay: "unspecified",
  billing_details: {
    address: {
      city: null,
      country: null,
      line1: null,
      line2: null,
      postal_code: "11838",
      state: null,
    },
    email: "slnlsnsl@sjnsk.com",
    name: "sknsknsk",
    phone: null,
  },
  card: {
    brand: "visa",
    checks: {
      address_line1_check: null,
      address_postal_code_check: null,
      cvc_check: null,
    },
    country: "US",
    display_brand: "visa",
    exp_month: 4,
    exp_year: 2026,
    funding: "credit",
    generated_from: null,
    last4: "4242",
    networks: {
      available: ["visa"],
      preferred: null,
    },
    three_d_secure_usage: {
      supported: true,
    },
    wallet: null,
  },
  created: 1719082071,
  customer: null,
  livemode: false,
  radar_options: {},
  type: "card",
};
