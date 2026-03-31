// @ts-nocheck
"use client";
import openBrowserWindow from "@/app/Hooks/OpenBrowserWindow";
import { zhCN } from "@/app/utils/zhCN";
import { useFetch } from "@mantine/hooks";
import { invoke } from "@tauri-apps/api/core";
import React, { useCallback, useEffect, useId, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { toast } from "sonner";

const GoogleSearchConsoleModal = ({ onSubmit, close }) => {
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    clientSecret: "",
    url: "",
    propertyType: "",
    range: "",
    rows: "",
  });

  const [errors, setErrors] = useState({});

  const searchTypes = [
    { value: "domain", label: zhCN.integrations.gscModal.searchTypes.domain },
    { value: "site", label: zhCN.integrations.gscModal.searchTypes.site },
  ];

  const durations = [
    { value: "1 month", label: zhCN.integrations.gscModal.durations.oneMonth },
    { value: "3 months", label: zhCN.integrations.gscModal.durations.threeMonths },
    { value: "6 months", label: zhCN.integrations.gscModal.durations.sixMonths },
    { value: "12 months", label: zhCN.integrations.gscModal.durations.twelveMonths },
    { value: "16 months", label: zhCN.integrations.gscModal.durations.sixteenMonths },
  ];

  const rows = [
    { value: "1000", label: "1000" },
    { value: "5000", label: "5000" },
    { value: "10000", label: "10000" },
    { value: "25000", label: zhCN.integrations.gscModal.rows.max },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientId.trim()) {
      newErrors.clientId = zhCN.integrations.gscModal.errors.clientIdRequired;
    }
    if (!formData.projectId.trim()) {
      newErrors.projectId = zhCN.integrations.gscModal.errors.projectIdRequired;
    }
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret =
        zhCN.integrations.gscModal.errors.clientSecretRequired;
    }
    if (!formData.url.trim()) {
      newErrors.url = zhCN.integrations.gscModal.errors.urlRequired;
    }
    if (!formData.propertyType) {
      newErrors.propertyType =
        zhCN.integrations.gscModal.errors.propertyTypeRequired;
    }
    if (!formData.range) {
      newErrors.range = zhCN.integrations.gscModal.errors.rangeRequired;
    }

    if (!formData.rows) {
      newErrors.rows = zhCN.integrations.gscModal.errors.rowsRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = async () => {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    getCurrentWindow().close();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
      try {
        invoke("set_google_search_console_credentials", {
          credentials: formData,
        }).then(() => {
          console.log("Credentials saved successfully");
          toast.success(zhCN.integrations.gscModal.toasts.saved);
          close();
        });
      } catch (error) {
        console.error("Failed to save credentials:", error);
        toast.error(zhCN.integrations.gscModal.toasts.failed);
      }
    }
  };

  return (
    <section>
      <div className="max-w-md mx-auto -mt-3 p-2 px-3 pb-5 bg-white dark:bg-brand-darker dark:text-white rounded-lg text-xs">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold mb-5 ml-1">
            {zhCN.integrations.gscModal.title}
          </h2>
          <span
            onClick={() =>
              openBrowserWindow("https://github.com/mascanho/RustySEO")
            }
            className="text-[10px] ml-1 pb-5  text-brand-bright underline cursor-pointer"
          >
            ({zhCN.integrations.gscModal.instructions})
          </span>
        </div>

        <form onSubmit={handleSubmit} className="dark:bg-brand-darker">
          <div className="mb-4 relative">
            <label
              htmlFor="projectId"
              className="block text-gray-700 text-[10px] font-bold mb-2 absolute -top-[8px] px-1 bg-white left-[10px] dark:bg-brand-darker dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.projectId}
            </label>
            <input
              type="text"
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className={`w-full px-3 dark:bg-brand-darker dark:border-white/30 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.projectId
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
              placeholder={zhCN.integrations.gscModal.placeholders.projectId}
            />
            {errors.projectId && (
              <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="clientId"
              className="block text-gray-700 text-[10px] font-bold mb-2 absolute -top-[8px] px-1 bg-white left-[10px] dark:bg-brand-darker dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.clientId}
            </label>
            <input
              type="text"
              id="clientId"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border  rounded-lg dark:bg-brand-darker dark:border-white/30 focus:outline-none focus:ring-2 ${
                errors.clientId
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
              placeholder={zhCN.integrations.gscModal.placeholders.clientId}
            />
            {errors.clientId && (
              <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="clientSecret"
              className="block text-gray-700 text-[10px] font-bold mb-2 absolute -top-[8px] px-1 bg-white left-[10px] dark:bg-brand-darker dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.clientSecret}
            </label>
            <input
              type="password"
              id="clientSecret"
              name="clientSecret"
              value={formData.clientSecret}
              onChange={handleChange}
              className={`w-full px-3 dark:bg-brand-darker dark:border-white/30 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.clientSecret
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
              placeholder={zhCN.integrations.gscModal.placeholders.clientSecret}
            />
            {errors.clientSecret && (
              <p className="text-red-500 text-sm mt-1">{errors.clientSecret}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="url"
              className="block text-gray-700 text-[10px] font-bold mb-2 absolute -top-[8px] px-1 bg-white left-[10px] dark:bg-brand-darker dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.url}
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className={`dark:bg-brand-darker dark:border-white/30 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.url
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
              placeholder={zhCN.integrations.gscModal.placeholders.url}
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>
          <div className="mb-4 mt-4">
            <label
              htmlFor="propertyType"
              className="block text-gray-700 font-bold mb-2 dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.propertyType}
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={`gsc w-full px-3 dark:bg-brand-darker py-2 border rounded-lg focus:outline-none focus:ring-0 ${
                errors.propertyType
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
            >
              <option value="">
                {zhCN.integrations.gscModal.placeholders.propertyType}
              </option>
              {searchTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.propertyType && (
              <p className=" text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="range"
              className="block text-gray-700 font-bold mb-2 dark:text-white"
            >
              {zhCN.integrations.gscModal.labels.dateRange}
            </label>
            <select
              id="range"
              name="range"
              value={formData.range}
              onChange={handleChange}
              className={`dark:text-white dark:bg-brand-darker w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-0 ${
                errors.range
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-200"
              }`}
            >
              <option value="">
                {zhCN.integrations.gscModal.placeholders.range}
              </option>
              {durations.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            {errors.range && (
              <p className="text-red-500 text-sm mt-1">{errors.range}</p>
            )}

            <div className="mb-4 mt-2">
              <label
                htmlFor="rows"
                className="block text-gray-700 font-bold mb-2 dark:text-white"
              >
                {zhCN.integrations.gscModal.labels.rows}
              </label>

              <select
                name="rows"
                id="rows"
                value={formData.rows}
                onChange={handleChange}
                className={`dark:text-white dark:bg-brand-darker w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-0 ${errors.rows ? "border-red-500 focus:ring-red-200" : "focus:ring-blue-200"}`}
              >
                <option value="">
                  {zhCN.integrations.gscModal.placeholders.rows}
                </option>
                {rows.map((rows) => (
                  <option key={rows.value} value={rows.value}>
                    {rows.label}
                  </option>
                ))}
              </select>
              {errors.rows && (
                <p className="text-red-500 text-sm mt-1">{errors.rows}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full active:scale-95  bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            {zhCN.integrations.gscModal.confirm}
          </button>
        </form>
      </div>
    </section>
  );
};

export default GoogleSearchConsoleModal;
