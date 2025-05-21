import axios from "axios";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_WEBHOOK_URL = process.env.PAYMONGO_WEBHOOK_URL;

// Don't run this function in production, it is only for testing purposes
// and should be run only once to create the webhook. If you need to update the webhook, please do it manually in the Paymongo dashboard.
// This function creates a webhook for Paymongo to listen to events like payment.paid, payment.failed, etc.
// -jc

const paymongoWH = async () => {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/webhooks",
      {
        data: {
          attributes: {
            url: PAYMONGO_WEBHOOK_URL,
            events: [
              "source.chargeable",
              "payment.failed",
              "payment.paid",
              "checkout_session.payment.paid",
            ],
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            PAYMONGO_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { live_mode, secret_key, status } = response.data.data.attributes;
    // do not log success
  } catch (error) {
    console.error(
      "Error creating webhook:",
      error.response?.data || error.message
    );
  }
};

paymongoWH();

export default paymongoWH;
