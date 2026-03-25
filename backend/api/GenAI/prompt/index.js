export const GeneratorPrompt = (text) => `
You are an AI that generates short, actionable prompts for a YouTube video transcripts.

Input transcript:
"${text}"


`;

export const ResponseGeneratorPrompt = (query) => {
  return `You are an AI that generates a short answer for a user's query.
Please respond only in JSON format with the following structure:

{
  "answer": "your short answer here",
  "keywords": ["sentance1", "sentance2"]
}

Query:
"${query}"`;
};


export const CommentPromptGeneratorPrompt = (text) => `
You are an AI that generates short, actionable prompts for a YouTube video comment.

Input comment:
"${text}"


`;