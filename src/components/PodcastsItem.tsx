import { UserResponse } from "@supabase/supabase-js"
import { FC, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SessionContext, supabase } from "../App"
import {} from "../app/utils"
import BookmarkSvg from "../icons/bookmark"
import BookmarkedSvg from "../icons/bookmarked"
import PlayAltSvg from "../icons/playalt"
import PlayingSvg from "../icons/playalting"

const PodcastsItem: FC<{ podcast: any; playing: boolean; PlayPodcast: (id: string) => void; user: UserResponse }> = ({
  podcast,
  playing = false,
  PlayPodcast,
  user,
}) => {
  const [Later, setLater] = useState(false)
  const dt = new Date(podcast.published).toDateString().split(" ")
  dt.shift()
  const day = dt[1]
  const month = dt[0]
  dt[0] = day
  dt[1] = month

  const session = useContext(SessionContext)

  useEffect(() => {
    setLater(!!(session?.user?.user_metadata[podcast.uid] === "later"))
  }, [session?.user])

  return (
    <div className="PodcastsItem">
      <div className="PodcastsItem__hover">
        <h3>{podcast.title}</h3>
        <h4>
          <span>{dt.join(" ")}</span>
          {/* <span className="xxduration">
            {podcast.duration} {podcast.duration === "1" ? "minute" : "minutes"}
          </span> */}
        </h4>
      </div>
      <aside>
        <Link
          to={"/podcasts"}
          style={{ background: "#ffffff" }}
          onClick={(e) => {
            e.preventDefault()
            PlayPodcast(podcast)
          }}
        >
          {playing ? <PlayingSvg /> : <PlayAltSvg />}
          {playing ? <span style={{ color: "#F8A519" }}>Now Playing</span> : "Play"}
        </Link>
        {session?.user && (
          <button
            style={{ background: "#ffffff" }}
            onClick={async () => {
              const data = {}
              if (!Later) {
                localStorage.setItem(podcast.uid, "later")
                data[podcast.uid] = "later"
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                })
                setLater(true)
              } else {
                localStorage.removeItem(podcast.uid)
                data[podcast.uid] = null
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
        )}
      </aside>
    </div>
  )
}

export default PodcastsItem
