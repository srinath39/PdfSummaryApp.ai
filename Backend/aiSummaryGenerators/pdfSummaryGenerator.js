const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: `${process.env.GOOGLE_GEMINI_API_KEY}` });

const pdfSummaryGenerator = async (pdfText) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `This is the pdf content ${pdfText} ,Analyze this and provide a short and consise summary , Also provide a list of potential and significant points`,
    });
    return response.text;
};

module.exports = { pdfSummaryGenerator }