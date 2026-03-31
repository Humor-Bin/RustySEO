// @ts-nocheck
import { zhCN } from "@/app/utils/zhCN";
import { Select } from "@mantine/core";
import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const ollamaModels = [
  { value: "llama3.1", label: "Llama-3.1" },
  { value: "mistral", label: "Mistral" },
  { value: "mistral-nemo", label: "Mistral Nemo" },
  { value: "phi3", label: "Phi-3" },
  { value: "gemma2", label: "Gemma 2" },
  { value: "llama2", label: "Llama 2" },
  { value: "codellama", label: "CodeLlama" },
  { value: "orca-mini", label: "Orca Mini" },
  { value: "vicuna", label: "Vicuna" },
  { value: "nous-hermes", label: "Nous-Hermes" },
  { value: "wizard-vicuna", label: "Wizard-Vicuna" },
];

interface OllamaSelectProps {
  closeOllama: () => void;
}

const OllamaSelect: React.FC<OllamaSelectProps> = ({ closeOllama }) => {
  const [model, setModel] = useState<string>("");
  const [prevSelected, setPrevSelected] = useState<string>("");

  const handleModelSelection = async (selectedModel: string) => {
    try {
      const result = await invoke<{ success: boolean }>("ai_model_selected", {
        model: "ollama",
      });
      console.log(result, "This is the model");
      if (result.success) {
        console.log("Model selected successfully");
        toast(zhCN.integrations.ollama.selectedSuccess);
      }

      // Call the Tauri command with the model parameter
      const diskResult = await invoke("write_model_to_disk", {
        model: selectedModel,
      });
      console.log("Model saved to:", diskResult);
      setModel(selectedModel);
    } catch (error) {
      console.error("Failed to save model:", error);
      toast.error(zhCN.integrations.ollama.saveFailed);
    }
  };

  const handleOllamaSelect = (value: string) => {
    setModel(value);
    localStorage.setItem("model", value);
    localStorage.setItem("AI-provider", "ollama");
  };

  useEffect(() => {
    const storedModel = localStorage.getItem("model");
    setPrevSelected(storedModel || "");
    setModel(storedModel || "");
  }, []);

  return (
    <section className="w-full h-full pb-3 overflow-hidden">
      <div className="p-4">
        <h2 className="font-semibold text-sm dark:text-white">
          {zhCN.integrations.ollama.title}
        </h2>

        <ol className="text-sm mt-2 list-decimal list-inside dark:text-white">
          {zhCN.integrations.ollama.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="p-2 px-4">
        <Select
          label={zhCN.integrations.ollama.modelLabel}
          placeholder={zhCN.integrations.ollama.modelPlaceholder}
          value={model}
          data={ollamaModels}
          className="w-full dark:bg-brand-darker dark:text-white"
          onChange={handleOllamaSelect}
        />
      </div>

      <button
        disabled={!model}
        onClick={() => {
          handleModelSelection(model);
          closeOllama();
        }}
        type="button"
        className={`w-[96%] mx-auto flex justify-center mt-2 rounded-md bg-blue-500 text-white px-3 py-1 ${
          !prevSelected && !model ? "bg-gray-500" : ""
        } ${!model ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {zhCN.integrations.ollama.connect}
      </button>
    </section>
  );
};

export default OllamaSelect;
