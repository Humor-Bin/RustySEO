// @ts-nocheck
"use client";

import React from "react";
import { AppSettings } from "../useSettings";
import {
    SettingField,
    NumberInput,
    SectionHeader,
} from "../fields/SettingFields";
import { ScrollText, Upload } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const LogsSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader
            title={zhCN.settings.sections.logProcessing}
            icon={<ScrollText className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="日志批次大小"
            description="每批处理的日志数量"
        >
            <NumberInput
                value={settings.log_batchsize}
                onChange={(v) => onUpdate("log_batchsize", v)}
                min={1}
                max={100}
            />
        </SettingField>

        <SettingField
            label="日志分块大小"
            description="每个日志块包含的行数"
        >
            <NumberInput
                value={settings.log_chunk_size}
                onChange={(v) => onUpdate("log_chunk_size", v)}
                min={1000}
                max={5000000}
            />
        </SettingField>

        <SettingField
            label="流式间隔"
            description="两次流处理循环之间的间隔"
        >
            <NumberInput
                value={settings.log_sleep_stream_duration}
                onChange={(v) => onUpdate("log_sleep_stream_duration", v)}
                min={0}
                max={60}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="日志容量"
            description="日志缓冲区容量"
        >
            <NumberInput
                value={settings.log_capacity}
                onChange={(v) => onUpdate("log_capacity", v)}
                min={1}
                max={100}
            />
        </SettingField>

        <SettingField
            label="项目分块大小"
            description="日志项目的分块大小"
        >
            <NumberInput
                value={settings.log_project_chunk_size}
                onChange={(v) => onUpdate("log_chunk_size_project", v)}
                min={1}
                max={100}
            />
        </SettingField>

        <SectionHeader
            title={zhCN.settings.sections.fileUpload}
            icon={<Upload className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="最大上传体积"
            description="日志文件允许上传的最大大小"
        >
            <NumberInput
                value={settings.log_file_upload_size}
                onChange={(v) => onUpdate("log_file_upload_size", v)}
                min={1}
                max={500}
                unit="MB"
            />
        </SettingField>
    </div>
);

export default LogsSection;
