import { useContext, useEffect, useRef, useState } from "react";
import PopupWrapper, { IPopupWrapper } from "./PopupWrapper";
import StarAltIcon from "../../icons/star-alt";
import { User } from "@supabase/supabase-js";
import { SessionContext } from "../../App";
import { useAppDispatch, useAppSelector } from "../../app/redux/hooks";
import { setShareShown } from "../../app/redux/reducers/shareSlice";
import XSvg from "../../icons/x";
import FbIcon from "../../icons/FbIcon";
import ChainLinkIcon from "../../icons/ChainLinkIcon";
import FbSvg from "../../icons/fb";
import FbIconAlt from "../../icons/FbIconAlt";
import XIcon from "../../icons/XIcon";
import InstagramIcon from "../../icons/InstagramIcon";
import TelegramIcon from "../../icons/TelegramIcon";
import { copyToClipboard } from "../../app/utils";
import { setToastProps, setToastShown } from "../../app/redux/reducers/toastSlice";
import { showToaster } from "../Toast";
import WhatsappIcon from "../../icons/WhatsappIcon";
import LinkedinIcon from "../../icons/LinkedinIcon";

export interface ISharePopup extends IPopupWrapper {}
interface SocialLink {
  name: string;
  icon: React.FC<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
  link: (url: string) => string;
}

const SharePopup: React.FC<ISharePopup> = ({
  onClose,
  className,
  children,
  ...popupProps
}) => {
  const dispatch = useAppDispatch();
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const shareProps = useAppSelector((state) => state.share);
  const url = window.location.href;

  const socialLinks: SocialLink[] = [
    {
      name: "facebook",
      icon: FbIconAlt,
      link: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      icon: XIcon,
      link: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      link: (url: string) => `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      link: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsappIcon,
      link: (url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      link: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const handleClose = () => {
    setShareShown(false);
    onClose();
  };

  const handleCopyToClipboard = () => {
    copyToClipboard(url)
      .then(() => {
        console.log('Copied to clipboard.')
        dispatch(showToaster({
          message: 'Copied to clipboard.',
          show: true,
          persist: false,
          timeout: 500
        }))
        setTimeout(() => {
          dispatch(setToastShown(false))
        }, 2500);
      })
  };

  if (!shareProps.show) return null;
  return (
    <PopupWrapper
      onClose={handleClose}
      className={`Popup Share_Popup ${className}`}
      {...popupProps}
    >
      <section className="Share_Popup__wrapper Signup__form">
        <div className="Share_Popup__heading">
          <h1>Share</h1>
        </div>

        <div className="Share_Popup__content socials">
          <div className="social" onClick={handleCopyToClipboard}>
            <ChainLinkIcon className="social__icon" />
          </div>
          {socialLinks.map((social, i) => (
            <a href={social.link(url)} target="_blank" key={i} className="social">
              <social.icon className="social__icon" />
            </a>
          ))}
        </div>
      </section>
    </PopupWrapper>
  );
};

export default SharePopup;
