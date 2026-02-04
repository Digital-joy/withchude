import { supabase as client } from "../../../App";

export default class PaymentService {
  async paidViaPaystack(subscriptionId?: string, email?: string) {
    return fetch(`${process.env.SERVER_URL}/retrieve/paystack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: subscriptionId || "",
        email: email,
      }),
    }).then(async (res) => {
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    });
  }
  async createSingleItemCheckoutSession(price_id: string, quantity: number): Promise<{
    data: {
      url: string
    },
    error: null
  } |
  {
    data: null,
    error: string;
  }> {
    return fetch(`${process.env.SERVER_URL}/stripe/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_id,
        quantity
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();

        return {
          data: {
            url: data.url
          },
          error: null
        }
      } else {
        return {
          data: null,
          error: res.statusText
        };
      }
    }).catch(() => {
      return {
        data: null,
        error: "Some error occured. Check internet connection and try again."
      }
    });
  }
}
