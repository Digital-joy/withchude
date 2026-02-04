import { PrismicDocument } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { motion, usePresence } from "framer-motion";
import gsap from "gsap";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SessionContext, supabase } from "../App";
import Scroll from "../app/classes/scroll";
import BlogItem from "../components/BlogItem";
import { FooterLite } from "../components/Footer";
import Header from "../components/Header";
import { NavLite } from "../components/Nav";
import Popup from "../components/Popup";
import PostPage from "../components/PostPage";

import Comment from "../components/Comment";
import { User } from "@supabase/supabase-js";
import SendAltEmoji from "../icons/send-alt";
import { useAppDispatch } from "../app/redux/hooks";
import { setShareShown } from "../app/redux/reducers/shareSlice";
import ShareAndSubscribeButtons from "../components/button/ShareAndSubscribeButtons";
import Engagements from "../components/Engagements";
import { Helmet } from "react-helmet-async";

export default function Article({
  document: $document,
  type,
}: PropsWithChildren<{ document: PrismicDocument[]; type: string }>) {
  useEffect(() => {}, []);

  const dispatch = useAppDispatch();
  const [isPresent, safeToRemove] = usePresence();
  const [title, setTitle] = useState("");
  const [blog, setBlog] = useState<any>({});
  const [blogs, setBlogs] = useState<any>([]);
  const [note, setNote] = useState("");
  const params = useParams();
  const session = useContext(SessionContext);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!$document || !blog) return;
    window.$scroll = new Scroll("studio");
  }, [$document, blog]);

  useEffect(() => {
    if (!isPresent) {
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true });
          safeToRemove();
        },
      });
    }
  }, [isPresent]);

  useEffect(() => {
    if (!$document) return;

    let index;

    const found = $document
      .sort(
        (a, b) =>
          new Date(b.data.publish_date).getTime() -
          new Date(a.data.publish_date).getTime()
      )
      .filter((x) => x.data.category === type)
      .filter((x, i) => {
        if (x.uid.toLowerCase()?.includes(params.id)) {
          if (!index) index = i;
          return true;
        }
      })[0];

    const user = session?.user;

    // if (found.data.free) {
    if (found.data) {
      setBlog(found);
    } else if (!user) {
      setShowLogin(true);
    } else {
      if (loading) return;
      if (session?.user?.email) setLoading(true);
      const response = fetch(
        session.isLocal
          ? `${process.env.SERVER_URL}/retrieve/paystack`
          : `${process.env.SERVER_URL}/retrieve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.user_metadata?.subscriptionId || "",
            email: user?.email,
          }),
        }
      ).then(async (res) => {
        if (
          res.ok ||
          session?.user?.user_metadata[params.id]?.includes("rent")
        ) {
          setBlog(found);
        } else {
          navigate("/payment");
        }
        const resp = await res.json();
        const { data, error } = await supabase.auth.updateUser({
          data: { subscriptionStatus: resp.status },
        });
      });

      // const { data, error } = await supabase.rpc("listen", {
      //   id: podcast.uid,
      //   increment: 1,
      // })
    }
    const all = $document
      .sort(
        (a, b) =>
          new Date(b.data.publish_date).getTime() -
          new Date(a.data.publish_date).getTime()
      )
      .filter((x) => x.data.category === type);
    setBlogs([all.slice(0, index).pop(), all.slice(0, index + 2).pop()]);
  }, [params, session?.user?.email]);

  const [comment, setComment] = useState("");
  const [$Comments, set$Comments] = useState([]);
  const [User, setUser] = useState<User>();

  const [Later, setLater] = useState(false);

  function deleteComment(id: string) {
    set$Comments($Comments.slice().filter((comment) => comment.uid !== id));
  }

  useEffect(() => {
    if ($Comments[0]) return;
    if (!blog?.id) return;
    supabase
      .from("comments")
      .select()
      .eq("blog", blog.id)
      .then((data) => {
        set$Comments(data.data.slice().reverse());
      });
  }, [blog?.id]);

  useEffect(() => {
    setUser(session?.user);
  }, [session?.user]);

  if (!$document) return <></>;

  return (
    <>
      <Helmet>
        <title>{`${blog?.data?.title[0].text} | WithChude - ${blog?.data?.tag} Blog post`}</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <div className="content" id="content" data-template="article">
              <Header />
              <main>
                <div className="__article" id="article">
                  <NavLite page={type} />
                  <div className="article__head">
                    <img
                      src={blog?.data?.thumbnail?.url?.split("?")[0]}
                      alt=""
                    />
                    <div>
                      <h6>{blog?.data?.tag}</h6>
                      <h2>{blog?.data?.title[0].text}</h2>
                    </div>
                  </div>
                  {blog?.data && (
                    <div className="article__neck">
                      <span></span>
                      <h3>{blog?.data?.author[0]?.text ?? "Chude Jideonwo"}</h3>
                      <p>
                        {new Date(blog?.data?.publish_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  )}
                  {blog?.data && (
                    <>
                      <div className="article__body">
                        <PrismicRichText field={blog?.data?.content} />
                        <Engagements
                          likes={20}
                          comments={$Comments.length}
                          content_id={blog.id}
                          content_column="blog_id"
                        />
                      </div>
                      <div className="Vid__Comments__wrapper">
                        <div className="Vid__Comments">
                          <h4>Comments</h4>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              supabase
                                .from("comments")
                                .insert([
                                  {
                                    by: User?.user_metadata.name ?? "Anonymous",
                                    text: comment,
                                    blog: blog.id,
                                  },
                                ])
                                .select()
                                .then((data) => {
                                  set$Comments([...data.data, ...$Comments]);
                                  setComment("");
                                });
                            }}
                          >
                            <textarea
                              placeholder="Start typing to add a comment..."
                              name="comment"
                              id="comment"
                              value={comment}
                              onInput={(e) => setComment(e.currentTarget.value)}
                            ></textarea>
                            {/* <EmojiIcon /> */}
                            {comment[0] && (
                              <button>
                                <span>Post</span>
                                <SendAltEmoji />
                                {/* <EmojiPicker /> */}
                              </button>
                            )}
                          </form>
                          {$Comments.map(({ by, created_at, text, uid }) => (
                            <Comment
                              key={uid}
                              name={by}
                              time={created_at}
                              comment={text}
                              id={uid}
                              deleteComment={deleteComment}
                            />
                          ))}
                          <ShareAndSubscribeButtons className="mt" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="article__footer">
                    <div>
                      {blogs[0] && blogs[0]?.uid !== blog?.uid && (
                        <>
                          <h6>Read Prev.</h6>
                          <ul>
                            {blogs.slice(0, 1).map((item, key) => (
                              <BlogItem
                                key={item?.uid}
                                item={item}
                                title={item?.data?.title}
                                type={type}
                              />
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                    <div>
                      {blogs[1] && blogs[1]?.uid !== blog?.uid && (
                        <>
                          <h6>Read Next</h6>
                          <ul>
                            {blogs.slice(1, 2).map((item, key) => (
                              <BlogItem
                                key={item?.uid}
                                item={item}
                                title={item?.data?.title}
                                type={type}
                              />
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                  {/* <Join /> */}
                </div>
              </main>
              <FooterLite />
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  );
}
