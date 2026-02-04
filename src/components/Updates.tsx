import { PrismicDocument } from "@prismicio/client"
import { Fragment, PropsWithChildren } from "react"
import { Link } from "react-router-dom"
import LeftSvg from "../icons/left"

export default function Updates({ document }: PropsWithChildren<{ document: PrismicDocument[] }>) {
  return (
    <section className="Updates">
      <div className="Updates__wrapper withchude_live_background">
        <h2>READ: A daily devotional to help you deal with life.</h2>
        <Link to={"/blog"} className="Updates__cta">
          View All Articles
        </Link>
        <ul className="Updates__list">
          {document
            ?.sort((a, b) => new Date(b.data.publish_date).getTime() - new Date(a.data.publish_date).getTime())
            .map((article, index) => {
              if (index > 2) return <Fragment key={index}></Fragment>
              return (
                <Link to={"/blog/" + article.uid} key={article.uid}>
                  <li>
                    <div>
                      <h4>
                        <span></span>
                        {article?.data?.tag}
                      </h4>
                      <h3>{article?.data?.title[0]?.text}</h3>
                      <article>
                        Read Article
                        <LeftSvg />
                      </article>
                    </div>
                    <figure>
                      {" "}
                      <img src={article?.data?.thumbnail?.url?.split("?")[0]} alt="" />
                    </figure>
                  </li>
                </Link>
              )
            })}
        </ul>
      </div>
    </section>
  )
}
