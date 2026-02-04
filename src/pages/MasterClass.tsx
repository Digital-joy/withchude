import { motion, usePresence } from "framer-motion"
import gsap from "gsap"
import React, { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SessionContext, supabase } from "../App"
import Scroll from "../app/classes/scroll"
import Audio from "../components/Audio"
import Footer, { FooterLite } from "../components/Footer"
import Header from "../components/Header"
import { NavLite } from "../components/Nav"
import PodcastsHero from "../components/PodcastsHero"
import PodcastsSection from "../components/PodcastsSection"
import Popup from "../components/Popup"
import PostPage from "../components/PostPage"
import { Searcher } from "../components/Searcher"
import { get } from "idb-keyval"
import CourseItem from "../components/Course"
import { Helmet } from "react-helmet-async"

export default function MasterClass() {
  useEffect(() => {
    window.$scroll = new Scroll("studio")
  }, [])

  const [isPresent, safeToRemove] = usePresence()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [Search, setSearch] = useState("")
  const [Tab, setTab] = useState(0)

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
  const [Courses, setCourses] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    get("masterclass").then((data) => {
      setCourses(data)
    })
    setUser(session?.user)
  }, [session?.user])

  return (
    <>
      <Helmet>
        <title>Masterclass | WithChude</title>
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
              <main>
                <div className="__podcasts" id="podcasts">
                  <NavLite page="Masterclasses" />
                  <Searcher text="Search for a course..." input={Search} setInput={setSearch} />
                  <aside className="course__sort">
                    <button
                      className={Tab === 0 ? "active" : ""}
                      onClick={() => {
                        setTab(0)
                      }}
                    >
                      All Courses
                    </button>
                    <button
                      className={Tab === 1 ? "active" : ""}
                      onClick={() => {
                        setTab(1)
                      }}
                    >
                      Bookmarked
                    </button>
                    <button
                      className={Tab === 2 ? "active" : ""}
                      onClick={() => {
                        setTab(2)
                      }}
                    >
                      My Courses
                    </button>
                  </aside>
                  <div>
                    <section className="courses">
                      {/* <a href="">{JSON.stringify(Courses)}</a> */}
                      {Tab === 0 &&
                        Courses.filter((x) => x.title?.toLowerCase()?.includes(Search?.toLowerCase())).map((x, i) => (
                          <CourseItem item={x} key={i} />
                        ))}
                      {Tab === 1 &&
                        Courses.filter((x) => x.title?.toLowerCase()?.includes(Search?.toLowerCase())).map((x, i) => {
                          if (!(session?.user?.user_metadata[x.id + "later"] === "later")) return <React.Fragment key={i} />
                          return <CourseItem item={x} key={i} />
                        })}
                      {Tab === 2 &&
                        Courses.filter((x) => x.title?.toLowerCase()?.includes(Search?.toLowerCase())).map((x, i) => {
                          if (!session?.user?.user_metadata[x.id]?.includes("rent")) return <React.Fragment key={i} />
                          return <CourseItem item={x} key={i} />
                        })}
                    </section>
                    {/* <PodcastsSection
                      title={Search === "" || !Search ? "All Episodes" : `Search Results for ${Search}`}
                      Search={Search}
                      PlayPodcast={PlayPodcast}
                      active={active}
                    /> */}
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
