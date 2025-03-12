import MainChart from '@/Components/dashboardcomp/mainchart';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from "@/components/ui/card";
import RadialChart from '@/Components/dashboardcomp/radialchart';
import { ArrowDownToLine, CircleCheck, CircleMinus, Globe, Loader2 } from "lucide-react";
import SummaryCard from '@/Components/dashboardcomp/summarycard';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent } from '@/Components/ui/dialog';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SummaryCardSkeleton } from '@/Components/dashboardcomp/summarycardskeleton';

// Map icon names to actual Lucide icons
const iconMap = {
  CircleCheck,
  CircleMinus,
  Globe,
};

export default function Dashboard({ summaryData }) {
  const mainChartRef = useRef(null);
  const radialChartRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureData, setCaptureData] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ Loading state

  // Simulate API fetching or ensure summaryData is valid
  useEffect(() => {
    if (summaryData && summaryData.length > 0) {
      setLoading(false); // Set loading to false when data is available
    }
  }, [summaryData]);


  const exportReport = async () => {
    setIsExporting(true);
    try {
      setIsCapturing(true);
      await new Promise((resolve) => setTimeout(resolve, 0)); // Ensure UI updates

      const mainCanvas = mainChartRef.current
        ? await html2canvas(mainChartRef.current, { scale: 2 })
        : null;
      const radialCanvas = radialChartRef.current
        ? await html2canvas(radialChartRef.current, { scale: 2 })
        : null;

      if (mainCanvas && radialCanvas) {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const date = new Date().toLocaleDateString();

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Analytics Report of Water Sites", 105, 20, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text(`Date Generated: ${date}`, 105, 30, { align: "center" });

        const pageWidth = 180; // Max width for A4 page
        const availableHeight = 220; // Available height after title
        const mainChartHeight = (mainCanvas.height / mainCanvas.width) * pageWidth;

        // Set RadialChart smaller than MainChart (Centered)
        const radialChartWidth = 100; // Smaller width for portrait-like shape
        const radialChartHeight = (radialCanvas.height / radialCanvas.width) * radialChartWidth;
        const radialChartX = (210 - radialChartWidth) / 2; // Centered in A4 (210mm width)

        let yPosition = 40;

        // Add MainChart (Full Width)
        pdf.addImage(mainCanvas.toDataURL("image/png", 1.0), "PNG", 15, yPosition, pageWidth, mainChartHeight);
        yPosition += mainChartHeight + 10;

        // Add RadialChart (Centered, Smaller Width)
        pdf.addImage(radialCanvas.toDataURL("image/png", 1.0), "PNG", radialChartX, yPosition, radialChartWidth, radialChartHeight);

        pdf.save(`Water_Sites_Report_${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`);
      }
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
      setIsCapturing(false);
      setIsExporting(false);
    }
  };


  return (
    <AuthenticatedLayout
      header={
        <div className="flex justify-between ">

          <h2 className="text-xl font-semibold leading-tight text-dark-800 bg-white:text-dark-200">
            Dashboard
          </h2>
          <Button onClick={exportReport} variant="outline">
            <ArrowDownToLine />
            Export Report
          </Button>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="px-6 grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading || !summaryData
          ? Array(3)
            .fill(0)
            .map((_, index) => <SummaryCardSkeleton key={index} />) // Show skeleton while loading
          : summaryData.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={iconMap[item.icon]}
            />
          ))}
      </div>


      <div className="py-12 px-6 grid lg:grid-cols-3 sm:grid-cols-1 gap-6">
        <div className="lg:col-span-2 justify center items-center w-full">
          <div ref={mainChartRef}>
            <MainChart isCapturing={isCapturing} />

          </div>
        </div>
        <div>
          <div ref={radialChartRef}>
            <RadialChart isCapturing={isCapturing} />
          </div>
        </div>
      </div>



      <Dialog open={isExporting}>
        <DialogContent className="flex flex-col items-center gap-4 p-6">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p>Generating report, please wait...</p>
        </DialogContent>
      </Dialog>
    </AuthenticatedLayout>
  );
}
