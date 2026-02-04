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

const guests = [
  "/images/banners/withchude_live_banner_bovi.jpg",
  "/images/banners/withchude_live_banner_adichie.jpg",
  "/images/banners/withchude_live_banner_falz.jpg",
  "/images/banners/withchude_live_banner_funke.jpg",
  "/images/banners/withchude_live_banner_jerry.jpg",
];
export default function EventCarousel() {
  // useEffect(() => {
  //   if (innerWidth < 768) return;
  //   const mm = gsap.matchMedia();
  //   let tl = gsap.timeline({});
  //   mm.add("(min-width:768px) and (max-width:2000000px)", () => {
  //     tl = gsap
  //       .timeline({ defaults: { ease: "none" }, paused: true })
  //       .fromTo(
  //         ".Books__carousel.Event__carousel .Books__list",
  //         // { x: 1 * innerWidth },
  //         { x: 0 },
  //         { x: -1 * innerWidth, duration: 15 }
  //       );

  //     const tl2 = gsap.fromTo(
  //       tl,
  //       { progress: 0 },
  //       {
  //         progress: 1,
  //         duration: 15,
  //         repeat: -1,
  //         ease: "none",
  //         yoyo: true,
  //       }
  //     );

  //     const wrapper = document.querySelector(
  //       ".Books__carousel.Event__carousel .Books__list"
  //     ) as unknown as HTMLDivElement;
  //     wrapper.onmouseenter = () => tl2.pause();
  //     wrapper.onmouseleave = () => tl2.resume();

  //     Observer.create({
  //       target: ".Books__carousel.Event__carousel.Books__list .Books__carousel__wrapper",
  //       onDrag: (e) => {
  //         gsap.to(tl2, {
  //           progress: Math.max(Math.min(tl2.progress() - e.deltaX / 600, 1), 0),
  //           duration: 1,
  //           ease: "Power1.out",
  //         });
  //       },
  //       onDragEnd: (e) => {
  //         if (e.deltaX > 1) tl2.reverse();
  //         else tl2.play();
  //       },
  //       onWheel: (e) => {
  //         gsap.to(tl2, {
  //           progress: Math.max(Math.min(tl2.progress() + e.deltaX / 600, 1), 0),
  //           duration: 1,
  //           ease: "Power1.out",
  //         });
  //       },
  //       onHover: (e) => {
  //         tl.pause();
  //       },
  //     });
  //   });
  // }, []);

  return (
    <section className="Books__carousel Event__carousel">
      <div className="Books__carousel__wrapper withchude_live_background">
        {/* <h2>Our books.</h2> */}
        <h2>Get your tickets for the first-ever #WithChude Live!</h2>
        <Link
          to={"//event.withchude.com"}
          target="_blank"
          className="Updates__cta"
        >
          Get tickets
        </Link>
        <ul className="Books__list">
          {guests.map((guest, index) => (
            <Link key={index} to={"//event.withchude.com"} target="_blank">
              <li>
                <figure>
                  <img src={guest}></img>
                </figure>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </section>
  );
}

const Item = ({ guest }: PropsWithChildren<{ guest: string }>) => {
  return (
    <Link key={guest} to={"//event.withchude.com"}>
      <li>
        <figure>
          <img src={guest}></img>
        </figure>
        {/* <h3>{vid.title}</h3> */}
      </li>
    </Link>
  );
};
