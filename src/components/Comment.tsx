import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { FC, useContext, useEffect, useState } from "react"
import { SessionContext, supabase } from "../App"
dayjs.extend(relativeTime)

const Comment: FC<{ name: string; time: number; comment: string; id: string; deleteComment: (id: string) => void }> = ({
  comment,
  name,
  time,
  id,
  deleteComment,
}) => {
  const session = useContext(SessionContext)

  const [Liked, setLiked] = useState(false)
  console.log(Liked, 888)
  useEffect(() => {
    setLiked(!!(session?.user?.user_metadata[id] === "liked"))
  }, [session?.user])

  return (
    <article className="Comment">
      <div className="Comment__header">
        <figure>{name && name[0]}</figure>
        <div>
          <h5>{name}</h5>
          <h6>{dayjs(time).fromNow()}</h6>
        </div>
        {/* <EllipsesSvg /> */}
      </div>
      <p>{comment}</p>
      <div className="Comment__footer">
        {name === session?.user?.user_metadata.name ? (
          <button
            onClick={() => {
              supabase
                .from("comments")
                .delete()
                .eq("uid", id)
                .then(() => {
                  deleteComment(id)
                })
            }}
          >
            Delete
          </button>
        ) : (
          <button
            style={{ color: Liked ? "#F4405F" : "" }}
            onClick={async () => {
              const data = {}
              if (!Liked) {
                localStorage.setItem(id, "liked")
                data[id] = "liked"
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                })
                setLiked(true)
              } else {
                localStorage.removeItem(id)
                data[id] = null
                const { data: res, error } = await supabase.auth.updateUser({
                  data,
                })
                setLiked(false)
              }
            }}
          >
            {Liked ? "Liked" : "Like"}
          </button>
        )}
      </div>
    </article>
  )
}

export default Comment

declare module "dayjs" {
  interface Dayjs {
    fromNow()
  }
}
