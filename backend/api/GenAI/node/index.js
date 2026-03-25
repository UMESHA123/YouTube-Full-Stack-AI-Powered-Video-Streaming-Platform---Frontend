import { llm } from "../llm/index.js";
import axios from "axios";
import { PromptGeneratorSchema, PromptResponse } from "../schema/index.js";
import { CommentPromptGeneratorPrompt, GeneratorPrompt, ResponseGeneratorPrompt } from "../prompt/index.js";
import { Comment } from "../../models/comment.model.js";
export const PromptGeneratorNode = async (state) => {
  try {
    console.log("Prompt generator state:", state);

    const response = await axios.get(state?.query, { responseType: "text" });
    // console.log("response.data: ",JSON.parse(response?.data));

    const transcriptOnly = JSON.parse(response?.data)
      .map((item) => item.transcript)
      .join(" ");
    console.log("transcriptOnly => ", transcriptOnly);

    const res = await llm
      ?.withStructuredOutput(PromptGeneratorSchema)
      ?.invoke(GeneratorPrompt(transcriptOnly));

    console.log("llm response ", res);

    if (res) {
      state.response = state.response || [];
      state.response.push(res);
      return state;
    }

    throw new Error("Failed to generate prompts keywords");
  } catch (error) {
    console.log("Error in PromptGeneratorNode:", error);
    return state;
  }
};

export const PromptResponseNode = async (state) => {
  try {
    console.log("loadded state is : ", state);
    let response = await llm
      ?.withStructuredOutput(PromptResponse)
      ?.invoke(ResponseGeneratorPrompt(state?.query));
    // console.log("response", response);
    if (response) {
      state.response = state.response || [];
      state.response.push(response);
      return state;
    }
    throw new Error("Faile to generate a prompt response");
  } catch (error) {
    console.log("Error in Prompt response generator: ", error);
  }
};

export const ManualQueryAnsNode = async (state) => {
  try {
    console.log("loadded state is : ", state);
    const response = await axios.get(state?.query?.url, {
      responseType: "text",
    });
    // console.log("response.data: ",JSON.parse(response?.data));

    const transcriptOnly = JSON.parse(response?.data)
      .map((item) => item.transcript)
      .join(" ");
    console.log("transcriptOnly => ", transcriptOnly);

    const res = await llm
      ?.withStructuredOutput(PromptGeneratorSchema)
      ?.invoke(GeneratorPrompt(transcriptOnly));

    console.log("llm response ", res);

    if (res) {
      state.response = state.response || [];
      state.response.push(res);
      return state;
    }

    throw new Error("Failed to generate prompts keywords");
  } catch (error) {
    console.log("error in manual ans generation.");
  }
};

export const CommentPromptGeneratorNode = async (state) => {
  try {
    console.log("loadded state is : ", state);

    const items = await Comment.find({ video: state?.query });
    const combinedString = items.map((item) => item.content).join(" ");

    if (!combinedString) {
      throw new ApiError(500, "Something went wrong");
    }
    const res = await llm
      ?.withStructuredOutput(PromptGeneratorSchema)
      ?.invoke(CommentPromptGeneratorPrompt(combinedString));

    console.log("llm response ", res);

    if (res) {
      state.response = state.response || [];
      state.response.push(res);
      return state;
    }

    throw new Error("Failed to generate prompts keywords");
  } catch (error) {
    console.log("error in comment prompts generation.", error);
  }
};
