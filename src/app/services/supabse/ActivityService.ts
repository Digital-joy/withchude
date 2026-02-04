import { supabase as client } from "../../../App";
import { VideoProps } from "../../types";

export default class ActivityService {
  async fetchActivityTypes() {
    try {
      return await client
        .from("user_activity_types")
        .select("uid,key")
        .then(({ data, error }) => {
          return { data, error };
        });
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
  async log(key: string, action: string | null = null, payload: object | null = null) {
    try {
      return await client.rpc("insert_user_activity", {
        activity_key: key,
        action: action,
        payload: payload,
      });
    } catch (error) {
      console.error(error.message);
      return { error: error.message, data: null };
    }
  }
  async logSignIn() {
    return this.log("SIGNED_IN");
  }
  async logSignOut() {
    return this.log("SIGNED_OUT");
  }
  async logSignUp() {
    return this.log("SIGNED_UP");
  }
  async logAttemptedToWatchVideo(video: VideoProps) {
    return this.log("ATTEMPTED_TO_WATCH_VIDEO", `attempted to watch video: ${video.title}`, {
      id: video.uid,
    });
  }
  async logRedirectedToWatchVideo(video: VideoProps) {
    return this.log("REDIRECTED_TO_WATCH_VIDEO", `redirected to watch video: ${video.title}`, {
      id: video.uid,
    });
  }

  async logPaymentPageRedirect() {
    return this.log("REDIRECTED_TO_PAYMENT_PAGE");
  }
  async logSelectedPaystackPayment() {
    return this.log("SELECTED_PAYSTACK_PAYMENT");
  }
  async logSelectedStripePayment() {
    return this.log("SELECTED_STRIPE_PAYMENT");
  }
  async logSelectedMonthlyPlan() {
    return this.log("SELECTED_MONTHLY_PLAN");
  }
  async logSelectedYearlyPlan() {
    return this.log("SELECTED_YEARLY_PLAN");
  }
  async logAttemptedToPayUsingPaystack() {
    return this.log("ATTEMPTED_TO_PAY_USING_PAYSTACK");
  }
  async logAttemptedToPayUsingStripe() {
    return this.log("ATTEMPTED_TO_PAY_USING_STRIPE");
  }
  async logRedirectedToPaystackPaymentPage() {
    return this.log("REDIRECTED_TO_PAYSTACK_PAYMENT_PAGE");
  }
}
