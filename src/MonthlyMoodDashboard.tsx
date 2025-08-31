import { Box, Stack, Typography } from "@mui/material";
import { MonthlySummaryModel } from "./MonthlySummary";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

interface MonthlyMoodDashboardProps {
  summary: MonthlySummaryModel | null;
}

export const MonthlyMoodDashboard = ({
  summary,
}: MonthlyMoodDashboardProps) => {
  if (!summary) {
    return null;
  }
  const days = Object.keys(summary.dailyData).sort();
  const moods = Object.keys(summary.monthlyTotals);

  // Heatmap data
  const heatmapData: [number, number, number][] = [];
  days.forEach((day, x) => {
    moods.forEach((mood, y) => {
      heatmapData.push([x, y, summary.dailyData[day]?.[mood] || 0]);
    });
  });

  const heatmapOptions: Highcharts.Options = {
    chart: { type: "heatmap" },
    title: { text: `Daily Mood Heatmap for ${summary.month}` },
    xAxis: { categories: days, title: { text: "Date" } },
    yAxis: { categories: moods, title: { text: "Mood" } },
    colorAxis: { min: 0, minColor: "#FFFFFF", maxColor: "#7cb5ec" },
    series: [
      {
        type: "heatmap",
        name: "Mood count",
        data: heatmapData,
        dataLabels: { enabled: true },
      },
    ],
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
        <HighchartsReact highcharts={Highcharts} options={heatmapOptions} />
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
