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
import { FileText, Hash } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const ExtractionSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader
            title={zhCN.settings.sections.contentExtraction}
            icon={<FileText className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="提取 N-gram"
            description="在抓取过程中启用 N-gram 提取"
        >
            <ToggleSwitch
                checked={settings.extract_ngrams}
                onChange={(v) => onUpdate("extract_ngrams", v)}
            />
        </SettingField>

        <SectionHeader
            title={zhCN.settings.sections.databaseBatching}
            icon={<Hash className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="数据库批次大小"
            description="每次写入数据库的记录数"
        >
            <NumberInput
                value={settings.db_batch_size}
                onChange={(v) => onUpdate("db_batch_size", v)}
                min={10}
                max={5000}
            />
        </SettingField>

        <SettingField
            label="数据库分块大小"
            description="域名爬虫结果的分块大小"
        >
            <NumberInput
                value={settings.db_chunk_size_domain_crawler}
                onChange={(v) => onUpdate("db_chunk_size_domain_crawler", v)}
                min={50}
                max={10000}
            />
        </SettingField>
    </div>
);

export default ExtractionSection;
