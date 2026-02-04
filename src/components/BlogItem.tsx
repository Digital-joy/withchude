import { FC } from "react"
import { Link } from "react-router-dom"

const BlogItem: FC<{ title: string; item: any; type: string }> = ({ title, item, type = "blog" }) => {
  if (item?.data?.category !== type) return <></>
  return (
    <Link to={`/${type}/` + item.uid} className="BlogItem">
      <figure>
        {/* <img src={data["acclaim-logo"]?.url?.split("?")[0]} alt="" /> */}
        <img src={item?.data?.thumbnail?.url?.split("?")[0]} alt="" />
      </figure>
      <div className="BlogItem__hover">
        <h4>
          <span></span>
          {item?.data?.tag}
        </h4>
        <h3>{item?.data?.title[0]?.text}</h3>
      </div>
    </Link>
  )
}

export default BlogItem
