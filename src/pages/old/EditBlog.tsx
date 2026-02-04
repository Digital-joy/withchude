import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Scroll from "../../app/classes/scroll"
import { AdminHeader } from "../../components/Header"
import TipTap from "../../components/TipTap"
import WriteSvg from "../../icons/write"
import { supabase } from "../../App"
import BlogPopup from "../../components/BlogPopup"

export default function EditBlog() {
  useEffect(() => {
    window.$scroll = new Scroll("noscroll")
  }, [])

  const [title, setTitle] = useState("")
  const [blog, setBlog] = useState<any>({})
  const [note, setNote] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    console.log(params)
    supabase
      .from("blogs")
      .select()
      .eq("uid", params?.id)
      .then((data) => {
        setBlog(data.data[0])
        setTitle(data.data[0].title)
        setNote(data.data[0].content)
      })
  }, [params])

  async function UploadToSupabaseEdit(thumbnail: string, category: string, author: string, date: Date) {
    console.log(date, {
      thumbnail: thumbnail,
      category: category,
      title,
      content: note,
      author: author ?? "Chude Jideonwo",
      published: date.toISOString(),
      reads: 0,
    })
    const { data, error } = await supabase
      .from("blogs")
      .update({
        thumbnail: thumbnail ?? "",
        category: category,
        title,
        content: note,
        author: author ?? "Chude Jideonwo",
        published: date.toISOString(),
      })
      .eq("uid", params?.id)
    navigate("/admin/blogs")
  }

  return (
    <>
      <div className="app preloading" id="smooth-wrapper">
        <div className="__app" id="smooth-content">
          <div className="content" id="content" data-template="admin">
            <AdminHeader>
              <div className="Nav__links">
                <Link className={location.pathname.includes("videos") ? "Nav__link active" : "Nav__link"} to="/admin/videos">
                  Videos
                </Link>
                <Link className={location.pathname.includes("podcasts") ? "Nav__link active" : "Nav__link"} to="/admin/podcasts">
                  Podcasts
                </Link>
                <Link className={location.pathname.includes("users") ? "Nav__link active" : "Nav__link"} to="/admin/users">
                  Users
                </Link>
                <Link className={location.pathname.includes("blogs") ? "Nav__link active" : "Nav__link"} to="/admin/blogs">
                  Blogs
                </Link>
                <button
                  className="Admin__cta"
                  onClick={() => {
                    setShowPopup(true)
                    // UploadToSupabase()
                  }}
                >
                  <WriteSvg />
                  <span>Publish</span>
                </button>
              </div>
            </AdminHeader>
            <main>
              <div className="__admin __blog" id="admin">
                <TipTap title={title} setTitle={setTitle} note={note} setNote={setNote} key={blog.uid} />
              </div>
            </main>
          </div>
          {showPopup && (
            <BlogPopup
              Close={() => {
                setShowPopup(false)
              }}
              img={blog.thumbnail}
              author={blog.author}
              date={blog.published}
              category={blog.category}
              Submit={(...props) => UploadToSupabaseEdit(...props)}
            />
          )}
        </div>
      </div>
    </>
  )
}
