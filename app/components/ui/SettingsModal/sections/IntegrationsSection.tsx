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
import { Plug, BarChart3 } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const IntegrationsSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader
            title={zhCN.settings.sections.pageSpeedInsights}
            icon={<Plug className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="批量 PageSpeed"
            description="为所有已抓取页面拉取 PSI 数据"
        >
            <ToggleSwitch
                checked={settings.page_speed_bulk}
                onChange={(v) => onUpdate("page_speed_bulk", v)}
            />
        </SettingField>

        <SectionHeader
            title={zhCN.settings.sections.gsc}
            icon={<BarChart3 className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="GSC 行数上限"
            description="从 Search Console 获取的最大行数"
        >
            <NumberInput
                value={settings.gsc_row_limit}
                onChange={(v) => onUpdate("gsc_row_limit", v)}
                min={100}
                max={100000}
            />
        </SettingField>
    </div>
);

export default IntegrationsSection;
