import { FC, useEffect, useState } from "react"
import BlogItem from "./BlogItem"
import RightAltSvg from "../icons/rightalt"
import { get } from "idb-keyval"
import { PrismicDocument } from "@prismicio/client"

const BlogSection: FC<{
  title: string
  type: string
  document: PrismicDocument[]
}> = ({ title, document, type }) => {
  const [blogs, setBlogs] = useState<any>([])

  useEffect(() => {
    get("blogs").then((blogs) => {
      setBlogs(blogs.filter((x) => x.title !== ""))
    })
  }, [])
  return (
    <div className="BlogSection">
      <h4>{title}</h4>
      <div className="BlogSection__Blogs__wrapper">
        <div className="BlogSection__Blogs">
          {document?.map((item) => (
            <BlogItem key={item.uid} item={item} title={item.data.title} type={type} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogSection
