import * as Axios from "./index";

const doChat = async ({ text, scenario, intent_history, argv }) => {
  return Axios.Post("/api/chat", { text, scenario, intent_history, argv }).then(res => res.data.result);
};

export { doChat };
