import axios from "axios";
import { DISCORD_CHANNEL_WEBHOOK_URL } from "./env";

const main = async () => {
  const message = {
    content: "trying @everyone tests!",
  };

  await axios.post(DISCORD_CHANNEL_WEBHOOK_URL, message);
};

main();
