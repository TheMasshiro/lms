import axios from "axios";

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_WEBHOOK_ID = process.env.PAYMONGO_WEBHOOK_ID;

const enablePaymongoWebhook = async () => {
  try {
    const response = await axios.post(
      `https://api.paymongo.com/v1/webhooks/${PAYMONGO_WEBHOOK_ID}/enable`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            PAYMONGO_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const enabled = response.data.data.attributes.status;
    console.log("Webhook enabled:", enabled);
  } catch (error) {
    console.log("Webhook is already enabled");
  }
};

export default enablePaymongoWebhook;