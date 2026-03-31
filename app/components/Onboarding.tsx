// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Shield,
  X,
  Zap,
  FileCode,
  Layers,
  ScrollText,
  PlugZap,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import confetti from "canvas-confetti";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { zhCN } from "@/app/utils/zhCN";

const steps = [
  {
    id: 1,
    title: zhCN.onboarding.steps[0].title,
    description: zhCN.onboarding.steps[0].description,
    icon: Rocket,
    imageSrc: "icon.png",
  },
  {
    id: 2,
    title: zhCN.onboarding.steps[1].title,
    description: zhCN.onboarding.steps[1].description,
    icon: FileCode,
    imageSrc: "shallow.png",
  },
  {
    id: 3,
    title: zhCN.onboarding.steps[2].title,
    description: zhCN.onboarding.steps[2].description,
    icon: Layers,
    imageSrc: "deep.png",
  },
  {
    id: 4,
    title: zhCN.onboarding.steps[3].title,
    description: zhCN.onboarding.steps[3].description,
    icon: ScrollText,
    imageSrc: "log.png",
  },
  {
    id: 5,
    title: zhCN.onboarding.steps[4].title,
    description: zhCN.onboarding.steps[4].description,
    icon: PlugZap,
    imageSrc: "integrations.png",
  },
  {
    id: 6,
    title: zhCN.onboarding.steps[5].title,
    description: zhCN.onboarding.steps[5].description,
    icon: Key,
    imageSrc: "tracking.png",
  },
  {
    id: 7,
    title: zhCN.onboarding.steps[6].title,
    description: zhCN.onboarding.steps[6].description,
    icon: CheckCircle,
    imageSrc: "more.png",
  },
];

export default function Onboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding") === "true";

    if (!onboardingCompleted) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1);

      return () => clearTimeout(timer);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem("onboarding", "true");
    setShowOnboarding(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);

      onComplete();
      completeOnboarding();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#8B5CF6", "#3B82F6", "#A78BFA"],
        zIndex: 9999,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCompleted(false);
  };

  const handleClose = () => {
    completeOnboarding();
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999999999999] bg-black/50 !transform-none">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <section className="w-full h-[450px] border-0 shadow-lg bg-white dark:bg-slate-900 rounded-lg overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r relative flex h-10 from-blue-600 to-purple-600 text-white">
              <CardTitle className="text-2xl font-bold p-1.5 pl-4 text-white dark:text-white z-0">
                {zhCN.onboarding.title}
              </CardTitle>
              {/* <X */}
              {/*   className="absolute right-4 top-2 cursor-pointer" */}
              {/*   onClick={handleClose} */}
              {/* /> */}
            </div>

            <CardContent className="p-6 flex-1 overflow-auto z-0">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex-1 h-1 rounded-full mx-1 ${
                        step.id <= currentStep
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{zhCN.onboarding.start}</span>
                  <span>{zhCN.onboarding.finish}</span>
                </div>
              </div>

              <div className="h-[250px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col md:flex-row items-center justify-center gap-8"
                  >
                    {!completed ? (
                      <>
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="mb-4 p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                            {steps[currentStep - 1] &&
                              (() => {
                                const IconComponent =
                                  steps[currentStep - 1].icon;
                                return (
                                  <IconComponent className="h-4 w-4 text-blue-600" />
                                );
                              })()}
                          </div>
                          <h3 className="text-2xl font-bold mb-3 dark:text-white">
                            {steps[currentStep - 1]?.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {steps[currentStep - 1]?.description}
                          </p>
                          <section className="w-full flex items-center">
                            <p className="text-sm text-gray-500">
                              {currentStep === 1
                                ? zhCN.onboarding.steps[0].helper
                                : currentStep === 2
                                  ? zhCN.onboarding.steps[1].helper
                                  : currentStep === 3
                                    ? zhCN.onboarding.steps[2].helper
                                    : currentStep === 4
                                      ? zhCN.onboarding.steps[3].helper
                                      : currentStep === 5
                                        ? zhCN.onboarding.steps[4].helper
                                        : currentStep === 6
                                          ? zhCN.onboarding.steps[5].helper
                                          : currentStep === 7
                                            ? zhCN.onboarding.steps[6].helper
                                            : zhCN.onboarding.steps[0].helper}{" "}
                            </p>
                            {currentStep === 7 && (
                              <a
                                href="https://github.com/mascanho/RustySEO"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block ml-2"
                              >
                                <GitHubLogoIcon className="h-5 w-5 text-gray-500" />
                              </a>
                            )}
                          </section>
                        </div>
                        <div className="flex-1 flex justify-center items-center h-full">
                          <div
                            className={`${currentStep === 1 ? "w-40" : " w-80"} h-auto relative rounded-lg overflow-hidden`}
                          >
                            <img
                              src={
                                steps[currentStep - 1]?.imageSrc ||
                                "https://github.com/mascanho/RustySEO/raw/main/assets/hero.png"
                              }
                              alt={`${zhCN.onboarding.imageAltPrefix}${steps[currentStep - 1]?.title}`}
                              className={`${currentStep === 1 ? "object-fit" : "object-cover"} w-full h-full`}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="mb-4 p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          </div>
                          <h3 className="text-2xl font-bold mb-3">{zhCN.onboarding.allDone}</h3>
                          <p className="text-gray-600 mb-4">
                            {zhCN.onboarding.completed}
                          </p>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleReset}
                              className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            >
                              {zhCN.onboarding.startOver}
                            </Button>
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={handleClose}
                            >
                              {zhCN.onboarding.close}
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 flex justify-center items-center h-full">
                          <div className="w-full h-[250px] relative rounded-lg overflow-hidden shadow-md">
                            <img
                              src="https://github.com/mascanho/RustySEO/raw/main/assets/hero.png"
                              alt={zhCN.onboarding.completed}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>

            {!completed && (
              <CardFooter className="flex justify-between border-t dark:border-t-brand-dark p-3 px-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1 dark:text-white dark:bg-brand-dark h-7"
                >
                  <ChevronLeft className="h-4 w-4 dark:text-white" /> {zhCN.onboarding.back}
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center gap-1 dark:text-white  h-7"
                >
                  {currentStep === steps.length ? zhCN.onboarding.done : zhCN.onboarding.next}{" "}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
