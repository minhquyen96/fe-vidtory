import { GoogleGenAI } from "@google/genai";
import { AppMode, ComicInputs, AdInputs, InfoInputs, InputUnion, TASK_ACTIONS } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateCreativeContent = async (
  mode: AppMode,
  inputs: InputUnion
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  
  // Use user selected aspect ratio or default based on mode if missing (fallback)
  const userAspectRatio = inputs.aspectRatio || (mode === AppMode.INFOGRAPHIC ? "9:16" : (mode === AppMode.COMIC ? "3:4" : "4:3"));

  // Construct Prompt based on Mode
  switch (mode) {
    case AppMode.COMIC: {
      const i = inputs as ComicInputs;
      let styleInstructions = i.style;
      
      if (i.selectedManga && i.selectedManga !== 'Any Style') {
        styleInstructions += `. Art Style Influence: Strongly reference the visual style of ${i.selectedManga}`;
      }

      // Handle Task Action
      let taskInstruction = "";
      // Find the prompt associated with the selected task ID (defaulting to English prompts for the AI)
      const taskObj = TASK_ACTIONS['en'].find(t => t.id === i.taskAction);
      if (taskObj) {
        taskInstruction = `Task Goal: ${taskObj.prompt}`;
      }

      prompt = `Generate an image of a full single-page comic book layout.
      
      ${taskInstruction}
      
      Story Context: ${i.story}.
      
      Layout Requirement: A dynamic page layout containing exactly ${i.frameCount} panels. 
      Optimize the panel arrangement (sizes and shapes) to best fit the narrative flow.
      
      Parameters:
      - Art Style: ${styleInstructions}
      
      The image must be a complete page composition telling a sequential visual story based on the provided context. 
      Ensure consistent character design, high-quality rendering, and clear panel separation. 
      Do not add speech bubbles unless implied by the action.
      
      Generate ONLY the image. Do not output any text.`;
      break;
    }
    case AppMode.ADVERTISING: {
      const i = inputs as AdInputs;
      const hasRefs = inputs.referenceImages && inputs.referenceImages.length > 0;
      
      // AUTO MODE LOGIC
      if (i.adMode === 'auto' && i.url) {
        // Step 1: Use Text Model with Search to analyze the URL
        try {
           const textResponse = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `Analyze this URL: ${i.url}. 
             Extract the Brand Name, Product features, and Visual Identity. 
             Then, write a detailed image generation prompt for a high-quality advertising poster for this brand/product.
             The prompt should describe the composition, lighting, and style.
             Output ONLY the image generation prompt.`,
             config: {
               tools: [{ googleSearch: {} }]
             }
           });
           
           if (textResponse.text) {
             prompt = `${textResponse.text} \n\n Generate ONLY the image based on this description. Do not output text.`;
             if (hasRefs) {
                 prompt += `\n\nCRITICAL: Use the attached images as a strong visual reference for the style, color palette, or composition.`;
             }
           } else {
             // Fallback if search fails
             prompt = `Generate a high-quality advertisement poster for the website: ${i.url}. Modern, professional design. Generate ONLY the image.`;
           }
        } catch (err) {
            console.error("Auto mode search failed", err);
            prompt = `Generate a high-quality advertisement poster for the website: ${i.url}. Modern, professional design. Generate ONLY the image.`;
        }

      } else {
        // MANUAL MODE LOGIC
        const promptLines = [
          "Generate an image of a professional advertisement design poster.",
          `Brand Name: ${i.brandName}.`
        ];
        if (i.headline) {
          promptLines.push(`Headline Text: ${i.headline} (Ensure text is legible and visually integrated).`);
        }
        if (i.description) {
          promptLines.push(`Product/Service Description: ${i.description}.`);
        }
        if (i.targetAudience) {
          promptLines.push(`Target Audience: ${i.targetAudience}.`);
        }
        
        // Remove manual style input logic. Use auto-detection.
        promptLines.push("Automatically analyze the brand and description to determine the most suitable professional Art Direction and Visual Style.");
        
        // Broad instruction for Reference Images (can be style or assets)
        if (hasRefs) {
             promptLines.push("CRITICAL: Use the attached images as visual references. If they contain products or logos, composite them naturally into the final design. If they are style references, copy the artistic style/mood.");
        }

        promptLines.push("Create a compelling, high-conversion visual layout suitable for a digital campaign. Generate ONLY the image. Do not output any text.");
        prompt = promptLines.join('\n');
      }
      break;
    }
    case AppMode.INFOGRAPHIC: {
      const i = inputs as InfoInputs;
      // Conditionally build the prompt
      const promptLines = [
        "Generate an image of an educational and visually engaging infographic.",
        `Main Topic: ${i.topic}.`
      ];
      if (i.dataPoints) {
        promptLines.push(`Key Data/Points to Visualize: ${i.dataPoints}.`);
      }
      if (i.description) {
        promptLines.push(`Summary/Context: ${i.description}.`);
      }
      promptLines.push(`Design Style: ${i.style}.`);
      promptLines.push("Use icons, charts, and clear typography to organize information hierarchically. Generate ONLY the image. Do not output any text.");

      prompt = promptLines.join('\n');
      break;
    }
  }

  const parts: any[] = [];
  
  // Add reference images if exists
  if (inputs.referenceImages && inputs.referenceImages.length > 0) {
    for (const file of inputs.referenceImages) {
      const imagePart = await fileToGenerativePart(file);
      parts.push(imagePart);
    }
    if (mode !== AppMode.ADVERTISING) {
        // General instructions for non-ad modes
        prompt += `\n\nUse the attached ${inputs.referenceImages.length} image(s) as visual references for color palette, composition, character design, or subject matter.`;
    }
  }

  parts.push({ text: prompt });

  try {
    // Using gemini-2.5-flash-image for fast, free generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
            aspectRatio: userAspectRatio,
        }
      }
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        
        // If no image found, check for text (refusal/error message from model)
        const textPart = response.candidates[0].content.parts.find(p => p.text);
        if (textPart && textPart.text) {
            throw new Error(`Model response: ${textPart.text}`);
        }
    }
    
    throw new Error("No image generated in response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};