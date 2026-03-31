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
import { Gauge, Layers, ArrowDownUp, TrendingUp } from "lucide-react";
import { zhCN } from "@/app/utils/zhCN";

interface Props {
    settings: AppSettings;
    onUpdate: (key: string, value: any) => void;
}

const CrawlerSection = ({ settings, onUpdate }: Props) => (
    <div className="space-y-0.5">
        <SectionHeader title={zhCN.settings.sections.general} icon={<Gauge className="w-3.5 h-3.5" />} />
        <SettingField
            label="并发请求数"
            description="同时建立的 HTTP 连接数"
        >
            <NumberInput
                value={settings.concurrent_requests}
                onChange={(v) => onUpdate("concurrent_requests", v)}
                min={1}
                max={50}
            />
        </SettingField>

        <SettingField
            label="批处理大小"
            description="每轮处理的 URL 数量"
        >
            <NumberInput
                value={settings.batch_size}
                onChange={(v) => onUpdate("batch_size", v)}
                min={1}
                max={500}
            />
        </SettingField>

        <SettingField
            label="最大抓取深度"
            description="跟随链接的最大层级"
        >
            <NumberInput
                value={settings.max_depth}
                onChange={(v) => onUpdate("max_depth", v)}
                min={1}
                max={200}
            />
        </SettingField>

        <SettingField
            label="单域名最大 URL 数"
            description="每个域名允许抓取的 URL 上限"
        >
            <NumberInput
                value={settings.max_urls_per_domain}
                onChange={(v) => onUpdate("max_urls_per_domain", v)}
                min={1}
                max={99999999}
            />
        </SettingField>

        <SectionHeader
            title={zhCN.settings.sections.timing}
            icon={<TrendingUp className="w-3.5 h-3.5" />}
        />

        <SettingField
            label="自适应抓取"
            description="根据服务器状态自动调整抓取速度"
        >
            <ToggleSwitch
                checked={settings.adaptive_crawling}
                onChange={(v) => onUpdate("adaptive_crawling", v)}
            />
        </SettingField>

        <SettingField label="基础延迟" description="请求之间的间隔">
            <NumberInput
                value={settings.base_delay}
                onChange={(v) => onUpdate("base_delay", v)}
                min={0}
                max={60000}
                unit="ms"
            />
        </SettingField>

        <SettingField label="最大延迟" description="自适应模式下的最大延迟">
            <NumberInput
                value={settings.max_delay}
                onChange={(v) => onUpdate("max_delay", v)}
                min={100}
                max={120000}
                unit="ms"
            />
        </SettingField>

        <SettingField label="最小抓取延迟" description="自适应模式下的最小延迟">
            <NumberInput
                value={settings.min_crawl_delay}
                onChange={(v) => onUpdate("min_crawl_delay", v)}
                min={0}
                max={60000}
                unit="ms"
            />
        </SettingField>

        <SettingField label="抓取超时" description="整个抓取任务的超时时间">
            <NumberInput
                value={settings.crawl_timeout}
                onChange={(v) => onUpdate("crawl_timeout", v)}
                min={60}
                max={86400}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="卡顿检查间隔"
            description="检测任务卡住的频率"
        >
            <NumberInput
                value={settings.stall_check_interval}
                onChange={(v) => onUpdate("stall_check_interval", v)}
                min={5}
                max={300}
                unit="s"
            />
        </SettingField>

        <SettingField
            label="最大等待时间"
            description="单个 URL 的卡顿判定阈值"
        >
            <NumberInput
                value={settings.max_pending_time}
                onChange={(v) => onUpdate("max_pending_time", v)}
                min={30}
                max={3600}
                unit="s"
            />
        </SettingField>
    </div>
);

export default CrawlerSection;
