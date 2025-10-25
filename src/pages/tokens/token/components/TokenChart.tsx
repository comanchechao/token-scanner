import React, { useEffect, useRef } from "react";
import createDatafeed from "../../../public/data/datafeed";

interface TokenChartProps {
  tokenMint: string;
}

declare global {
  interface Window {
    TradingView: any;
    Datafeeds: any;
    tvWidget: any;
  }
}

interface MarkCustomColor {
  background: string;
  border: string;
}

interface Mark {
  id: string | number;
  time: number;
  color: string | MarkCustomColor;
  text: string;
  label: string;
  labelFontColor: string;
  minSize: number;
  borderColor?: string;
  borderWidth?: number;
  hoveredBorderWidth?: number;
}

const TokenChart: React.FC<TokenChartProps> = ({ tokenMint }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML =
      '<div id="tv_chart_container" style="height:100%;width:100%;"></div>';

    const loadChartLibrary = () => {
      if (typeof window.tvWidget === "undefined") {
        window.tvWidget = null;
      }

      // Avoid injecting the script multiple times
      const existingScript = document.querySelector(
        'script[src="/lib/charting_library/charting_library.standalone.js"]'
      ) as HTMLScriptElement | null;
      if (existingScript) {
        if ((window as any).TradingView) {
          initializeChart();
        } else {
          existingScript.addEventListener("load", initializeChart, {
            once: true,
          });
        }
        return;
      }

      const tvScript = document.createElement("script");
      tvScript.src = "/lib/charting_library/charting_library.standalone.js";
      tvScript.async = true;
      tvScript.defer = true;

      tvScript.addEventListener("load", initializeChart, { once: true });
      document.head.appendChild(tvScript);
    };

    const initializeChart = () => {
      try {
        const baseUrl = window.location.origin;

        const customDatafeed = {
          ...createDatafeed(tokenMint),

          supports_marks: true,

          getMarks: (
            symbolInfo: any,
            from: number,
            to: number,
            onDataCallback: (marks: Mark[]) => void
          ) => {
            console.log("getMarks called with range:", from, to);

            const timeRange = to - from;
            const step = Math.floor(timeRange / 5);

            const marks: Mark[] = [
              {
                id: 1,
                time: from + step,
                color: {
                  background: "#25a69a",
                  border: "#25a69a",
                },
                text: "Dev bought $515.5 at $93.2K USD Market Cap",
                label: "DB",
                labelFontColor: "#ffffff",
                minSize: 20,
                borderWidth: 1,
                hoveredBorderWidth: 2,
              },
              {
                id: 2,
                time: from + step * 2,
                color: {
                  background: "#e53935",
                  border: "#e53935",
                },
                text: "Dev sold $515.5 at $93.2K USD Market Cap",
                label: "DS",
                labelFontColor: "#ffffff",
                minSize: 20,
                borderWidth: 1,
                hoveredBorderWidth: 2,
              },
              {
                id: 3,
                time: from + step * 3,
                color: {
                  background: "#e53935",
                  border: "#e53935",
                },
                text: "Dev sold $515.5 at $93.2K USD Market Cap",
                label: "DS",
                labelFontColor: "#ffffff",
                minSize: 20,
                borderWidth: 1,
                hoveredBorderWidth: 2,
              },
              {
                id: 4,
                time: from + step * 4,
                color: {
                  background: "#25a69a",
                  border: "#25a69a",
                },
                text: "Dev bought $515.5 at $93.2K USD Market Cap",
                label: "DB",
                labelFontColor: "#ffffff",
                minSize: 20,
                borderWidth: 1,
                hoveredBorderWidth: 2,
              },
            ];

            console.log("Sending marks:", marks);
            onDataCallback(marks);
          },
        };

        const widgetOptions = {
          symbol: tokenMint,
          interval: "1",
          container: "tv_chart_container",
          datafeed: customDatafeed,
          library_path: `${baseUrl}/lib/charting_library/`,
          locale: "en",
          theme: "dark",
          autosize: true,
          debug: true,
          disabled_features: ["header_symbol_search", "header_saveload"],
          enabled_features: ["support_marks", "two_character_bar_marks_labels"],
          customFormatters: {
            timeFormatter: {
              format: (date: Date) => date.toLocaleDateString(),
            },
          },
          overrides: {
            "paneProperties.background": "#131722",
            "paneProperties.vertGridProperties.color": "#242832",
            "paneProperties.horzGridProperties.color": "#242832",
            "scalesProperties.textColor": "#AAA",
            "mainSeriesProperties.candleStyle.wickUpColor": "#25a69a",
            "mainSeriesProperties.candleStyle.wickDownColor": "#e53935",
            "mainSeriesProperties.candleStyle.upColor": "#25a69a",
            "mainSeriesProperties.candleStyle.downColor": "#e53935",
          },
        };

        window.tvWidget = new window.TradingView.widget(widgetOptions);

        window.tvWidget.onChartReady(() => {
          console.log("Chart is ready");
          console.log("Chart methods:", Object.keys(window.tvWidget.chart()));

          setTimeout(() => {
            const chart = window.tvWidget.chart();
            if (chart.refreshMarks) {
              console.log("Refreshing marks");
              chart.refreshMarks();
            }
          }, 1000);
        });
      } catch (error) {
        console.error("Error initializing chart:", error);
      }
    };

    loadChartLibrary();

    return () => {
      if (window.tvWidget) {
        try {
          window.tvWidget.remove();
        } catch {}
        window.tvWidget = null;
      }
      // Do not remove the global script; reuse it on next visit
    };
  }, [tokenMint]);

  return (
    <div className="flex items-center h-[32.6rem] w-full  justify-between">
      <div
        ref={container}
        className="w-full h-full"
        style={{ backgroundColor: "#131722" }}
      />
    </div>
  );
};

export default TokenChart;
