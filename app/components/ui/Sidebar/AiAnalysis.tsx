// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { Bot } from "lucide-react";
import useOnPageSeo from "@/store/storeOnPageSeo";
import usePageSpeedStore from "@/store/StorePerformance";
import { zhCN, zhStatusMap } from "@/app/utils/zhCN";

const AIFeedbackTab = ({ pageSpeed, loading, seo }) => {
  const [feedback, setFeedback] = useState(null);
  const [sessionScore, setSessionScore] = useState(null);
  const { seoContentQuality } = useOnPageSeo();
  const globalPerformanceScore = usePageSpeedStore(
    (state) => state.GlobalPerformanceScore,
  );
  const seoScore = seo?.lighthouseResult?.categories?.seo?.score ?? 0;

  const metrics = {
    performance: globalPerformanceScore?.performance || 0,
    fcp: globalPerformanceScore?.fcp || 0,
    lcp: globalPerformanceScore?.lcp || 0,
    tti: globalPerformanceScore?.tti || 0,
    tbt: globalPerformanceScore?.tbt || 0,
    cls: globalPerformanceScore?.cls || 0,
    speedIndex: globalPerformanceScore?.speedIndex || 0,
    serverResponse: globalPerformanceScore?.serverResponse || 0,
    largePayloads: globalPerformanceScore?.largePayloads || 0,
    domSize: globalPerformanceScore?.domSize || 0,
    longTasks: globalPerformanceScore?.longTasks || 0,
    networkRequests: globalPerformanceScore?.networkRequests || null,
    renderBlocking: globalPerformanceScore?.renderBlocking || 0,
    urlRedirects: globalPerformanceScore?.urlRedirects || null,
  };

  const weights = {
    performance: 0.3,
    fcp: 0.19,
    lcp: 0.19,
    tti: 0.14,
    tbt: 0.05,
    cls: 0.05,
    speedIndex: 0.01,
    serverResponse: 0.01,
    largePayloads: 0.01,
    domSize: 0.01,
    urlRedirects: 0.01,
    longTasks: 0.01,
    renderBlocking: 0.01,
    networkRequests: 0.01,
  };

  function calculateGlobalScore(metrics, weights) {
    let totalWeight = 0;
    let weightedSum = 0;

    Object.keys(metrics).forEach((key) => {
      const value = metrics[key];
      const weight = weights[key];

      if (value !== null && weight !== undefined) {
        let normalizedValue;

        switch (key) {
          case "domSize":
            normalizedValue = Math.min(1, value / 3000);
            break;
          case "renderBlocking":
            normalizedValue = Math.min(1, value / 1000);
            break;
          case "cls":
            normalizedValue = Math.min(1, value);
            break;
          case "tbt":
            normalizedValue = Math.min(1, value / 600);
            break;
          default:
            normalizedValue = value;
            break;
        }

        weightedSum += normalizedValue * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  }

  const globalPercentageScore = calculateGlobalScore(metrics, weights).toFixed(
    2,
  );

  const pageScoring = useMemo(
    () => ({
      readingLevel:
        seoContentQuality?.readingLevelResults?.[0]?.[1] || "Unknown",
    }),
    [seoContentQuality],
  );

  useEffect(() => {
    const scoring = sessionStorage.getItem("score");
    if (scoring) {
      setSessionScore(JSON.parse(scoring));
    }
  }, [pageSpeed]);

  const overallScore = useMemo(
    () =>
      (sessionScore &&
        (sessionScore[0]?.passed / sessionScore[0]?.total) * 100) ||
      0,
    [sessionScore],
  );

  useEffect(() => {
    const getSummaryText = (score) => {
      if (score >= 85)
        return "页面整体表现优秀，仅有少量细节可继续优化。";
      if (score >= 60)
        return "页面整体表现不错，但在关键环节仍有优化空间。";
      return "页面在多个关键项上仍需明显改进，才能提升整体表现。";
    };

    const getContentQuality = (level) => {
      switch (level) {
        case "Very Easy":
        case "Easy":
          return {
            status: "Excellent",
            description:
              "内容非常易读，理解成本低，适合更广泛的受众。"
          };
        case "Fairly Easy":
        case "Standard":
          return {
            status: "Good",
            description:
              "内容较易阅读，适合大多数用户。"
          };
        case "Fairly Difficult":
          return {
            status: "Needs Improvement",
            description:
              "内容对部分用户可能偏难，建议适当简化表达。"
          };
        case "Difficult":
        case "Very Confusing":
          return {
            status: "Poor",
            description:
              "内容阅读门槛较高，建议明显简化。"
          };
        default:
          return {
            status: "Unknown",
            description:
              "暂时无法判断内容可读性，建议人工复核。"
          };
      }
    };

    const getPerformanceRating = (score) => {
      if (score < 25) {
        return {
          status: "Poor",
          description:
            "网页性能较差，已明显影响用户体验，建议优先处理。"
        };
      } else if (score < 50) {
        return {
          status: "Needs Improvement",
          description:
            "网页性能低于平均水平，存在明显延迟，建议尽快优化。"
        };
      } else if (score < 75) {
        return {
          status: "Acceptable",
          description:
            "网页性能处于可接受范围，但加载速度和响应性仍有提升空间。"
        };
      } else {
        return {
          status: "Optimal",
          description:
            "网页性能优秀，可提供较快加载速度和流畅体验。"
        };
      }
    };

    const getSeoRating = (score) => {
      if (score < 0.25) {
        return {
          status: "Unacceptable",
          description:
            "SEO 表现严重偏低，可能影响搜索排名与曝光，需尽快优化。"
        };
      } else if (score < 0.5) {
        return {
          status: "Poor",
          description:
            "SEO 表现不理想，可能影响搜索引擎排名，建议优先优化元标签、内容质量和站点结构。"
        };
      } else if (score < 0.75) {
        return {
          status: "Acceptable",
          description:
            "SEO 表现中等，仍有提升空间，可继续优化关键词策略与内容相关性。"
        };
      } else {
        return {
          status: "Optimal",
          description:
            "SEO 表现优秀，有助于保持较强的搜索可见度，建议持续监控并微调策略。"
        };
      }
    };

    const performanceRating = getPerformanceRating(globalPercentageScore);
    const contentQuality = getContentQuality(pageScoring?.readingLevel);
    const seoRating = getSeoRating(seoScore);

    const aiFeedback = {
      overallScore: globalPercentageScore,
      summary: getSummaryText(globalPercentageScore),
      insights: [
        {
          aspect: "核心网页指标",
          status: performanceRating.status,
          description: performanceRating.description,
        },
        {
          aspect: "SEO",
          status: seoRating.status,
          description: seoRating.description,
        },
        {
          aspect: "内容质量",
          status: contentQuality.status,
          description: contentQuality.description,
        },
      ],
      topRecommendation:
        zhCN.sidebar.topRecommendation,
    };

    setFeedback(aiFeedback);
  }, [pageSpeed, globalPercentageScore, pageScoring.readingLevel]);

  return (
    <div className="p-4 dark:text-gray-300 dark:bg-gray-900 h-screen bg-brand-bright/5">
      <div className="flex items-center mb-2">
        <Bot className="w-6 h-6 mr-2 text-blue-400" />
        <h2 className="text-sm font-semibold">{zhCN.sidebar.rustyFeedback}</h2>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">{zhCN.sidebar.overallScore}</span>

          <span
            className={`text-sm font-bold ${feedback?.overallScore >= 80 ? "text-green-500" : "text-red-500"} text-blue-400`}
          >
            {loading ? (
              <div className="animate-spin ml-2 h-5 w-5 border-t-2 border-b-2 border-brand-bright rounded-full mr-3 mb-1" />
            ) : pageSpeed ? (
              `${feedback?.overallScore}%`
            ) : (
              zhCN.sidebar.notAvailable
            )}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          {pageSpeed && (
            <div
              className={`${feedback?.overallScore >= 80 ? "bg-green-500" : "bg-red-500"} bg-blue-400 h-2.5 rounded-full`}
              style={{ width: `${feedback?.overallScore}%` }}
            />
          )}
        </div>
      </div>

      <p className="text-xs mb-4">{feedback?.summary}</p>

      <div className="space-y-3 mb-4">
        {feedback?.insights.map((insight, index) => (
          <div
            key={index}
            className="border-b border-b-gray-300 last-of-type:border-b-0 last:pb-0 dark:border-brand-dark border-gray-700 pb-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-xs">{insight?.aspect}</span>
              <span
                className={`text-xs px-2 py-[2px] rounded ${
                  insight.status === "Excellent" || insight.status === "Optimal"
                    ? "bg-green-900 text-green-300"
                    : insight.status === "Good" ||
                        insight.status === "Acceptable"
                      ? "bg-blue-900 text-blue-300"
                      : insight.status === "Needs Improvement"
                        ? "bg-yellow-900 text-yellow-300"
                        : "bg-red-900 text-red-300"
                }`}
              >
                {(pageSpeed &&
                  (zhStatusMap[insight.status] || insight.status)) ||
                  zhCN.sidebar.notAvailable}
              </span>
            </div>
            <p className="text-xs mt-2 text-gray-800 dark:text-white/50">
              {(pageSpeed && insight.description) || zhCN.sidebar.notAvailable}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIFeedbackTab;
