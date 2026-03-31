// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { AdForm } from "./ad-form";
import { AdList } from "./ad-list";
import { AdPreview } from "./ad-preview";
import { DashboardHeader } from "./dashboard-header";
import { DashboardLayout } from "./dashboard-layout";
import { toast } from "./hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { zhCN } from "@/app/utils/zhCN";

export function AdDashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [sidebarView, setSidebarView] = useState<string>("dashboard");

  // Function to save ads to localStorage
  const saveAdsToLocalStorage = (ads) => {
    localStorage.setItem("ads", JSON.stringify(ads));
  };

  // Function to retrieve ads from localStorage
  const getAdsFromLocalStorage = () => {
    const ads = localStorage.getItem("ads");
    return ads ? JSON.parse(ads) : [];
  };

  useEffect(() => {
    const handleClearSelectedAd = () => {
      setSelectedAd(null);
    };

    window.addEventListener("clearSelectedAd", handleClearSelectedAd);

    // Load ads from localStorage when the component mounts
    const savedAds = getAdsFromLocalStorage();
    if (savedAds.length > 0) {
      const processedAds = savedAds.map((ad) => ({
        ...ad,
        headlines: Array.isArray(ad.headlines)
          ? ad.headlines
          : typeof ad.headlines === "string"
            ? ad.headlines.split("\n")
            : [],
        descriptions: Array.isArray(ad.descriptions)
          ? ad.descriptions
          : typeof ad.descriptions === "string"
            ? ad.descriptions.split("\n")
            : [],
        keywords: Array.isArray(ad.keywords)
          ? ad.keywords
          : typeof ad.keywords === "string"
            ? ad.keywords.split("\n")
            : [],
      }));
      setAds(processedAds);
      setSelectedAd(processedAds[0]);
    }

    return () => {
      window.removeEventListener("clearSelectedAd", handleClearSelectedAd);
    };
  }, []);

  const handleAddAd = () => {
    const newAd = {
      id: Date.now().toString(),
      name: zhCN.ppc.dashboard.newAd,
      type: "search", // Default type
      headlines: [""],
      descriptions: [""],
      keywords: [],
      finalUrl: "",
      displayPath: "",
      sitelinks: [],
    };
    const updatedAds = [...ads, newAd];
    setAds(updatedAds);
    setSelectedAd(newAd);
    setSidebarView("ads");
    saveAdsToLocalStorage(updatedAds); // Save to localStorage

    toast({
      title: zhCN.ppc.dashboard.adCreated,
      description: zhCN.ppc.dashboard.adCreatedDescription.replace(
        "{name}",
        newAd.name,
      ),
    });
  };

  const handleCloneAd = (ad) => {
    // Clone sitelinks with new IDs
    const clonedSitelinks = ad.sitelinks
      ? ad.sitelinks.map((sitelink) => ({
          ...sitelink,
          id: Date.now() + Math.random().toString(36).substring(2, 9),
        }))
      : [];

    const clonedAd = {
      ...ad,
      id: Date.now().toString(),
      name: `${ad.name} (Copy)`,
      sitelinks: clonedSitelinks,
    };
    const updatedAds = [...ads, clonedAd];
    setAds(updatedAds);
    setSelectedAd(clonedAd);
    setSidebarView("ads");
    saveAdsToLocalStorage(updatedAds); // Save to localStorage

    toast.info({
      title: zhCN.ppc.dashboard.adCloned,
      description: zhCN.ppc.dashboard.adClonedDescription.replace(
        "{name}",
        ad.name,
      ),
    });
  };

  const handleSelectAd = (ad) => {
    const processedAd = {
      ...ad,
      headlines: Array.isArray(ad.headlines)
        ? ad.headlines
        : typeof ad.headlines === "string"
          ? ad.headlines.split("\n")
          : [],
      descriptions: Array.isArray(ad.descriptions)
        ? ad.descriptions
        : typeof ad.descriptions === "string"
          ? ad.descriptions.split("\n")
          : [],
      keywords: Array.isArray(ad.keywords)
        ? ad.keywords
        : typeof ad.keywords === "string"
          ? ad.keywords.split("\n")
          : [],
      sitelinks: Array.isArray(ad.sitelinks) ? ad.sitelinks : [],
    };
    setSelectedAd(processedAd);
    setSidebarView("ads");
  };

  const handleDeleteAd = (adId) => {
    try {
      console.log("Delete function called with ID:", adId);

      // Find the ad to be deleted
      const adToDelete = ads.find((ad) => ad.id === adId);

      if (!adToDelete) {
        console.error("Ad not found:", adId);
        return;
      }

      // Create a new array without the deleted ad
      const updatedAds = ads.filter((ad) => ad.id !== adId);

      console.log("Updated ads array:", updatedAds);

      // Update state with the new array
      setAds(updatedAds);
      saveAdsToLocalStorage(updatedAds); // Save to localStorage

      // If we're deleting the currently selected ad, update selectedAd
      if (selectedAd?.id === adId) {
        if (updatedAds.length > 0) {
          setSelectedAd(updatedAds[0]);
        } else {
          setSelectedAd(null);
        }
      }

      console.log("Saving Ad");

      // Show success toast
      toast({
        title: zhCN.ppc.dashboard.adDeleted,
        description: adToDelete
          ? zhCN.ppc.dashboard.adDeletedDescription.replace(
              "{name}",
              adToDelete.name,
            )
          : zhCN.ppc.dashboard.adDeletedFallback,
        variant: "success",
      });

      console.log("Delete operation completed");
    } catch (error) {
      console.error("Error deleting ad:", error);

      toast({
        title: zhCN.ppc.dashboard.error,
        description: zhCN.ppc.dashboard.deleteFailed,
        variant: "destructive",
      });
    }
  };

  const handleSaveAd = (updatedAd) => {
    const updatedAds = ads.map((ad) =>
      ad.id === updatedAd.id ? updatedAd : ad,
    );
    setAds(updatedAds);
    setSelectedAd(updatedAd);
    saveAdsToLocalStorage(updatedAds); // Save to localStorage

    toast({
      title: zhCN.ppc.dashboard.adSaved,
      description: zhCN.ppc.dashboard.adSavedDescription.replace(
        "{name}",
        updatedAd.name,
      ),
      variant: "success",
    });
  };

  const handleImportAds = (importedAds) => {
    // Add type if missing in imported ads
    const processedAds = importedAds.map((ad) => ({
      ...ad,
      type: ad.type || "search", // Default to search if type is missing
      sitelinks: ad.sitelinks || [], // Ensure sitelinks exists
    }));

    // Merge imported ads with existing ads, avoiding duplicates by ID
    const existingIds = new Set(ads.map((ad) => ad.id));
    const newAds = processedAds.filter((ad) => !existingIds.has(ad.id));
    const updatedAds = [...ads, ...newAds];

    setAds(updatedAds);
    saveAdsToLocalStorage(updatedAds); // Save to localStorage

    if (newAds.length > 0 && !selectedAd) {
      setSelectedAd(newAds[0]);
    }
  };

  const renderContent = () => {
    switch (sidebarView) {
      case "ads":
        return selectedAd ? (
          <div className="w-full flex flex-col lg:flex-row gap-4 h-full bg-gray-50/20 dark:bg-transparent rounded-2xl overflow-hidden">
            {/* Optimized Editor Column */}
            <div className="w-full lg:w-[650px] xl:w-[750px] flex-shrink-0 h-full flex flex-col">
              <div className="flex-1 flex flex-col bg-white dark:bg-brand-darker/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm overflow-hidden">
                <div className="flex-shrink-0 p-4 pb-0">
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 dark:bg-gray-100"
                          onClick={() => setSelectedAd(null)}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {zhCN.ppc.dashboard.editorTitle}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
                        {zhCN.ppc.dashboard.editorDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-semibold border-gray-200 dark:border-white/10 dark:text-white px-4"
                        onClick={() => setSidebarView("previews")}
                      >
                        {zhCN.ppc.dashboard.preview}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0 px-4 pb-4">
                  <div className="h-full">
                    <AdForm
                      ad={selectedAd}
                      onSave={handleSaveAd}
                      onPreview={() => setSidebarView("previews")}
                      onChange={(updatedAd) => {
                        setSelectedAd(updatedAd);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flexible Preview Column - Full Height */}
            <div className="flex-1 h-full overflow-hidden">
              <AdPreview
                ad={selectedAd}
                allAds={ads}
                onSelectAd={setSelectedAd}
                isLive={true}
              />
            </div>
          </div>
        ) : (
          <AdList
            ads={ads}
            onSelect={handleSelectAd}
            onClone={handleCloneAd}
            onDelete={handleDeleteAd}
          />
        );
      case "previews":
        return (
          <AdPreview
            ad={selectedAd || (ads.length > 0 ? ads[0] : null)}
            allAds={ads}
            onSelectAd={setSelectedAd}
          />
        );
      case "dashboard":
      default:
        return (
          <AdList
            ads={ads}
            onSelect={handleSelectAd}
            onClone={handleCloneAd}
            onDelete={handleDeleteAd}
          />
        );
    }
  };

  const getHeaderTitle = () => {
    switch (sidebarView) {
      case "ads":
        return selectedAd
          ? zhCN.ppc.dashboard.headerEditAd
          : zhCN.ppc.dashboard.headerAllAds;
      case "previews":
        return zhCN.ppc.dashboard.headerPreviews;
      case "settings":
        return zhCN.ppc.dashboard.headerSettings;
      // case "help":
      //   return "";
      case "dashboard":
      default:
        return zhCN.ppc.dashboard.headerDashboard;
    }
  };

  const getHeaderDescription = () => {
    switch (sidebarView) {
      case "ads":
        return selectedAd
          ? zhCN.ppc.dashboard.descEditAd
          : zhCN.ppc.dashboard.descManageAds;
      case "previews":
        return zhCN.ppc.dashboard.descPreviews;
      case "settings":
        return zhCN.ppc.dashboard.descSettings;
      // case "help":
      //   return "Get help with using the platform";
      case "dashboard":
      default:
        return zhCN.ppc.dashboard.descDashboard;
    }
  };

  return (
    <DashboardLayout
      onAddNew={handleAddAd}
      activeView={sidebarView}
      onViewChange={setSidebarView}
    >
      <div className="w-full h-full flex flex-col p-4 md:p-6 min-h-0 overflow-hidden">
        {!(
          sidebarView === "previews" ||
          (sidebarView === "ads" && selectedAd)
        ) && (
          <div className="flex-shrink-0 mb-6">
            <DashboardHeader
              heading={getHeaderTitle()}
              description={getHeaderDescription()}
              onAddNew={
                sidebarView === "dashboard" ||
                (sidebarView === "ads" && !selectedAd)
                  ? handleAddAd
                  : undefined
              }
              showBackButton={sidebarView === "ads" && selectedAd !== null}
              onBack={() => {
                setSelectedAd(null);
              }}
              ads={ads}
              onImport={handleImportAds}
              showImportExport={
                sidebarView === "dashboard" ||
                (sidebarView === "ads" && !selectedAd)
              }
            />
          </div>
        )}

        <div className="flex-1 min-h-0">{renderContent()}</div>
      </div>
    </DashboardLayout>
  );
}
