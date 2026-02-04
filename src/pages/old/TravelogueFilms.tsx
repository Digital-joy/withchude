import { motion, usePresence } from "framer-motion"
import gsap from "gsap"
import { InertiaPlugin } from "gsap-trial/all"
import { Draggable } from "gsap/all"
import { PropsWithChildren, useCallback, useContext, useEffect, useState } from "react"
import Scroll from "../../app/classes/scroll"
import Header from "../../components/Header"
import PostPage from "../../components/PostPage"
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent, useMapEvents } from "react-leaflet"
import { PrismicDocument, asText } from "@prismicio/client"
import { Link } from "react-router-dom"
import { FooterLite } from "../../components/Footer"
import ThreadSvg from "../../icons/thread"
import XSvg from "../../icons/x"
import FbSvg from "../../icons/fb"
import IgSvg from "../../icons/ig"
import YoutubeSvg from "../../icons/youtube"
import { PrismicRichText } from "@prismicio/react"
import PlaySvg from "../../icons/play"
import { SessionContext } from "../../App"
import Loader from "../../components/Loading"

gsap.registerPlugin(Draggable, InertiaPlugin)

export default function TravelogueFilms({ document }: PropsWithChildren<{ document: PrismicDocument }>) {
  useEffect(() => {
    if (!document) return
    window.$scroll = new Scroll("noscroll")
  }, [document])

  const [isPresent, safeToRemove] = usePresence()
  const session = useContext(SessionContext)
  const [Loading, setLoading] = useState(false)
  const [Subscriber, setSubscriber] = useState(false)

  useEffect(() => {
    if (!session?.user) return
    const response = fetch(
      session.isLocal
        ? `${process.env.SERVER_URL}/retrieve/paystack`
        : `${process.env.SERVER_URL}/retrieve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: session?.user?.user_metadata?.subscriptionId || "",
          email: session?.user?.email,
        }),
      }
    ).then(async (res) => {
      if (res.ok) {
        setSubscriber(true)
      } else {
        setSubscriber(false)
      }
    })
  }, [session])

  useEffect(() => {
    if (!isPresent) {
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true })
          safeToRemove()
        },
      })
      //      .to(".PostPage", { scaleY: 1, duration: 1, ease: "expo" }, 0)
    }
  }, [isPresent])

  const [Side, setSide] = useState<any>(null)

  return (
    <>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="travel">
              <div className="travel__header">
                <Link to="/impact">
                  <button onClick={() => setSide(null)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M5.83629 12.1641L3.08384 9.41162C2.30279 8.63057 2.30278 7.36424 3.08383 6.58319L5.83629 3.83073M2.83629 7.9974L13.503 7.9974"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Back
                  </button>
                </Link>
                <Link to={"/"}>
                  <svg width="91" height="29" viewBox="0 0 91 29" fill="none" className="Nav__logo">
                    <ellipse cx="77.25" cy="14.375" rx="3.5" ry="4.375" fill="#F8A519" />
                    <path
                      d="M1.649 19L2.652 15.447H0.51L0.612 14.325H2.975L3.791 11.571H1.513L1.615 10.466H4.097L5.117 6.862H6.341L5.304 10.466H7.752L8.806 6.862H9.962L8.942 10.466H11.118L10.999 11.571H8.602L7.803 14.325H10.149L10.047 15.447H7.48L6.46 19H5.236L6.307 15.447H3.859L2.822 19H1.649ZM4.182 14.325H6.63L7.395 11.571H4.964L4.182 14.325Z"
                      fill="black"
                    />
                    <path
                      d="M14.587 7.95C14.587 8.21067 14.6493 8.53367 14.774 8.919C14.8987 9.30433 14.978 9.55933 15.012 9.684C15.1367 10.058 15.267 10.449 15.403 10.857L17.766 18.014L19.993 11.044C19.3697 9.23067 18.9333 8.16533 18.684 7.848C18.582 7.73467 18.4403 7.627 18.259 7.525C18.089 7.41167 17.9247 7.34933 17.766 7.338C17.6073 7.31533 17.3863 7.304 17.103 7.304L17.069 7.1H21.642L21.608 7.304C21.166 7.304 20.86 7.34933 20.69 7.44C20.52 7.51933 20.435 7.729 20.435 8.069C20.435 8.39767 20.6957 9.327 21.217 10.857L23.614 18.014L25.858 10.857C26.3 9.429 26.521 8.46 26.521 7.95C26.521 7.68933 26.4133 7.51933 26.198 7.44C25.994 7.34933 25.671 7.304 25.229 7.304L25.195 7.1H29.326L29.309 7.304C28.7423 7.304 28.323 7.37767 28.051 7.525C27.779 7.661 27.5183 7.967 27.269 8.443C27.0197 8.919 26.7137 9.72367 26.351 10.857L23.75 19.085H22.662L20.197 11.741L17.919 19.085H16.848L14.094 10.857C13.788 9.939 13.5557 9.28167 13.397 8.885C13.2497 8.477 13.0627 8.137 12.836 7.865C12.6207 7.58167 12.411 7.41733 12.207 7.372C12.003 7.32667 11.6913 7.304 11.272 7.304L11.238 7.1H15.811L15.777 7.304C15.335 7.304 15.0233 7.34367 14.842 7.423C14.672 7.50233 14.587 7.678 14.587 7.95Z"
                      fill="black"
                    />
                    <path
                      d="M29.417 10.959V16.195C29.417 17.385 29.485 18.116 29.621 18.388C29.7683 18.66 30.1763 18.796 30.845 18.796L30.879 19H26.731L26.765 18.796C27.445 18.796 27.8587 18.66 28.006 18.388C28.1533 18.1047 28.227 17.3623 28.227 16.161V14.971C28.227 13.271 28.142 12.2453 27.972 11.894C27.9153 11.7693 27.8133 11.656 27.666 11.554C27.53 11.452 27.377 11.3897 27.207 11.367C27.0483 11.3443 26.8273 11.333 26.544 11.333L26.51 11.146C27.496 11.0213 28.465 10.959 29.417 10.959Z"
                      fill="black"
                    />
                    <path
                      d="M32.992 10.959H35.083V11.333H32.992V17.81C32.992 18.048 33.0487 18.2407 33.162 18.388C33.2753 18.524 33.4227 18.592 33.604 18.592C34.012 18.592 34.4937 18.473 35.049 18.235L35.083 18.422C34.2897 18.9207 33.587 19.17 32.975 19.17C32.5783 19.17 32.2837 19.0737 32.091 18.881C31.8983 18.6883 31.802 18.354 31.802 17.878V11.333H30.782V10.959C31.394 10.959 31.819 10.789 32.057 10.449C32.3063 10.0977 32.4933 9.582 32.618 8.902L32.992 8.868V10.959Z"
                      fill="black"
                    />
                    <path
                      d="M36.5195 6.488V13.832C36.6215 13.016 36.9048 12.3077 37.3695 11.707C37.8342 11.095 38.4518 10.789 39.2225 10.789C40.9565 10.789 41.8235 11.6957 41.8235 13.509V16.195C41.8235 17.3737 41.8972 18.1047 42.0445 18.388C42.2032 18.66 42.6112 18.796 43.2685 18.796L43.3025 19H39.1715L39.2055 18.796C39.8855 18.796 40.2935 18.6543 40.4295 18.371C40.5655 18.0877 40.6335 17.3113 40.6335 16.042V13.679C40.6335 12.897 40.5088 12.3077 40.2595 11.911C40.0215 11.5143 39.6362 11.316 39.1035 11.316C38.5822 11.316 38.1458 11.4973 37.7945 11.86C37.4432 12.2113 37.1825 12.659 37.0125 13.203C36.6838 14.257 36.5195 15.3167 36.5195 16.382C36.5195 17.4473 36.5875 18.116 36.7235 18.388C36.8708 18.66 37.2788 18.796 37.9475 18.796L37.9815 19H33.8335L33.8675 18.796C34.5475 18.796 34.9612 18.66 35.1085 18.388C35.2558 18.1047 35.3295 17.3623 35.3295 16.161V10.5C35.3295 8.8 35.2502 7.78 35.0915 7.44C35.0235 7.304 34.9158 7.185 34.7685 7.083C34.6325 6.981 34.4795 6.91867 34.3095 6.896C34.1508 6.87333 33.9298 6.862 33.6465 6.862L33.6125 6.675C34.5985 6.55033 35.5675 6.488 36.5195 6.488Z"
                      fill="black"
                    />
                    <path
                      d="M50.6481 5.995C51.2375 5.995 51.7701 6.04033 52.2461 6.131C52.7335 6.22167 53.2435 6.335 53.7761 6.471L54.1331 6.556L53.9801 9.412H52.6371L52.0761 7.882C51.8268 7.68933 51.5605 7.54767 51.2771 7.457C50.9938 7.355 50.5575 7.304 49.9681 7.304C49.2428 7.304 48.5968 7.51933 48.0301 7.95C47.4635 8.36933 47.0215 8.95867 46.7041 9.718C46.3981 10.4773 46.2451 11.35 46.2451 12.336C46.2451 13.3447 46.3925 14.2853 46.6871 15.158C46.9931 16.0193 47.4408 16.7163 48.0301 17.249C48.6308 17.7703 49.3448 18.031 50.1721 18.031C51.3395 18.031 52.0931 17.7533 52.4331 17.198L53.0281 15.753H54.1501V18.456C54.0141 18.456 53.8441 18.49 53.6401 18.558C53.4361 18.626 53.3115 18.6657 53.2661 18.677C52.6655 18.847 52.1158 18.983 51.6171 19.085C51.1185 19.187 50.5348 19.238 49.8661 19.238C48.6535 19.238 47.5768 18.983 46.6361 18.473C45.6955 17.9517 44.9588 17.2207 44.4261 16.28C43.9048 15.328 43.6441 14.2343 43.6441 12.999C43.6441 11.6503 43.9558 10.4433 44.5791 9.378C45.2138 8.31267 46.0638 7.48533 47.1291 6.896C48.2058 6.29533 49.3788 5.995 50.6481 5.995Z"
                      fill="black"
                    />
                    <path
                      d="M56.2053 17.946V7.117L54.8793 6.76V5.859L57.8713 5.502L58.2963 5.672L58.2793 9.48L58.1943 10.721C58.6477 10.3357 59.1633 10.041 59.7413 9.837C60.3193 9.62167 60.8633 9.514 61.3733 9.514C62.1327 9.514 62.7107 9.67267 63.1073 9.99C63.5153 10.3073 63.793 10.7777 63.9403 11.401C64.0877 12.0243 64.1557 12.8573 64.1443 13.9V17.946L65.3343 18.133V19H60.7273V18.133L62.0533 17.946V14.512C62.0533 13.628 62.0193 12.948 61.9513 12.472C61.8833 11.9847 61.719 11.6107 61.4583 11.35C61.1977 11.078 60.7953 10.942 60.2513 10.942C59.4807 10.942 58.829 11.1347 58.2963 11.52V17.946L59.3503 18.133V19H54.9813V18.133L56.2053 17.946Z"
                      fill="black"
                    />
                    <path
                      d="M63.9072 10.857V10.075L66.4232 9.514L66.7632 9.667V15.396C66.7632 16.28 66.8708 16.9147 67.0862 17.3C67.3128 17.674 67.7378 17.861 68.3612 17.861C68.7238 17.861 69.0978 17.7817 69.4832 17.623C69.8798 17.4643 70.1688 17.3 70.3502 17.13V11.316L69.3132 10.942V10.092L72.0842 9.514L72.3902 9.65V18.133H73.3762V18.881C73.2062 18.983 72.9285 19.0737 72.5432 19.153C72.1578 19.2323 71.8235 19.272 71.5402 19.272C71.2342 19.272 70.9905 19.204 70.8092 19.068C70.6392 18.9433 70.5542 18.7507 70.5542 18.49V17.929C70.1575 18.3143 69.6928 18.6203 69.1602 18.847C68.6275 19.0737 68.1175 19.187 67.6302 19.187C66.8142 19.187 66.1965 19.0397 65.7772 18.745C65.3692 18.439 65.0972 18.0197 64.9612 17.487C64.8252 16.9543 64.7515 16.2517 64.7402 15.379V11.231L63.9072 10.857Z"
                      fill="black"
                    />
                    <path
                      d="M81.3396 5.706V18.133H82.4786V18.864C82.2746 18.9773 81.9856 19.0737 81.6116 19.153C81.2376 19.2323 80.8522 19.272 80.4556 19.272C80.0929 19.272 79.8322 19.204 79.6736 19.068C79.5149 18.932 79.4129 18.694 79.3676 18.354C79.1182 18.5807 78.7442 18.7847 78.2456 18.966C77.7582 19.136 77.2199 19.221 76.6306 19.221C75.9392 19.221 75.3102 19.034 74.7436 18.66C74.1769 18.286 73.7236 17.7477 73.3836 17.045C73.0549 16.331 72.8906 15.4867 72.8906 14.512C72.8906 13.5373 73.1116 12.6647 73.5536 11.894C74.0069 11.1233 74.6132 10.5227 75.3726 10.092C76.1432 9.65 76.9876 9.429 77.9056 9.429C78.4156 9.429 78.8632 9.48567 79.2486 9.599V7.117L77.4466 6.76V5.859L80.8976 5.502L81.3396 5.706ZM77.6846 10.415C77.2312 10.415 76.8006 10.5567 76.3926 10.84C75.9846 11.1233 75.6502 11.5427 75.3896 12.098C75.1402 12.6533 75.0156 13.3277 75.0156 14.121C75.0156 14.8917 75.1232 15.5717 75.3386 16.161C75.5539 16.7503 75.8486 17.2037 76.2226 17.521C76.6079 17.8383 77.0386 17.997 77.5146 17.997C77.8546 17.997 78.1776 17.9517 78.4836 17.861C78.8009 17.7703 79.0616 17.64 79.2656 17.47V10.942C78.8689 10.5907 78.3419 10.415 77.6846 10.415Z"
                      fill="black"
                    />
                    <path
                      d="M86.7637 9.429C87.8517 9.429 88.696 9.752 89.2967 10.398C89.9087 11.044 90.2147 11.9507 90.2147 13.118C90.2147 13.6167 90.175 14.087 90.0957 14.529H84.0947C84.1173 15.583 84.3837 16.4047 84.8937 16.994C85.415 17.5833 86.1517 17.878 87.1037 17.878C87.523 17.878 87.9707 17.8327 88.4467 17.742C88.9227 17.64 89.308 17.5153 89.6027 17.368L89.9597 18.184C89.597 18.5013 89.07 18.7563 88.3787 18.949C87.6873 19.1303 87.0017 19.221 86.3217 19.221C84.939 19.2097 83.868 18.779 83.1087 17.929C82.3493 17.079 81.9697 15.923 81.9697 14.461C81.9697 13.4977 82.1737 12.6363 82.5817 11.877C82.9897 11.1063 83.5563 10.5057 84.2817 10.075C85.007 9.64433 85.8343 9.429 86.7637 9.429ZM86.3727 10.432C85.7493 10.432 85.2337 10.687 84.8257 11.197C84.429 11.707 84.191 12.4437 84.1117 13.407H88.0897C88.101 13.2823 88.1067 13.0953 88.1067 12.846C88.1067 12.0073 87.9253 11.418 87.5627 11.078C87.336 10.6473 86.9393 10.432 86.3727 10.432Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </div>
              <main>
                <div className="__travel" id="travel">
                  <div className="travel__body full">
                    <h1>Our Groundbreaking Immersion Journalism Project</h1>
                    <div className="travel__left full _films">
                      {document && (
                        <h4>
                          <PrismicRichText field={document.data.impact_subtitle} />
                        </h4>
                      )}
                      {document?.data.films
                        .filter((data) => data.show_on_impact_page)
                        .map((data, key) => (
                          <div key={key}>
                            <img src={data.cover?.url?.split("?")[0] ?? "/images/soon.png"} alt="" />
                            <aside>
                              <h3>{data.title[0]?.text}</h3>
                              <PrismicRichText field={data.details} />
                              <div className="ctas">
                                {data.trailer?.url && (
                                  <Link to={data.trailer?.url} target="_blank">
                                    <PlaySvg />
                                    <span>Play Trailer</span>
                                  </Link>
                                )}
                                {data.url?.url && data.price && data.price > 0 && (
                                  <>
                                    {session?.user?.user_metadata[data.url?.url?.split("/")?.pop()]?.includes("rent") ||
                                    Subscriber ? (
                                      <Link to={data.url?.url}>
                                        <PlaySvg />
                                        <span>Watch Now</span>
                                      </Link>
                                    ) : (
                                      <a
                                        href="/films"
                                        onClick={async (e) => {
                                          e.preventDefault()
                                          setLoading(true)
                                          const paymentIntent = await fetch(`${process.env.SERVER_URL}/rent`, {
                                            method: "POST",
                                            headers: {
                                              "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                              name: data.title[0]?.text,
                                              amount: data.price,
                                              id: data.url?.url?.split("/").pop(),
                                              desc: asText(data.details),
                                              token: session.access_token,
                                              refresh: session.refresh_token,
                                            }),
                                          })
                                          if (paymentIntent.ok) {
                                            const json = await paymentIntent.json()
                                            location.assign(json.url)
                                            setLoading(false)
                                          } else {
                                            setLoading(false)
                                          }
                                        }}
                                      >
                                        <Loader loading={Loading}>
                                          <span>Buy Film - ${data.price}</span>
                                        </Loader>
                                      </a>
                                    )}
                                  </>
                                )}
                              </div>
                            </aside>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </main>
              <div className="travel__footer">
                <svg className="travel__footer__before" width="1440" height="21" viewBox="0 0 1440 21" fill="none">
                  <g clip-path="url(#clip0_2280_928)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M18.5 -16H0V2.5V21H18.5C8.28276 21 0 12.7173 0 2.5C0 -7.71727 8.28273 -16 18.5 -16ZM1421.5 -16C1431.72 -16 1440 -7.71727 1440 2.5C1440 12.7173 1431.72 21 1421.5 21H1440V2.5V-16H1421.5Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2280_928">
                      <rect width="1440" height="21" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <section className="FooterLite">
                  <div className="Footer__footer">
                    <div className="Footer__footer__links">
                      <Link to="/impact/all">Our Africa-Wide Work</Link>
                      <Link to="/impact/films">Our Groundbreaking Immersion Journalism Project</Link>
                    </div>
                    <div className="Footer__footer__socials">
                      <a href="https://t.me/WithChude_Community" target="_blank" rel="noopener noreferrer">
                        <ThreadSvg />
                      </a>
                      <a href="https://x.com/chude" target="_blank" rel="noopener noreferrer">
                        <XSvg />
                      </a>
                      <a href="https://web.facebook.com/WithChude" target="_blank" rel="noopener noreferrer">
                        <FbSvg />
                      </a>
                      <a href="https://www.instagram.com/chudeity" target="_blank" rel="noopener noreferrer">
                        <IgSvg />
                      </a>
                      <a href="https://www.youtube.com/@WithChude" target="_blank" rel="noopener noreferrer">
                        <YoutubeSvg />
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  )
}

const RecenterAutomatically = ({ lat, lng, Side }) => {
  const map = useMap()
  useEffect(() => {
    if (!Side) map.closePopup()
    map.panTo([lat, lng])
  }, [lat, lng, Side])
  return null
}
