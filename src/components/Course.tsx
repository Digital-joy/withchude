import { UserResponse } from "@supabase/supabase-js"
import { FC, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { SessionContext, supabase } from "../App"
import {} from "../app/utils"
import BookmarkSvg from "../icons/bookmark"
import BookmarkedSvg from "../icons/bookmarked"
import PlayAltSvg from "../icons/playalt"
import PlayingSvg from "../icons/playalting"

const CourseItem: FC<{ item: any }> = ({ item }) => {
  const [Later, setLater] = useState(false)
  const session = useContext(SessionContext)

  // useEffect(() => {
  //   setLater(!!(session?.user?.user_metadata[podcast.uid] === "later"))
  // }, [session?.user])

  return (
    <Link to={`/masterclass/${item.id}`} className="CourseItem">
      <figure>
        <img src={item.thumbnail} alt="" />
      </figure>
      <h3>{item.title}</h3>
      {/* <h4 dangerouslySetInnerHTML={{ __html: item.description }}></h4> */}
      <aside>
        <img src="/images/chude.png" alt="" />
        <h5>Chude Jideonwo</h5>
        <h6>${item.price}</h6>
      </aside>
    </Link>
  )
}

export default CourseItem
