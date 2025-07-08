
// import { PromptTemplate } from "@langchain/core/prompts";
// import { ChatOpenAI } from "@langchain/openai";
// import { LLMChain } from "langchain/chains";

// const chat = new ChatOpenAI({ temperature: 0.7 });

// export async function generateSummary(jobDesc) {
//   const prompt = PromptTemplate.fromTemplate(
//     "Summarize this job description in 2 lines:\n\n{jobDesc}"
//   );
//   const chain = new LLMChain({ llm: chat, prompt });
//   const res = await chain.call({ jobDesc });
//   return res.text.trim();
// }

// export async function generateTips(resume, jobDesc) {
//   const prompt = PromptTemplate.fromTemplate(
//     "Based on this resume:\n{resume}\nAnd this job description:\n{jobDesc}\nGive 3 concise tips to improve the resume for this job."
//   );
//   const chain = new LLMChain({ llm: chat, prompt });
//   const res = await chain.call({ resume, jobDesc });
//   // split lines and clean
//   return res.text.split("\n").map(s => s.replace(/^[0-9\.\-\s]+/, "").trim()).filter(Boolean);
// }
