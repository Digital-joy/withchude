import { PrismicDocument } from "@prismicio/client";
import gsap from "gsap";
import { InertiaPlugin } from "gsap-trial/all";
import { Draggable, Observer } from "gsap/all";
import {
  Fragment,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

gsap.registerPlugin(Draggable, InertiaPlugin, Observer);

export default function BooksCarousel({
  bookDocument,
}: PropsWithChildren<{ bookDocument: PrismicDocument }>) {
  useEffect(() => {
    if (innerWidth < 768) return;
    const mm = gsap.matchMedia();
    let tl = gsap.timeline({});
    // mm.add("(min-width:768px) and (max-width:2000000px)", () => {
    //   tl = gsap
    //     .timeline({ defaults: { ease: "none" }, paused: true })
    //     .fromTo(
    //       ".Watching__list.Books__list",
    //       // { x: 1 * innerWidth },
    //       { x: 0 },
    //       { x: -1 * innerWidth, duration: 15 }
    //     );

    //   const tl2 = gsap.fromTo(
    //     tl,
    //     { progress: 0 },
    //     {
    //       progress: 1,
    //       duration: 15,
    //       repeat: -1,
    //       ease: "none",
    //       yoyo: true,
    //     }
    //   );

    //   const wrapper = document.querySelector(
    //     ".Watching__list.Books__list"
    //   ) as unknown as HTMLDivElement;
    //   wrapper.onmouseenter = () => tl2.pause();
    //   wrapper.onmouseleave = () => tl2.resume();

    //   Observer.create({
    //     target: ".Watching__wrapper.Books__carousel__wrapper",
    //     onDrag: (e) => {
    //       gsap.to(tl2, {
    //         progress: Math.max(Math.min(tl2.progress() - e.deltaX / 600, 1), 0),
    //         duration: 1,
    //         ease: "Power1.out",
    //       });
    //     },
    //     onDragEnd: (e) => {
    //       if (e.deltaX > 1) tl2.reverse();
    //       else tl2.play();
    //     },
    //     onWheel: (e) => {
    //       gsap.to(tl2, {
    //         progress: Math.max(Math.min(tl2.progress() + e.deltaX / 600, 1), 0),
    //         duration: 1,
    //         ease: "Power1.out",
    //       });
    //     },
    //     onHover: (e) => {
    //       tl.pause();
    //     },
    //   });
    // });
  }, []);

  return (
    <section className="Books__carousel">
      <div className="Books__carousel__wrapper withchude_live_background">
        {/* <h2>Our books.</h2> */}
        <h2>Preorder the book "How Depression Saved My Life".</h2>
        <ul className="Books__list">
          <Link to={"//book.withchude.com"} target="_blank">
            <li>
              <figure>
                <img src={"/images/books/hdsml-2.jpg"}></img>
              </figure>
            </li>
          </Link>
          {bookDocument?.data.book.map((book, index) => {
            if (index > 30) return <Fragment key={index}></Fragment>;
            return <Item book={book} key={index} />;
          })}
        </ul>
      </div>
    </section>
  );
}

const Item = ({ book }: PropsWithChildren<{ book: any }>) => {
  return (
    <Link key={book.uid} to={"/shop"}>
      <li>
        <figure>
          <img
            src={book.cover?.url?.split("?")[0]}
            // crossOrigin="anonymous"
            // muted={muted}
            // loop={true}
            // ref={video}
            // onMouseEnter={() => {
            //   video.current.play()
            //   setMuted(false)
            // }}
            // onMouseLeave={() => {
            //   video.current.pause()
            //   setMuted(true)
            // }}
          ></img>
        </figure>
        {/* <h3>{vid.title}</h3> */}
      </li>
    </Link>
  );
};
