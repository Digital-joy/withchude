import { Link } from "react-router-dom";
import { ContentColumn } from "../app/types";
import HeartIcon from "../icons/HeartIcon";
import CommentIcon from "../icons/CommentIcon";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../App";
import { likeService } from "../app/services/supabse";
import Popup from "./Popup";
import { useAppDispatch } from "../app/redux/hooks";
import { setLoginShown } from "../app/redux/reducers/loginSlice";

export interface IEngagements extends React.ComponentPropsWithoutRef<"div"> {
  likes: number;
  comments: number;
  content_id: string;
  content_column: ContentColumn;
}

const Engagements: React.FC<IEngagements> = ({
  likes,
  comments,
  content_id,
  content_column,
  className,
  ...divProps
}) => {
  const dispatch = useAppDispatch()
  const [liked, setLiked] = useState<boolean>(false);
  const session = useContext(SessionContext);
  const user = session?.user;

  const getLike = () => {
    return likeService.getLike(session.user?.id, content_id, content_column);
  };
  useEffect(() => {
    if (session.user) {
      getLike().then((data) => {
        setLiked(data ? true : false);
      });
    }
  }, []);

  const handleLike = () => {
    if (session.user) {
      if (liked) {
        setLiked(false);
        // Perform 'unlike' query
        likeService
          .unlikeContent(session.user?.id, content_id, content_column)
          .then((data) => {
            setLiked(data ? false : true);
          })
          .catch((e) => {
            setLiked(true);
          });
      } else {
        setLiked(true);
        likeService
          .likeContent(session.user?.id, content_id, content_column)
          .then((data) => {
            setLiked(data ? true : false);
          })
          .catch((e) => {
            setLiked(false);
          });
      }
    } else {
      dispatch(setLoginShown(true));
    }
  };

  return (
      <div className={`engagements ${className}`} {...divProps}>
        <div className="engagement">
          <HeartIcon
            onClick={handleLike}
            className={`engagement_icon ${liked && "liked"}`}
          />
          <span>{likes}</span>
        </div>
        <div className="engagement">
          <CommentIcon className="engagement_icon" />
          <span>{comments}</span>
        </div>
      </div>
  );
};

export default Engagements;
