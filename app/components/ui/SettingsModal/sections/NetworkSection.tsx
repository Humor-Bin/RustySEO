// @ts-nocheck
"use client";

import React from "react";
import { AppSettings } from "../useSettings";
import {
    SettingField,
    NumberInput,
    ToggleSwitch,
    SectionHeader,
} from "../fields/SettingFields";
import { Globe, Timer, RotateCcw } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const NetworkSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader
            title={zhCN.settings.sections.requestNetwork}
            icon={<Globe className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="请求超时"
            description="单次 HTTP 请求的超时时间"
        >
            <NumberInput
                value={settings.client_timeout}
                onChange={(v) => onUpdate("client_timeout", v)}
                min={5}
                max={300}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="连接超时"
            description="建立连接时的超时时间"
        >
            <NumberInput
                value={settings.client_connect_timeout}
                onChange={(v) => onUpdate("client_connect_timeout", v)}
                min={1}
                max={120}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="最大重定向次数"
            description="允许跟随的重定向次数"
        >
            <NumberInput
                value={settings.redirect_policy}
                onChange={(v) => onUpdate("redirect_policy", v)}
                min={0}
                max={20}
            />
        </SettingField>

        <SettingField
            label="最大重试次数"
            description="请求失败后的重试次数"
        >
            <NumberInput
                value={settings.max_retries}
                onChange={(v) => onUpdate("max_retries", v)}
                min={0}
                max={20}
            />
        </SettingField>

        <SectionHeader
            title={zhCN.settings.sections.rendering}
            icon={<Timer className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="仅期望 HTML"
            description="期望返回内容为 HTML 类型"
        >
            <ToggleSwitch
                checked={settings.html}
                onChange={(v) => onUpdate("html", v)}
            />
        </SettingField>

        <SettingField
            label="JS 渲染"
            description="对 JavaScript 页面使用无头 Chrome 渲染"
        >
            <ToggleSwitch
                checked={settings.javascript_rendering}
                onChange={(v) => onUpdate("javascript_rendering", v)}
            />
        </SettingField>

        <SettingField
            label="JS 并发数"
            description="无头 Chrome 的并发任务数"
        >
            <NumberInput
                value={settings.javascript_concurrency}
                onChange={(v) => onUpdate("javascript_concurrency", v)}
                min={1}
                max={20}
            />
        </SettingField>
    </div>
);

export default NetworkSection;
