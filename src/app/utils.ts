import { UserResponse } from "@supabase/supabase-js";
import { supabase } from "../App";
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import { v4 as uuidv4 } from "uuid";
import { VideoProps } from "./types";

export const MAX_PINNED_VIDEOS = 6;

export function formatFileSize(bytes: number, decimalPoint = 2) {
  if (bytes == 0) return "0 Bytes";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function generateUniqueUploadId() {
  return `uqid-${Date.now()}`;
}

export const url = "https://api.cloudinary.com/v1_1/hzxyensd5/image/upload";
export const CLOUD_NAME = "dllm7gfit";
export const UPLOAD_PRESET = "v0vneg9h";

export function encodeImageFileAsURL(file: File, setter: (any: any) => void) {
  var reader = new FileReader();
  reader.onloadend = function () {
    setter(reader.result);
  };
  reader.readAsDataURL(file);
  return reader.result as unknown as string;
}

export function createSnippet(
  snippet: string,
  url: string,
  width = window.innerWidth
) {
  if (snippet && snippet[2]) return snippet;
  else return "";
  // else {
  //   return url
  //     ?.replace(
  //       "upload/sp_auto/",
  //       width < 768
  //         ? `upload/eo_20,so_0/c_crop,h_${innerHeight},w_${innerWidth}/q_auto:best/`
  //         : "upload/eo_20,so_0/"
  //     )
  //     ?.replace(".m3u8", ".mp4");
  // }
}

export function createReel(url: string) {
  return (
    // url
    // .replace("upload/sp_auto/", "upload/eo_20,so_0/c_fit,h_3670,w_2850/f_webm/q_auto:best/e_progressbar:width_2:color_F8A519/")
    // .replace("upload/sp_auto/", "upload/eo_20,so_0/c_fit,h_3670,w_2850/f_webm/q_auto:best/e_progressbar:width_2:color_F8A519/")
    // .replace(".m3u8", ".png")
    url.replace("upload/sp_auto/", "upload/").replace(".m3u8", ".webp")
  );
}

export function createThumbnail(thumbnail: string, url: string) {
  if (thumbnail && thumbnail[2]) return thumbnail;
  else {
    return url
      ?.replace("upload/sp_auto/", "upload/")
      ?.replace(".m3u8", ".webp");
  }
}

export function getInitials(name: string) {
  if (!name) return;
  var names = name.split(" "),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

export function getEmbed(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function toTime(seconds: number) {
  var date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
}

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(" ");
}

export function extractTitleText(tag: string) {
  return titleCase(
    document.querySelector<HTMLElement>(tag).innerText.replace("#", "") + `\n`
  );
}

export function openTwitterWindow(text: string, link: string) {
  const twitterUrl = "https://twitter.com/intent/tweet/";
  const twitterQuery = `text=${text}&url=${link}`;
  return window
    .open(`${twitterUrl}?${encodeURI(twitterQuery)}&`, "_blank")
    .focus();
}

export interface DocumentWithFullscreen extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
}

export function isFullScreen(): boolean {
  const doc = document as DocumentWithFullscreen;
  return !!(
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement
  );
}

interface DocumentElementWithFullscreen extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullscreen?: () => void;
}

export function requestFullScreen(element: DocumentElementWithFullscreen) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
}

export function requestFullScreenPlease(
  element: DocumentElementWithFullscreen
) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
}

export function exitFullScreen(doc: DocumentWithFullscreen) {
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  }
}

export function toogleFullScreen(): void {
  if (isFullScreen()) {
    requestFullScreen(document.documentElement);
  } else {
    exitFullScreen(document);
  }
}

/**
 * Gets and sets the device id
 *
 * @returns a uuid or undefined when local storage is not accessible
 */
export function getDeviceId(): string | undefined {
  try {
    const deviceId = localStorage.getItem("deviceId") || uuidv4();
    localStorage.setItem("deviceId", deviceId);
    return deviceId;
  } catch (e) {
    return undefined;
  }
}

export function copyToClipboard(text) {
  // Check if the Clipboard API is supported
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((res, reject) => reject(undefined));
}

export function getRelatedVideos(
  video: VideoProps,
  videoList: VideoProps[],
  limit?: number
) {
  limit ??= 9;
  const currentKeywords = [
    ...(video.title?.toLowerCase().split(" ") || []),
    ...(video.episode?.toLowerCase().split(" ") || []),
    ...(video.tags || []).map((tag) => tag.toLowerCase()),
    ...(video.tag
      ?.split(",")
      .map((tag) => tag.toLowerCase().trim().replace("#", "")) || []),
  ];

  return videoList
    .filter((vid) => vid.uid !== video.uid) // Exclude the current video
    .map((vid) => {
      // Calculate a score based on relevance
      let score = 0;

      // Title keyword matches
      const titleKeywords = vid.title?.toLowerCase().split(" ") || [];
      if (titleKeywords.some((word) => currentKeywords.includes(word))) {
        score += 2; // Higher weight for title keyword matches
      }

      // Episode keyword matches
      const episodeKeywords = vid.episode?.toLowerCase().split(" ") || [];
      if (episodeKeywords.some((word) => currentKeywords.includes(word))) {
        score += 1; // Lower weight for episode keyword matches
      }

      // Tag matches
      if (
        vid.tags?.some((tag) => currentKeywords.includes(tag.toLowerCase()))
      ) {
        score += 3; // Highest weight for tag matches
      }

      // Tag (comma-separated string) matches
      const extractedTags =
        vid.tag
          ?.split(",")
          .map((tag) => tag.toLowerCase().trim().replace("#", "")) || [];
      if (
        extractedTags.some((extractedTag) =>
          currentKeywords.includes(extractedTag)
        )
      ) {
        score += 3; // Same high weight as the tags property
      }

      return { ...vid, score }; // Attach the score to the video
    })
    .filter((vid) => vid.score > 0) // Only include videos with a positive score
    .sort((a, b) => b.score - a.score) // Sort by relevance score in descending order
    .slice(0, limit); // Limit to certain recommendations
}

export const getVideoTitle = (video: VideoProps) => {
  return (
    video.episode +
    " " +
    (video.episode[0] && video.title[0] ? ":" : "") +
    " " +
    video.title
  );
};

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
           .replace(/\s+/g, '-') // replace spaces with hyphens
           .replace(/-+/g, '-'); // remove consecutive hyphens
  return str;
}

export const isValidUUID = (id: string) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export function formatPhoneNumber(input: string, country: CountryCode) {
  const phoneNumber = parsePhoneNumberFromString(input, country);
  return phoneNumber ? phoneNumber.format('E.164') : null;
}
