import { PrismicRichText, useSinglePrismicDocument } from "@prismicio/react"
import { motion, usePresence } from "framer-motion"
import gsap from "gsap"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Scroll from "../../app/classes/scroll"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import Join from "../../components/Join"
import { NavLite } from "../../components/Nav"
import PostPage from "../../components/PostPage"
import PlaySvg from "../../icons/play"
import { PrismicDocument, asText } from "@prismicio/client"
import { getEmbed } from "../../app/utils"
import Loader from "../../components/Loading"
import { SessionContext } from "../../App"

export default function Films({ document }: PropsWithChildren<{ document: PrismicDocument }>) {
  const [isPresent, safeToRemove] = usePresence()
  const [url, setUrl] = useState("")
  const [Loading, setLoading] = useState(false)
  const session = useContext(SessionContext)

  useEffect(() => {
    if (!document) return
    window.$scroll = new Scroll("blog")
  }, [document])

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

  if (!document) return <></>

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
            <div className="content" id="content" data-template="films">
              <Header />
              <main>
                <div className="__films" id="films">
                  <NavLite page="Films" />
                  {url !== "" && (
                    <div className="film__preview">
                      <button onClick={() => setUrl("")}>Exit</button>
                      <video
                        src={url}
                        playsInline
                        controls
                        autoPlay={true}
                        onLoadStart={(e) => e.currentTarget.play()}
                        onLoadedMetadata={(e) => e.currentTarget.play()}
                        onLoad={(e) => e.currentTarget.play()}
                      ></video>
                      <p>{getEmbed(url)}</p>
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${getEmbed(url)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="films__body">
                    {document && (
                      <h4>
                        <PrismicRichText field={document.data.subtitle} />
                      </h4>
                    )}
                    {document?.data.films.map((data, key) => (
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
                    <h2>
                      Contribute towards our next film project - as we take risks to uncover the truths many don’t want you to
                      know. Please contribute <Link to={"/contribute"}>here</Link> and support the work. Thank you.
                    </h2>
                    {/* <h2>Critical Acclaim</h2>
                    <figure>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </figure> */}
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
  )
}
