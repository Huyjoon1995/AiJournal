import { Box, Stack, Typography } from "@mui/material";
import { MonthlySummaryModel } from "./MonthlySummary";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "./highcharts-config";

interface MonthlyMoodDashboardProps {
  summary: MonthlySummaryModel | null;
}

export const MonthlyMoodDashboard = ({
  summary,
}: MonthlyMoodDashboardProps) => {
  if (!summary) {
    return null;
  }
  
  console.log("MonthlyMoodDashboard summary:", summary);
  
  const days = Object.keys(summary.dailyData).sort();
  const moods = Object.keys(summary.monthlyTotals);
  
  console.log("Days:", days);
  console.log("Moods:", moods);

  // Heatmap data - format: [x, y, value]
  const heatmapData: [number, number, number][] = [];
  days.forEach((day, x) => {
    moods.forEach((mood, y) => {
      const value = summary.dailyData[day]?.[mood] || 0;
      if (value > 0) { // Only add non-zero values for better visualization
        heatmapData.push([x, y, value]);
      }
    });
  });
  
  console.log("Heatmap data:", heatmapData);

  const heatmapOptions: Highcharts.Options = {
    chart: { 
      type: "heatmap",
      height: 400
    },
    title: { text: `Daily Mood Heatmap for ${summary.month}` },
    xAxis: { 
      categories: days, 
      title: { text: "Date" },
      type: 'category'
    },
    yAxis: { 
      categories: moods, 
      title: { text: "Mood" },
      type: 'category'
    },
    colorAxis: { 
      min: 0, 
      minColor: "#FFFFFF", 
      maxColor: "#7cb5ec" 
    },
    series: [
      {
        type: "heatmap",
        name: "Mood count",
        data: heatmapData,
        dataLabels: { enabled: true },
        borderWidth: 1,
        borderColor: '#000000'
      } as Highcharts.SeriesHeatmapOptions,
    ],
    plotOptions: {
      heatmap: {
        animation: false,
        enableMouseTracking: true,
        point: {
          events: {
            mouseOver: function() {
              console.log('Mouse over point:', this);
            }
          }
        }
      }
    }
  };

  const barOptions: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: `Monthly Mood Totals for ${summary.month}` },
    xAxis: { categories: moods },
    yAxis: { title: { text: "Total Count" }, min: 0 },
    series: [
      {
        type: "column",
        name: "Moods",
        data: moods.map((m) => summary.monthlyTotals[m]),
      },
    ],
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h6" mb={2}>
          Daily Mood Heatmap
        </Typography>
        {heatmapData.length > 0 ? (
          <HighchartsReact 
            highcharts={Highcharts} 
            options={heatmapOptions}
            callback={(chart: any) => {
              console.log('Heatmap chart rendered:', chart);
            }}
          />
        ) : (
          <Typography color="text.secondary">
            No mood data available for this month
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="h6" mb={2}>
          Monthly Mood Totals
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={barOptions} />
      </Box>
    </Stack>
  );
};
