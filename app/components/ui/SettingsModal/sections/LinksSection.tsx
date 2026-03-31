// @ts-nocheck
"use client";

import React from "react";
import { AppSettings } from "../useSettings";
import {
    SettingField,
    NumberInput,
    SectionHeader,
} from "../fields/SettingFields";
import { Link2, Zap } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const LinksSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader
            title={zhCN.settings.sections.linkProcessor}
            icon={<Link2 className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="最大并发检查数"
            description="并行执行链接状态检查"
        >
            <NumberInput
                value={settings.links_max_concurrent_requests}
                onChange={(v) => onUpdate("links_max_concurrent_requests", v)}
                min={1}
                max={50}
            />
        </SettingField>

        <SettingField
            label="初始任务容量"
            description="预分配的任务槽位数量"
        >
            <NumberInput
                value={settings.links_initial_task_capacity}
                onChange={(v) => onUpdate("links_initial_task_capacity", v)}
                min={10}
                max={1000}
            />
        </SettingField>

        <SettingField
            label="最大重试次数"
            description="链接检查失败后的重试次数"
        >
            <NumberInput
                value={settings.links_max_retries}
                onChange={(v) => onUpdate("links_max_retries", v)}
                min={0}
                max={10}
            />
        </SettingField>

        <SettingField
            label="重试延迟"
            description="每次重试之间的等待时间"
        >
            <NumberInput
                value={settings.links_retry_delay}
                onChange={(v) => onUpdate("links_retry_delay", v)}
                min={0}
                max={30000}
                unit="ms"
            />
        </SettingField>

        <SettingField
            label="请求超时"
            description="每个链接请求的超时时间"
        >
            <NumberInput
                value={settings.links_request_timeout}
                onChange={(v) => onUpdate("links_request_timeout", v)}
                min={1}
                max={120}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="抖动系数"
            description="随机延迟系数（0.0-1.0）"
        >
            <NumberInput
                value={settings.links_jitter_factor}
                onChange={(v) => onUpdate("links_jitter_factor", v)}
                min={0}
                max={1}
                step={0.05}
                width="w-[80px]"
            />
        </SettingField>

        <SettingField
            label="连接池空闲超时"
            description="连接池中空闲连接的超时时间"
        >
            <NumberInput
                value={settings.links_pool_idle_timeout}
                onChange={(v) => onUpdate("links_pool_idle_timeout", v)}
                min={5}
                max={300}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="每主机最大空闲连接"
            description="每个主机允许的最大空闲连接数"
        >
            <NumberInput
                value={settings.links_max_idle_per_host}
                onChange={(v) => onUpdate("links_max_idle_per_host", v)}
                min={1}
                max={50}
            />
        </SettingField>
    </div>
);

export default LinksSection;
