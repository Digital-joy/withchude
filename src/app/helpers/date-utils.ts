declare global {
  interface Date {
    addMinutes(min: number, sec?: number, ms?: number): Date;
    addHours(hours: number, min?: number, sec?: number, ms?: number): Date;
  }
}

const EPOCH_TIME: string = "1970-01-01T00:00:00.000Z";
const DEFAULT_SURVEY_DELAY_MINUTES: number = 20;
const MIN_SURVEY_GRACE_MINUTES: number = 2;
const MAX_SURVEY_GRACE_MINUTES: number = 10;
const FIRST_INTERACTION_KEY = "firstInteractionTime";
const MIN_SURVEY_GRACE_MILISECONDS: number =
  MIN_SURVEY_GRACE_MINUTES * 60 * 1000;
const MAX_SURVEY_GRACE_MILISECONDS: number =
  MAX_SURVEY_GRACE_MINUTES * 60 * 1000;

  
const DEFAULT_NEWSLETTER_DELAY_MINUTES: number = 20;
const MIN_NEWSLETTER_GRACE_MINUTES: number = 0;
const MAX_NEWSLETTER_GRACE_MINUTES: number = 10;
const MIN_NEWSLETTER_GRACE_MILISECONDS: number =
  MIN_NEWSLETTER_GRACE_MINUTES * 60 * 1000;
const MAX_NEWSLETTER_GRACE_MILISECONDS: number =
  MAX_NEWSLETTER_GRACE_MINUTES * 60 * 1000;

Date.prototype.addMinutes = function (
  this: Date,
  min: number,
  sec?: number,
  ms?: number
): Date {
  this.setMinutes(this.getMinutes() + min);
  return this;
};
Date.prototype.addHours = function (
  this: Date,
  hours: number,
  min?: number,
  sec?: number,
  ms?: number
): Date {
  this.setHours(this.getHours() + hours);
  return this;
};

/**
 * Gets the visibility state of survey popup
 * @returns The state of the survey popup or false if local storage is not accessible
 */
export function surveyCompleted(): boolean {
  try {
    let surveyCompleted = localStorage.getItem("surveyCompleted");
    if (!surveyCompleted) {
      surveyCompleted = "false";
      localStorage.setItem("surveyCompleted", surveyCompleted);
    }

    return surveyCompleted === "true";
  } catch (e) {
    return false;
  }
}

/**
 * Gets the next time for survey popup to get visible
 *
 * @returns the ISO format of the exact date the survey should/will have shown
 */
export function getSurveyPopupTime(): string {
  try {
    const nextTime =
      localStorage.getItem("nextSurveyPopupTime") ??
      new Date().addMinutes(DEFAULT_SURVEY_DELAY_MINUTES).toISOString();
    localStorage.setItem("nextSurveyPopupTime", nextTime);
    return nextTime;
  } catch (e) {
    return new Date().addMinutes(DEFAULT_SURVEY_DELAY_MINUTES).toISOString();
  }
}

/**
 *  Gets the first time the website has been used since a given long time
 *
 * @returns the ISO format of the exact date the survey should/will have shown
 */
export function getFirstInteractionTime(): string {
  try {
    const time =
      localStorage.getItem(FIRST_INTERACTION_KEY) ?? new Date().toISOString();
    localStorage.setItem(FIRST_INTERACTION_KEY, time);
    return time;
  } catch (e) {
    return new Date().toISOString();
  }
}

/**
 * Checks if the first time since first interaction is within acceptable limits
 *
 * @returns the ISO format of the exact date.
 */
export function firstInteractionTimeIsWithinLimits(min?: number, max?: number): boolean {
  min ??= MIN_SURVEY_GRACE_MILISECONDS;
  max ??= MAX_SURVEY_GRACE_MILISECONDS;

  try {
    const now = new Date();
    const firstInteraction = new Date(getFirstInteractionTime());

    const elapsedTime = now.getTime() - firstInteraction.getTime();

    return (
      elapsedTime >= min &&
      elapsedTime <= max
    );
  } catch (e) {
    return false;
  }
}

/**
 * Checks if the time since first interaction has exceeded acceptable limits
 *
 * @returns the ISO format of the exact date.
 */
export function firstInteractionTimeHasExceeded(max?: number): boolean {
  max ??= MAX_SURVEY_GRACE_MILISECONDS;
  try {
    const now = new Date();
    const firstInteraction = new Date(getFirstInteractionTime());

    const elapsedTime = now.getTime() - firstInteraction.getTime();

    return elapsedTime > max;
  } catch (e) {
    return false;
  }
}

export function resetFirstInteractionTime(): boolean {
  try {
    localStorage.setItem(FIRST_INTERACTION_KEY, new Date().toISOString());
    return true;
  } catch (e) {
    return false;
  }
}

export function checkFirstInteractionTime(): void {
  try {
    if(firstInteractionTimeHasExceeded()) {
      resetFirstInteractionTime()
    }
  } catch (e) {
    // 
  }
}

export function surveyPopupIsShown(): boolean {
  return surveyCompleted()
    ? false
    : (new Date(getSurveyPopupTime()) <= new Date() && firstInteractionTimeIsWithinLimits());
}

/**
 * Sets the next survey time to the epoch
 */
export function disableSurveyPopup(): void {
  try {
    localStorage.setItem("nextSurveyPopupTime", EPOCH_TIME);
  } catch (e) {
    console.log("Unable to set survey popup time in local storage. Error:", e);
  }
}

export function markSurveyAsCompleted(): void {
  try {
    localStorage.setItem("surveyCompleted", "true");
    disableSurveyPopup();
  } catch (e) {
    console.log("Unable to set survey popup time in local storage. Error:", e);
  }
}

/**
 * Extends popup time by a few days to avoid annoyance
 *
 * @param days Number of days to extend survey popup
 */
export function extendSurveyPopup(days: number = 7): void {
  try {
    const nextFewDays = new Date().addHours(24 * days);
    localStorage.setItem("nextSurveyPopupTime", nextFewDays.toISOString());
  } catch (e) {
    console.log("Unable to set survey popup time in local storage. Error:", e);
  }
}

/**
 * Gets the visibility state of support popup
 * @returns The state of the support popup or false if local storage is not accessible
 */
export function supportPopupDisabled(): boolean {
  try {
    let supportPopupDisabled = localStorage.getItem("supportPopupDisabled");
    if (!supportPopupDisabled) {
      supportPopupDisabled = "false";
      localStorage.setItem("supportPopupDisabled", supportPopupDisabled);
    }

    return supportPopupDisabled === "true";
  } catch (e) {
    return false;
  }
}

export function disableSupportPopup(): void {
  try {
    localStorage.setItem("supportPopupDisabled", "true");
  } catch (e) {
    console.log(
      "Unable to set support popup visibility in local storage. Error:",
      e
    );
  }
}



// Concerning Newsletter



/**
 * Checks if the first time since first interaction is within acceptable limits
 *
 * @returns the ISO format of the exact date.
 */
export function firstNewsletterInteractionTimeIsWithinLimits(): boolean {
  try {
    const now = new Date();
    const firstInteraction = new Date(getFirstInteractionTime());

    const elapsedTime = now.getTime() - firstInteraction.getTime();

    return (
      elapsedTime >= MIN_SURVEY_GRACE_MILISECONDS &&
      elapsedTime <= MAX_SURVEY_GRACE_MILISECONDS
    );
  } catch (e) {
    return false;
  }
}

/**
 * Gets the visibility state of newsletter popup
 * @returns The state of the newsletter popup or false if local storage is not accessible
 */
export function newsletterCompleted(): boolean {
  try {
    let newsletterCompleted = localStorage.getItem("newsletterCompleted");
    if (!newsletterCompleted) {
      newsletterCompleted = "false";
      localStorage.setItem("newsletterCompleted", newsletterCompleted);
    }

    return newsletterCompleted === "true";
  } catch (e) {
    return false;
  }
}

/**
 * Gets the next time for newsletter popup to get visible
 *
 * @returns the ISO format of the exact date the newsletter should/will have shown
 */
export function getNewsletterPopupTime(): string {
  try {
    const nextTime =
      localStorage.getItem("nextNewsletterPopupTime") ??
      new Date().addMinutes(DEFAULT_NEWSLETTER_DELAY_MINUTES).toISOString();
    localStorage.setItem("nextNewsletterPopupTime", nextTime);
    return nextTime;
  } catch (e) {
    return new Date().addMinutes(DEFAULT_NEWSLETTER_DELAY_MINUTES).toISOString();
  }
}

export function newsletterPopupIsShown(): boolean {
  return newsletterCompleted()
    ? false
    : (new Date(getNewsletterPopupTime()) <= new Date()
    // && firstInteractionTimeIsWithinLimits(MIN_NEWSLETTER_GRACE_MILISECONDS, MAX_NEWSLETTER_GRACE_MILISECONDS)
  );
}

/**
 * Sets the next newsletter time to the epoch
 */
export function disableNewsletterPopup(): void {
  try {
    localStorage.setItem("nextNewsletterPopupTime", EPOCH_TIME);
  } catch (e) {
    console.log("Unable to set newsletter popup time in local storage. Error:", e);
  }
}

export function markNewsletterAsCompleted(): void {
  try {
    localStorage.setItem("newsletterCompleted", "true");
    disableNewsletterPopup();
  } catch (e) {
    console.log("Unable to set newsletter popup time in local storage. Error:", e);
  }
}


/**
 * Extends popup time by a few days to avoid annoyance
 *
 * @param days Number of days to extend survey popup
 */
export function extendNewsletterPopup(days: number = 7): void {
  try {
    const nextFewDays = new Date().addHours(24 * days);
    localStorage.setItem("nextNewsletterPopupTime", nextFewDays.toISOString());
  } catch (e) {
    console.log("Unable to set newsletter popup time in local storage. Error:", e);
  }
}


//  Concerning contact details popup


/**
 * Gets the visibility state of contactDetails popup
 * @returns The state of the contactDetails popup or false if local storage is not accessible
 */
export function contactDetailsCompleted(): boolean {
  try {
    let contactDetailsCompleted = localStorage.getItem("contactDetailsCompleted");
    if (!contactDetailsCompleted) {
      contactDetailsCompleted = "false";
      localStorage.setItem("contactDetailsCompleted", contactDetailsCompleted);
    }

    return contactDetailsCompleted === "true";
  } catch (e) {
    return false;
  }
}

/**
 * Gets the next time for contactDetails popup to get visible
 *
 * @returns the ISO format of the exact date the contactDetails should/will have shown
 */
export function getContactDetailsPopupTime(): string {
  try {
    const nextTime =
      localStorage.getItem("nextContactDetailsPopupTime") ??
      new Date().addMinutes(DEFAULT_NEWSLETTER_DELAY_MINUTES).toISOString();
    localStorage.setItem("nextContactDetailsPopupTime", nextTime);
    return nextTime;
  } catch (e) {
    return new Date().addMinutes(DEFAULT_NEWSLETTER_DELAY_MINUTES).toISOString();
  }
}

export function contactDetailsPopupIsShown(): boolean {
  return contactDetailsCompleted()
    ? false
    : (new Date(getContactDetailsPopupTime()) <= new Date()
    // && firstInteractionTimeIsWithinLimits(MIN_NEWSLETTER_GRACE_MILISECONDS, MAX_NEWSLETTER_GRACE_MILISECONDS)
  );
}

/**
 * Sets the next contactDetails time to the epoch
 */
export function disableContactDetailsPopup(): void {
  try {
    localStorage.setItem("nextContactDetailsPopupTime", EPOCH_TIME);
  } catch (e) {
    console.log("Unable to set contactDetails popup time in local storage. Error:", e);
  }
}

export function markContactDetailsAsCompleted(): void {
  try {
    localStorage.setItem("contactDetailsCompleted", "true");
    disableContactDetailsPopup();
  } catch (e) {
    console.log("Unable to set contactDetails popup time in local storage. Error:", e);
  }
}


/**
 * Extends popup time by a few days to avoid annoyance
 *
 * @param days Number of days to extend survey popup
 */
export function extendContactDetailsPopup(days: number = 7): void {
  try {
    const nextFewDays = new Date().addHours(24 * days);
    localStorage.setItem("nextContactDetailsPopupTime", nextFewDays.toISOString());
  } catch (e) {
    console.log("Unable to set contactDetails popup time in local storage. Error:", e);
  }
}
