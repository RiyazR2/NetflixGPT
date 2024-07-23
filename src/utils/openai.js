import OpenAI from "openai";
import { OPENAI_KEY } from "./constant";

//it is kind of like Authorization function - Helper function
const openai = new OpenAI({
  apiKey: OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

export default openai;
