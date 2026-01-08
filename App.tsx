import React, { useState } from "react";
import { PromptInput } from "./ui/PromptInput";
import { Editor } from "./ui/Editor";
import { generateDraft } from "./server/generate";
import { buildDocumentFromData } from "./editor/documentBuilder";
import { Node } from "prosemirror-model";

export default function App() {
  const [docNode, setDocNode] = useState<Node | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);

    // Simulate network delay for better UX feel if AI is too fast
    // await new Promise(r => setTimeout(r, 800));

    const response = await generateDraft(prompt);

    if (response.success && response.data) {
      const newNode = buildDocumentFromData(response.data);
      setDocNode(newNode);
      setHasStarted(true);
    } else {
      alert("Error generating draft: " + response.error);
    }

    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!docNode) return;

    // Build HTML content for Word
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { color: #2563eb; font-size: 24px; margin-top: 20px; margin-bottom: 10px; }
    p { margin: 8px 0; }
  </style>
</head>
<body>
`;

    docNode.forEach((node) => {
      if (node.type.name === "section") {
        // Extract title (heading)
        const titleNode = node.child(0);
        htmlContent += `  <h1>${titleNode.textContent}</h1>\n`;

        // Extract paragraphs
        node.forEach((child) => {
          if (child.type.name === "paragraph") {
            htmlContent += `  <p>${child.textContent}</p>\n`;
          }
        });
      }
    });

    htmlContent += `
</body>
</html>`;

    // Create and download file as .doc (HTML format that Word can open)
    const blob = new Blob([htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h1 className="font-semibold text-gray-800 tracking-tight">
              Agentic Document Assistant
            </h1>
          </div>
          <div className="text-sm text-gray-500 font-medium">
            Structure-First AI Editor
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-12">
        {/* Input Area - always visible but changes context */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            hasStarted
              ? "opacity-0 h-0 overflow-hidden mb-0"
              : "opacity-100 mb-12"
          }`}
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              What do you want to draft today?
            </h2>
            <p className="text-lg text-gray-600">
              Enter a request, and I'll build a structured starting point.
            </p>
          </div>
          <PromptInput
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        {/* Editor Area */}
        <div
          className={`transition-opacity duration-700 ${
            hasStarted ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Document Preview
            </h3>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download
              </button>
              <button
                onClick={() => setHasStarted(false)}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                New Draft
              </button>
            </div>
          </div>
          <Editor initialDoc={docNode} />
        </div>
      </main>
    </div>
  );
}
