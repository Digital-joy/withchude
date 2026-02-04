import React, { useContext, useEffect, useRef, useState } from "react";
import CloseSvg from "../icons/close";
import { Link } from "react-router-dom";

export interface IEventSection
  extends React.ComponentPropsWithoutRef<"section"> {}

const EventSection: React.FC<IEventSection> = ({
  className,
  children,
  ...sectionProps
}) => {
  return (
    <section className={`Event__Section ${className}`} {...sectionProps}>
      <div className="Event__Section__wrapper withchude_live_background">
        <h2>Get your tickets for the first-ever #WithChude Live!</h2>
        <Link to={"//event.withchude.com"} target="_blank" className="Updates__cta">
          Get tickets
        </Link>
        <img src="/images/banners/withchude_live_banner_adichie.jpg" className="banner banner__mobile" alt="" />
        <img src="/images/banners/withchude_live_banner.png" className="banner banner__desktop" alt="" />
      </div>
    </section>
  );
};

export default EventSection;
