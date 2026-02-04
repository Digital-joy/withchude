import { get } from "idb-keyval"
import { PropsWithChildren, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SessionContext, supabase } from "../App"
import BookmarkSvg from "../icons/bookmark"
import BookmarkedSvg from "../icons/bookmarked"
import PlayAltSvg from "../icons/playalt"
import PlayingSvg from "../icons/playalting"
import { createThumbnail } from "../app/utils"
import PodcastsLiked from "./PodcastsLiked"

export default function PodcastsHero({
  PlayPodcast,
  active,
}: PropsWithChildren<{ PlayPodcast: (id: string) => void; active: any }>) {
  const [Podcasts, setPodcasts] = useState([])
  const [Latest, setLatest] = useState<any>({})
  const [Later, setLater] = useState(false)
  const session = useContext(SessionContext)
  const [scroll, setScroll] = useState(-1)

  useEffect(() => {
    get("podcasts").then((data) => {
      setPodcasts(
        data.slice().sort(function (a, b) {
          if (a.views > b.views) {
            return -1
          } else if (a.views < b.views) {
            return 1
          }
          return 0
        })
      )

      const temp = data.sort(function (a, b) {
        if (a.published > b.published) {
          return -1
        } else if (a.published < b.published) {
          return 1
        }
        return 0
      })[0]

      setLatest(temp)

      setLater(!!(session?.user?.user_metadata[temp.uid] === "later"))
    })
  }, [session?.user])

  return (
    <section className="PodcastsHero">
      <div className="PodcastsHero__wrapper">
        <div className="PodcastsHero__left" style={{ background: "#69514A" }}>
          <figure>
            {/* <img src={createThumbnail(Latest?.thumbnail, Latest?.url)} alt="" /> */}
            {/* <img src={Latest.url?.replace("upload/sp_auto/", "upload/").replace(".m3u8", ".webp") ?? "null.png"} alt="" /> */}
          </figure>
          <div>
            <h4>
              <span></span>LATEST EPISODE
            </h4>
            <h3>{Latest?.title}</h3>
            <aside>
              <Link
                to={"/podcasts/"}
                onClick={(e) => {
                  e.preventDefault()
                  PlayPodcast(Latest)
                }}
                style={{ background: "#69514A" }}
              >
                {active?.uid == Latest?.uid ? <PlayingSvg /> : <PlayAltSvg />}
                {active?.uid == Latest?.uid ? <span style={{ color: "#F8A519" }}>Now Playing</span> : "Play"}
              </Link>
              {session.user && (
                <>
                  {" "}
                  <strong>|</strong>
                  <button
                    style={{ background: "#69514A" }}
                    onClick={async () => {
                      const data = {}
                      if (!Later) {
                        localStorage.setItem(Latest.uid, "later")
                        data[Latest.uid] = "later"
                        const { data: res, error } = await supabase.auth.updateUser({
                          data,
                        })
                        setLater(true)
                      } else {
                        localStorage.removeItem(Latest.uid)
                        data[Latest.uid] = null
                        const { data: res, error } = await supabase.auth.updateUser({
                          data,
                        })
                        setLater(false)
                      }
                    }}
                  >
                    {Later ? <BookmarkedSvg /> : <BookmarkSvg />}
                    {Later ? "Bookmarked" : "Listen Later"}
                  </button>
                </>
              )}
            </aside>
          </div>
        </div>
        {Podcasts.length > 1 && (
          <ul
            className="PodcastsHero__right"
            data-lenis-prevent=""
            onScroll={(e) => {
              setScroll(e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight))
            }}
          >
            <h5>
              <span></span>
              {session?.user ? "BOOKMARKED EPISODES" : "LOGIN TO VIEW BOOKMARKS"}
            </h5>
            {Podcasts.filter((val) => val?.title?.toLowerCase())
              .filter((x) => session?.user?.user_metadata[x.uid] === "later")
              .map((data, index) => (
                <Episode PlayPodcast={PlayPodcast} active={active} data={data} />
              ))}
            <div className="PodcastsSection__track">
              <div
                className="PodcastsSection__bar"
                style={{
                  height: `${(100 / 18) * 2.5}%`,
                  top: `${(100 - (100 / 18) * 2.5) * scroll}%`,
                }}
              ></div>
            </div>
          </ul>
        )}
      </div>
    </section>
  )
}

const Episode = ({
  PlayPodcast,
  active,
  data,
}: PropsWithChildren<{ PlayPodcast: (id: string) => void; active: any; data: any }>) => {
  const [Later, setLater] = useState(false)
  const session = useContext(SessionContext)

  useEffect(() => {
    setLater(!!(session?.user?.user_metadata[data.uid] === "later"))
  }, [session?.user])

  return (
    <li>
      <div>
        <h3>{data?.title}</h3>
        <aside>
          <Link
            to={"/podcasts/:id"}
            onClick={(e) => {
              e.preventDefault()
              PlayPodcast(data)
            }}
            style={{ background: "#ffffff" }}
          >
            {active?.uid == data?.uid ? <PlayingSvg /> : <PlayAltSvg />}
            {active?.uid == data?.uid ? <span style={{ color: "#F8A519" }}>Now Playing</span> : "Play"}
          </Link>
          <button
            style={{ background: "#ffffff" }}
            onClick={async () => {
              const datum = {}
              if (!Later) {
                localStorage.setItem(data.uid, "later")
                datum[data.uid] = "later"
                const { data: res, error } = await supabase.auth.updateUser({
                  data: datum,
                })
                setLater(true)
              } else {
                localStorage.removeItem(data.uid)
                datum[data.uid] = null
                const { data: res, error } = await supabase.auth.updateUser({
                  data: datum,
                })
                setLater(false)
              }
            }}
          >
            {Later ? <BookmarkedSvg /> : <BookmarkSvg />}
            {Later ? "Bookmarked" : "Listen Later"}
          </button>
        </aside>
      </div>
    </li>
  )
}
