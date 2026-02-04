import { Link } from "react-router-dom"
import FbSvg from "../icons/fb"
import IgSvg from "../icons/ig"
import MailSvg from "../icons/mail"
import TelSvg from "../icons/tel"
import ThreadSvg from "../icons/thread"
import XSvg from "../icons/x"
import YoutubeSvg from "../icons/youtube"

export interface IFooter extends React.ComponentPropsWithoutRef<'section'>{}
const Footer: React.FC<IFooter> = ({
  className,
  ...sectionProps
}) => {
  return (
    <section className={`Footer withchude_live_background ${className}`} {...sectionProps}>
      <div className="Footer__top withchude_live_background">
        <h3 className="Footer__heading">Stories that strengthen the mind 🧠, heart ❤️ and spirit 🌀.</h3>
        <ul className="Footer__features">
          <p className="Footer__features__intro">As Featured in</p>
          <a
            href="https://www.bellanaija.com/2022/10/chude-jideonwo-awaiting-trial-episode-1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className="Footer__feature">
              <img alt="" src="/images/feature1.png" />
            </li>
          </a>
          <a
            href="https://www.nytimes.com/2019/11/02/world/africa/nigerian-women-me-too-sexual-abuse-harassment.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className="Footer__feature">
              <img alt="" src="/images/feature2.png" />
            </li>
          </a>
          <a href="http://thenativemag.com/end-sars-documentary-chude/" target="_blank" rel="noopener noreferrer">
            <li className="Footer__feature">
              <img alt="" src="/images/feature3.png" data-alt />
            </li>
          </a>
          <a href="https://www.bbc.com/pidgin/articles/c3gyxx49xjxo" target="_blank" rel="noopener noreferrer">
            <li className="Footer__feature">
              <img alt="" src="/images/feature4.png" />
            </li>
          </a>
          <a
            href="https://opencountrymag.com/families-of-sars-victims-speak-in-devastating-documentary/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className="Footer__feature">
              <img alt="" src="/images/feature5.png" />
            </li>
          </a>
          <a
            href="https://www.forbes.com/sites/mfonobongnsehe/2018/02/06/this-33-year-old-nigerian-entrepreneur-has-launched-a-startup-to-spread-happiness-across-africa/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <li className="Footer__feature">
              <img alt="" src="/images/feature6.png" />
            </li>
          </a>
        </ul>
      </div>
      <div className="Footer__bottom">
        <a href="tel:+2348094321111" className="Footer__tel">
          <TelSvg />
          +2348094321111
        </a>
        <a href="mailto:info@withchude.com" className="Footer__mail">
          <MailSvg />
          info@withchude.com
        </a>
        <p className="Footer__copyright">(c) WithChude, 2025. All rights reserved.</p>
      </div>
      <div className="Footer__footer">
        <div className="Footer__footer__links">
          <Link to="/about">About</Link>
          {/* <a href="/">Be a Guest</a> */}
          <Link to="/shop">Shop</Link>
          <Link to="/events">Events</Link>
          <Link to="/impact">Impact</Link>
          <a href="https://t.me/WithChude_Community" target="_blank">
            Telegram Community
          </a>
          <Link to="/contact">Contact</Link>
          <Link to="https://me.withchude.com/updates/" target="_blank">
            Updates
          </Link>
        </div>
        <div className="Footer__footer__socials">
          <a href="https://t.me/WithChude_Community" target="_blank" rel="noopener noreferrer">
            <ThreadSvg />
          </a>
          <a href="https://x.com/chude" target="_blank" rel="noopener noreferrer">
            <XSvg />
          </a>
          <a href="https://web.facebook.com/WithChude" target="_blank" rel="noopener noreferrer">
            <FbSvg />
          </a>
          <a href="https://www.instagram.com/chudeity" target="_blank" rel="noopener noreferrer">
            <IgSvg />
          </a>
          <a href="https://www.youtube.com/@WithChude" target="_blank" rel="noopener noreferrer">
            <YoutubeSvg />
          </a>
        </div>
      </div>
    </section>
  )
}

export function FooterLite() {
  return (
    <section className="FooterLite">
      <div className="Footer__footer">
        <div className="Footer__footer__links">
          <Link to="/about">About</Link>
          {/* <a href="/">Be a Guest</a> */}
          <Link to="/shop">Shop</Link>
          <Link to="/events">Events</Link>
          <Link to="/impact">Impact</Link>
          <a href="https://t.me/WithChude_Community" target="_blank">
            Telegram Community
          </a>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <Link to="https://me.withchude.com/updates/" target="_blank">
            Updates
          </Link>
        </div>
        <p className="Footer__copyright" data-mobile>
          (c) WithChude, 2025. All rights reserved.
        </p>
        <div className="Footer__footer__socials">
          <a href="https://t.me/WithChude_Community" target="_blank" rel="noopener noreferrer">
            <ThreadSvg />
          </a>
          <a href="https://x.com/chude" target="_blank" rel="noopener noreferrer">
            <XSvg />
          </a>
          <a href="https://web.facebook.com/WithChude" target="_blank" rel="noopener noreferrer">
            <FbSvg />
          </a>
          <a href="https://www.instagram.com/chudeity" target="_blank" rel="noopener noreferrer">
            <IgSvg />
          </a>
          <a href="https://www.youtube.com/@WithChude" target="_blank" rel="noopener noreferrer">
            <YoutubeSvg />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Footer;