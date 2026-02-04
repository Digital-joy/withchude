import { UserResponse } from "@supabase/supabase-js";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import RightAltSvg from "../icons/rightalt";
import VideoItem from "./VideoItem";
import VideoItemPopover from "./popover/VideoItemPopover";
import gsap from "gsap";
import VideoItemWithModal from "./VideoItemWithModal";

export interface IVideoSection extends React.ComponentPropsWithoutRef<"div"> {
  title: string;
  showProgress?: boolean;
  showMore?: boolean;
  more?: string;
  items?: any[];
  PlayVideo?: (x: string) => void;
  user: UserResponse;
}
const VideoSection: FC<IVideoSection> = ({
  title,
  showProgress = false,
  showMore = true,
  more,
  items = [],
  PlayVideo = () => {},
  user,
  className,
  ...divProps
}) => {
  const wrapper = useRef<HTMLDivElement>();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  if (!items[0]) return;
  return (
    <div className={`VideoSection ${className}`} {...divProps}>
      <Link to={more ? `/watch/tags/${more}` : "#"}>
        <h4>
          {title}
          {showMore && (
            <div>
              View More <RightAltSvg />
            </div>
          )}
        </h4>
      </Link>
      <div className="VideoSection__videos__wrapper">
        <div
          className="VideoSection__nav"
          style={{
            overflow: isHovered ? "visible" : "scroll",
          }}
        >
          <div
            className="left"
            onClick={() => {
              gsap.to(wrapper.current, {
                scrollLeft:
                  wrapper.current.scrollLeft - innerWidth * 0.2951388889,
              });
            }}
          >
            <LeftArrow />
          </div>
          <div
            className="right"
            onClick={() => {
              gsap.to(wrapper.current, {
                scrollLeft:
                  wrapper.current.scrollLeft + innerWidth * 0.2951388889,
              });
            }}
          >
            <RightArrow />
          </div>
        </div>
        <div className="VideoSection__videos" ref={wrapper}>
          {items.map((data, i) => {
            if (i > 9) return <React.Fragment key={i}></React.Fragment>;
            return (
              <Fragment key={i}>
                {/* <VideoItem
                key={data?.uid}
                uid={data?.uid}
                url={data?.url}
                title={
                  data?.episode +
                  " " +
                  (data?.episode[0] && data?.title[0] ? ":" : "") +
                  " " +
                  data?.title
                }
                showProgress={showProgress}
                thumbnail={data?.thumbnail}
                tag={data?.tag}
                free={data?.free}
                description={data?.description}
                PlayVideo={PlayVideo}
                user={user}
              /> */}
                <VideoItemWithModal
                  key={data?.uid}
                  video={data}
                  showProgress={showProgress}
                  PlayVideo={PlayVideo}
                  user={user}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;

const LeftArrow = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m15 5l-6 7l6 7"
    ></path>
  </svg>
);

const RightArrow = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m9 5l6 7l-6 7"
    ></path>
  </svg>
);
