import React, { useContext, useEffect, useState } from "react";
import VideoSection from "./VideoSection";
import { VideoProps } from "../app/types";
import { User, UserResponse } from "@supabase/supabase-js";
import { SessionContext, supabase } from "../App";
import AddSvg from "../icons/add";
import CloseSvg from "../icons/close";
import SendAltEmoji from "../icons/send-alt";
import Comment from "./Comment";

export interface IVimeoPlayer extends React.ComponentPropsWithoutRef<"div"> {
  videoId: string | number;
  related?: VideoProps[];
  user: UserResponse;
  vid: any;
}

/**
 *
 * @param PlayVideo deprecated
 * @returns
 */
const VimeoPlayer: React.FC<IVimeoPlayer> = ({
  videoId,
  vid,
  related = [],
  user,
  className,
  ...popupProps
}) => {
//   const [comment, setComment] = useState("");
//   const [$Comments, set$Comments] = useState([]);
//   const [User, setUser] = useState<User>();
//   const session = useContext(SessionContext);

//   const [Later, setLater] = useState(false);
//   const [showDesc, setShowDesc] = useState(false);
//   const [showLiked, setShowLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);

//   useEffect(() => {
//     setLater(!!(session?.user?.user_metadata[vid?.uid] === "later"));
//   }, [session?.user, vid.uid, vid.id]);

//   function deleteComment(id: string) {
//     set$Comments($Comments.slice().filter((comment) => comment.uid !== id));
//   }

//   useEffect(() => {
//     if ($Comments[0]) return;
//     if (location.pathname.split("/")[3]) {
//       if (!vid.id) return;
//       supabase
//         .from("comments")
//         .select()
//         .eq("course", vid.id)
//         .then((data) => {
//           set$Comments(data.data.slice().reverse());
//         });
//     }
//     if (!vid.uid) return;
//     supabase
//       .from("comments")
//       .select()
//       .eq("video", vid.uid)
//       .then((data) => {
//         set$Comments(data.data.slice().reverse());
//       });
//   }, [vid.uid, vid.id]);

//   useEffect(() => {
//     setUser(session?.user);
//   }, [session?.user]);
  return (
    <>
      <div
        className={`Vid__wrapper active vimeo_player ${className}`}
        {...popupProps}
      >
        <iframe
          src={`https://player.vimeo.com/video/${videoId}&title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479`}
          frameBorder={"0"}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          title={`${vid.title}`}
        ></iframe>
        <script src="https://player.vimeo.com/api/player.js"></script>
        <div className="Vid__mobile">
          {/* <div className="Vid__mobile__header">
            <button
                onClick={() => {
                  // document.querySelector<HTMLButtonElement>(".vjs-fullscreen-control").click()
                  setFullscreen(true);
                  requestFullScreen(document.body);
                }}
              >
                <svg width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M9.944 1.25H10a.75.75 0 0 1 0 1.5c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812c-.423.423-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.289a.75.75 0 0 1-1.5 0v-.056c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153m8.345 1.64c-1.027-.138-2.382-.14-4.289-.14a.75.75 0 0 1 0-1.5h.056c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433V10a.75.75 0 0 1-1.5 0c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812M2 13.25a.75.75 0 0 1 .75.75c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14a.75.75 0 0 1 0 1.5h-.056c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433V14a.75.75 0 0 1 .75-.75m20 0a.75.75 0 0 1 .75.75v.056c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H14a.75.75 0 0 1 0-1.5c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289a.75.75 0 0 1 .75-.75"
                    clipRule="evenodd"
                  ></path>
                </svg>
                Enter Full Screen
              </button>
            <button
              className="VideoItem__add"
              onClick={async () => {
                const data = {};
                if (!Later) {
                  localStorage.setItem(vid?.uid, "later");
                  data[vid?.uid] = "later";
                  const { data: res, error } = await supabase.auth.updateUser({
                    data,
                  });
                  setLater(true);
                } else {
                  localStorage.removeItem(vid?.uid);
                  data[vid?.uid] = null;
                  const { data: res, error } = await supabase.auth.updateUser({
                    data,
                  });
                  setLater(false);
                }
              }}
            >
              {Later ? <></> : <AddSvg />}
              <span>{Later ? "Added to Watchlist" : "Add to Watchlist"}</span>
            </button>
          </div> */}
          <p className="Video__mobile__tag">{vid.tag}</p>
          <h3 className="Video__mobile__title">{vid.title}</h3>
          <p className="Video__mobile__description">
            {vid.description || "No description for this video"}
          </p>
          {/* <div className="Vid__Comments__wrapper">
            <div className="Vid__Comments">
              <div onClick={() => setShowComments(!showComments)}>
                <article>
                  <h4>Comments</h4>
                </article>
                <CloseSvg />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  supabase
                    .from("comments")
                    .insert([
                      {
                        by: User.user_metadata.name,
                        text: comment,
                        video: vid.uid,
                        course: vid.id,
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
                {comment[0] && (
                  <button>
                    <span>Post</span>
                    <SendAltEmoji />
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
            </div>
          </div> */}
          <VideoSection
            title="Related"
            items={related}
            showProgress={false}
            showMore={false}
            user={user}
            style={{
              marginTop: "4rem",
              // marginBottom: "6rem",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default VimeoPlayer;
