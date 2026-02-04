import { PropsWithChildren, useEffect } from "react";
import { usePresence, motion } from "framer-motion";
import gsap from "gsap";
import PostPage from "../components/PostPage";
import { Link } from "react-router-dom";
import Testimonials from "../components/Testimonials";
import Preloader from "../components/Preloader";
import ThreadSvg from "../icons/thread";
import XSvg from "../icons/x";
import FbSvg from "../icons/fb";
import IgSvg from "../icons/ig";
import YoutubeSvg from "../icons/youtube";
import WhatsappIcon from "../icons/WhatsappIcon";
import Footer from "../components/Footer";
import Scroll from "../app/classes/scroll";
import Header from "../components/Header";
import { NavLite } from "../components/Nav";
import { Helmet } from "react-helmet-async";

export default function IIYM() {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    // if (!document) return
    window.$scroll = new Scroll("about");
  }, []);

  useEffect(() => {
    if (!isPresent) {
      gsap.timeline({
        onComplete: () => {
          window?.$scroll?.lenis?.scrollTo(0, { immediate: true });
          safeToRemove();
        },
      });
      //      .to(".PostPage", { scaleY: 1, duration: 1, ease: "expo" }, 0)
    }
  }, [isPresent]);

  return (
    <>
      <Helmet>
        <title>Is It Your Money? | WithChude</title>
      </Helmet>
      <motion.main
        className="main__container"
        initial={{ opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="app preloading" id="smooth-wrapper">
          <div className="__app" id="smooth-content">
            <Preloader />
            <div className="content" id="content" data-template="books">
              <Header />
              <main>
                <div className="__books __iiym" id="books">
                  <NavLite page="Is It Your Money?" pageLink="/diezani" />
                  <header className="iiym__header">
                    <h1 className="title">Is It Your Money?</h1>
                    {/* <h3 className="subheading">
                          An exploration of purpose, healing and Influence
                        </h3> */}
                    <p className="subheading">
                      A film the Nigerian government didn’t want you to see.
                    </p>
                    <a href="/watch" target="_blank" className="btn-preorder">
                      Watch Now
                    </a>
                  </header>
                  <div className="iiym__body">
                    <div className="synopsis__body__left">
                      <p>
                        In 2024, a Nigerian court fined us N500 million to
                        suppress this documentary locally.
                      </p>
                      <p>No defense. No hearing. Just silence.</p>

                      <p>But silence is not an option.</p>

                      <p>
                        From award-winning journalist and filmmaker Chude
                        Jideonwo, Is It Your Money? Is a 4-part docu-series that
                        investigates one of the most controversial corruption
                        sagas in modern African history. At the center is
                        Diezani Alison-Madueke, Nigeria’s former petroleum
                        minister, facing multiple charges abroad — including in
                        the UK and the U.S.
                      </p>

                      <p>This film explores the deeper questions:</p>

                      <ul>
                        <li>What happens when power meets impunity?</li>
                        <li>Why is justice so often delayed?</li>
                        <li>And who really owns Nigeria’s oil wealth?</li>
                      </ul>

                      <ul className="iiym_highlights">
                        <li>🚫 Censored in Nigeria</li>
                        <li>🛡️ Protected by U.S. free speech laws</li>
                        <li>🌍 Now available to a global audience</li>
                      </ul>

                      <p>
                        Watch the full documentary now — exclusively on{" "}
                        <a href="https://home.withchude.com">withchude.com</a>
                      </p>
                    </div>
                    <img src="/images/iiym/iiym-cover.jpeg" alt="" />
                  </div>
                  <div className="about__body">
                    <div className="about__body__left">
                      <h3>About Chude Jideonwo</h3>
                      <p>
                        Tagged ‘the golden boy of African media’, Chude Jideonwo
                        is a media entrepreneur whose 25-year career spans
                        advertising, public relations, television, radio, print,
                        and digital media.
                      </p>
                      <p>
                        As co-founder and CEO of RED | For Africa, he crafted
                        and led strategies that fueled social movements and
                        shaped national elections across Nigeria, Ghana, Kenya,
                        Sierra Leone, and Senegal. Under his leadership, RED was
                        honored as African Business of the Year alongside
                        Dangote Group and Chandaria Industries.
                      </p>
                      <p>
                        In 2016, after a decade at RED, Chude sensed a calling
                        to a new mission. With no prospect of revenue or
                        recognition, he stepped away from his role to focus on
                        storytelling that uplifts the mind, heart, and spirit,
                        and founded Joy, Inc., a human flourishing company that
                        has partnered with organizations like Ford Motor Company
                        and the Lagos State Government to create safe, nurturing
                        spaces for mental, emotional, and spiritual well-being.
                      </p>
                      <p>
                        In 2020, he also launched #WithChude, a viral podcast
                        featuring conversations with African leaders and
                        celebrities – which has been called the most watched
                        talk show across Africa. Syndicated across three
                        Pan-African networks, hosted exclusively on the
                        streaming platform withChude.com, with tens of millions
                        of views on YouTube, the podcast has become a hub for
                        exploring deeply personal stories about healing,
                        resilience, and growth.
                      </p>
                      <p>
                        He has taught media and communication to undergraduate
                        and postgraduate students at Pan Atlantic University. He
                        has also advised global corporations and nonprofits,
                        including Meta, Google, the Gates Foundation, the
                        African Union, and the governments of the UK and the US,
                        on media strategy, democracy, and human rights.
                      </p>
                      <p>
                        Chude has been a Forbes 30 Under 30 honoree, CNBC Young
                        Business Leader of the Year, an Archbishop Desmond Tutu
                        Fellow, and a World Fellow at Yale University. He has
                        served on boards that include Microsoft 4Afrika, the
                        Oando Foundation, and The Initiative for Equal Rights,
                        where he is the current chair. As a filmmaker, his
                        documentaries have been nominated or won for ‘Best
                        Documentary’, ‘Best ‘Feature’ and ‘Official Selection’
                        at the Africa International Film Festival, the Africa
                        Magic Viewers Choice Awards, the San Diego Black Film
                        Festival, amongst others. In 2024, he was appointed
                        Creative-In-Residence at the London School of Economics.
                      </p>
                      <p>
                        His writing and work have been featured in The New York
                        Times, The Guardian, BBC, CNN, Al Jazeera, The
                        Huffington Post, and The Financial Times. He is the
                        author of two books: Are We the Turning Point
                        Generation? and How to Win Elections in Africa:
                        Parallels with Donald Trump. His forthcoming book, How
                        Depression Saved My Life, will be published by Narrative
                        Landscape in August 2025.
                      </p>
                    </div>
                    <img src="/images/iiym/chude.JPG" alt="" />
                  </div>
                </div>
              </main>
              <Footer className="no-scroll" />
            </div>
            <PostPage />
          </div>
        </div>
      </motion.main>
    </>
  );
}
