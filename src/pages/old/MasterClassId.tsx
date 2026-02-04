import { motion, usePresence } from "framer-motion"
import gsap from "gsap"
import { get } from "idb-keyval"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { SessionContext, supabase } from "../../App"
import Scroll from "../../app/classes/scroll"
import { toTime } from "../../app/utils"
import { FooterLite } from "../../components/Footer"
import Header from "../../components/Header"
import Loader from "../../components/Loading"
import { NavLiteBlog } from "../../components/Nav"
import Popup from "../../components/Popup"
import PostPage from "../../components/PostPage"

import Comment from "../../components/Comment"
import { User } from "@supabase/supabase-js"
import SendAltEmoji from "../../icons/send-alt"
import { Helmet } from "react-helmet-async"

export default function MasterClassId() {
  useEffect(() => {
    window.$scroll = new Scroll("studio")
  }, [])

  const [isPresent, safeToRemove] = usePresence()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [Search, setSearch] = useState("")
  const [Tab, setTab] = useState(1)
  const [loading, setLoading] = useState(false)

  const [$vid, set$vid] = useState()
  const session = useContext(SessionContext)

  const Next = () => {}

  async function CheckUser() {}

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

  const [scroll, setScroll] = useState(-1)
  const [Course, setCourse] = useState<any>({})
  const [Modules, setModules] = useState<any>({})
  const [User, setUser] = useState(null)
  const params = useParams()
  const [Later, setLater] = useState(false)

  useEffect(() => {
    setLater(!!(session?.user?.user_metadata[params.id + "later"] === "later"))
  }, [session?.user])

  useEffect(() => {
    get("masterclass").then((data) => {
      if (!data.filter((x) => x.id === params?.id)[0]) {
        navigate("/masterclass")
      }
      setCourse(data.filter((x) => x.id === params?.id)[0])
    })

    supabase
      .from("modules")
      .select()
      .eq("class", params?.id)
      .then((data) => setModules(data.data))
    setUser(session?.user)
  }, [session?.user])

  const [comment, setComment] = useState("")
  const [$Comments, set$Comments] = useState([])

  function deleteComment(id: string) {
    set$Comments($Comments.slice().filter((comment) => comment.uid !== id))
  }

  useEffect(() => {
    if ($Comments[0]) return
    if (!params.id) return
    supabase
      .from("comments")
      .select()
      .eq("blog", params.id)
      .then((data) => {
        set$Comments(data.data.slice().reverse())
      })
  }, [params.id])

  useEffect(() => {
    setUser(session?.user)
  }, [session?.user])

  return (
    <>
      <Helmet>
        <title>{`WithChude - Masterclass | ${Course.title}`}</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="podcasts">
              <Header />
              <main className={session?.user?.user_metadata[params.id]?.includes("rent") && "bought"}>
                <div className="__podcasts" id="podcasts">
                  <NavLiteBlog page1="Masterclass" page2={Course.title} />
                  <div className="course">
                    <div className="course__left">
                      <figure>
                        <img src={Course?.thumbnail} alt="" />
                      </figure>
                      <h3>{Course.title}</h3>
                      <aside>
                        <img src="/images/chude.png" alt="" />
                        <h5>Chude Jideonwo</h5>
                      </aside>
                      <aside className="course__sort">
                        <button
                          className={Tab === 0 ? "active" : ""}
                          onClick={() => {
                            setTab(0)
                          }}
                        >
                          Overview
                        </button>
                        <button
                          className={Tab === 1 ? "active" : ""}
                          onClick={() => {
                            setTab(1)
                          }}
                        >
                          Lessons
                        </button>
                      </aside>
                      <article className="course__details">
                        <h3>Course Modules</h3>
                        {Tab === 0 ? (
                          <h4 dangerouslySetInnerHTML={{ __html: Course.description }}></h4>
                        ) : (
                          <div>
                            {Modules &&
                              Modules[0] &&
                              Modules.map((mod, key) => (
                                <h6 key={key} className="course__module__item">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M20.245 10.2984L9.05099 3.38443C7.71854 2.56145 6 3.51992 6 5.08603V18.914C6 20.4801 7.71854 21.4385 9.05098 20.6156L20.245 13.7016C21.5104 12.9201 21.5104 11.0799 20.245 10.2984Z"
                                      stroke="#787878"
                                      strokeWidth="2"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <div>
                                    <span>
                                      {mod.index}. {mod.title[1] ? mod.title : Course.title}
                                      {session?.user?.user_metadata[params.id]?.includes("rent") && (
                                        <Link to={location.pathname + "/" + mod.id} className="play">
                                          Play
                                        </Link>
                                      )}
                                    </span>
                                    <span>{toTime(mod.metadata?.duration)}</span>
                                  </div>
                                </h6>
                              ))}
                          </div>
                        )}
                      </article>
                    </div>

                    {!session?.user?.user_metadata[params.id]?.includes("rent") && Modules && Modules[0] && (
                      <div className="course__right">
                        <p>Full Course</p>
                        <h2>${Course.price}</h2>
                        <h5>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M20.245 10.2984L9.05099 3.38443C7.71854 2.56145 6 3.51992 6 5.08603V18.914C6 20.4801 7.71854 21.4385 9.05098 20.6156L20.245 13.7016C21.5104 12.9201 21.5104 11.0799 20.245 10.2984Z"
                              stroke="#787878"
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {JSON.stringify(
                            Math.round(
                              Modules?.map((x) => x.metadata?.duration).reduce((partialSum, a) => partialSum + a, 0) / 60 / 60
                            )
                          )}{" "}
                          hour
                          {Math.round(
                            Modules?.map((x) => x.metadata?.duration).reduce((partialSum, a) => partialSum + a, 0) / 60 / 60
                          ) > 1
                            ? "s"
                            : ""}{" "}
                          of on-demand video
                        </h5>
                        <div>
                          <Link
                            to={""}
                            onClick={async (e) => {
                              const user = session?.user

                              if (!user) {
                                // set$vid(podcast)
                                setShowLogin(true)
                                // setActive(0)
                              } else {
                                try {
                                  e.preventDefault()
                                  setLoading(true)
                                  const paymentIntent = await fetch(`${process.env.SERVER_URL}/rentt`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      name: Course.title,
                                      amount: Course.price,
                                      id: params.id,
                                      desc: Course.description,
                                      token: session.access_token,
                                      refresh: session.refresh_token,
                                    }),
                                  })
                                  if (paymentIntent.ok) {
                                    const json = await paymentIntent.json()
                                    location.assign(json.url)
                                    setLoading(false)
                                  } else {
                                    // setShowLiked("An error occured")
                                    // let liketimeout
                                    // clearTimeout(liketimeout)
                                    // liketimeout = setTimeout(() => {
                                    //   gsap.to(".Vid__added", { opacity: 0 })
                                    //   setShowLiked("")
                                    // }, 2500)
                                    setLoading(false)
                                  }
                                } catch {
                                  setLoading(false)
                                }
                              }
                            }}
                          >
                            <Loader loading={loading}>Buy Now</Loader>
                          </Link>
                          <article
                            onClick={async (e) => {
                              const data = {}
                              e.preventDefault()
                              e.stopPropagation()
                              if (!Later) {
                                data[params.id + "later"] = "later"
                                const { data: res, error } = await supabase.auth.updateUser({
                                  data,
                                })
                                setLater(true)
                              } else {
                                data[params.id + "later"] = null
                                const { data: res, error } = await supabase.auth.updateUser({
                                  data,
                                })
                                setLater(false)
                              }
                            }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill={Later ? "black" : "none"}
                              style={{ cursor: "pointer" }}
                            >
                              <path
                                d="M19.5 19.0807V7.3C19.5 5.61984 19.5 4.77976 19.173 4.13803C18.8854 3.57354 18.4265 3.1146 17.862 2.82698C17.2202 2.5 16.3802 2.5 14.7 2.5H9.3C7.61984 2.5 6.77976 2.5 6.13803 2.82698C5.57354 3.1146 5.1146 3.57354 4.82698 4.13803C4.5 4.77976 4.5 5.61984 4.5 7.3V19.0807C4.5 20.4418 4.5 21.1224 4.75754 21.4078C4.98055 21.655 5.31196 21.775 5.64152 21.7279C6.0221 21.6735 6.45779 21.1507 7.32916 20.105L10.7708 15.975C11.193 15.4685 11.404 15.2152 11.6567 15.1228C11.8784 15.0418 12.1216 15.0418 12.3433 15.1228C12.596 15.2152 12.807 15.4685 13.2292 15.975L16.6708 20.105C17.5422 21.1507 17.9779 21.6735 18.3585 21.7279C18.688 21.775 19.0194 21.655 19.2425 21.4078C19.5 21.1224 19.5 20.4418 19.5 19.0807Z"
                                stroke="black"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </article>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="Vid__Comments__wrapper">
                    <div className="Vid__Comments">
                      <h4>Comments</h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          supabase
                            .from("comments")
                            .insert([
                              {
                                by: User.user_metadata.name ?? "Anonymous",
                                text: comment,
                                blog: params.id,
                              },
                            ])
                            .select()
                            .then((data) => {
                              set$Comments([...data.data, ...$Comments])
                              setComment("")
                            })
                        }}
                      >
                        <textarea
                          placeholder="Start typing to add a comment..."
                          name="comment"
                          id="comment"
                          value={comment}
                          onInput={(e) => setComment(e.currentTarget.value)}
                        ></textarea>
                        {/* <EmojiIcon /> */}
                        {comment[0] && (
                          <button>
                            <span>Post</span>
                            <SendAltEmoji />
                            {/* <EmojiPicker /> */}
                          </button>
                        )}
                      </form>
                      {$Comments.map(({ by, created_at, text, uid }) => (
                        <Comment key={uid} name={by} time={created_at} comment={text} id={uid} deleteComment={deleteComment} />
                      ))}
                    </div>
                  </div>
                </div>
              </main>
              <FooterLite />
            </div>
            <PostPage />
            {showLogin && (
              <Popup
                Close={() => {
                  setShowLogin(false)
                }}
                Next={Next}
              />
            )}
          </div>
        </div>
      </motion.main>
    </>
  )
}
