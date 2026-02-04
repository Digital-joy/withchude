import { get } from "idb-keyval"
import { FC, useContext, useEffect, useState } from "react"
import PodcastsItem from "./PodcastsItem"
import { SessionContext } from "../App"

const PodcastsSection: FC<{
  title: string
  active: any
  Search: string
  PlayPodcast: (id: string) => void
}> = ({ title, PlayPodcast, active, Search }) => {
  const [scroll, setScroll] = useState(-1)
  const [Podcasts, setPodcasts] = useState([])
  const [user, setUser] = useState(null)
  const session = useContext(SessionContext)

  useEffect(() => {
    get("podcasts").then((data) => {
      setPodcasts(data)
    })
    setUser(session?.user)
  }, [session?.user])

  return (
    <div className="PodcastsSection">
      <h4>{title}</h4>
      <div className="PodcastsSection__Podcasts__wrapper">
        <div
          className="PodcastsSection__Podcasts"
          data-lenis-prevent=""
          onScroll={(e) => {
            setScroll(e.currentTarget.scrollTop / (e.currentTarget.scrollHeight - e.currentTarget.clientHeight))
          }}
        >
          {Podcasts.filter(
            (val) =>
              val?.title?.toLowerCase().includes(Search.toLowerCase()) || val?.uid?.toLowerCase().includes(Search.toLowerCase())
          ).map((data, index) => (
            <PodcastsItem key={data.uid} podcast={data} playing={active?.uid == data.uid} PlayPodcast={PlayPodcast} user={user} />
          ))}
          {scroll !== -1 && (
            <div className="PodcastsSection__track">
              <div
                className="PodcastsSection__bar"
                style={{
                  height: `${(100 / 18) * 2.5}%`,
                  top: `${(100 - (100 / 18) * 2.5) * scroll}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PodcastsSection
