import { MonthlySummaryModel } from "./MonthlySummary";
import Highcharts from "./highcharts-config";
import HighchartsReact from "highcharts-react-official";

interface MonthlyMoodLineChartProps {
    summary: MonthlySummaryModel | null,
}

export const MonthlyMoodLineChart = ({ summary }: MonthlyMoodLineChartProps) => {
    if(!summary) {
        return null;
    }
    const days = Object.keys(summary.dailyData).sort();
    const moods = Object.keys(summary.monthlyTotals);

    const series = moods.map((mood) => ({
    name: mood,
    data: days.map((day) => summary.dailyData[day]?.[mood] || 0)
  }));

  const options: Highcharts.Options = {
    chart: {
      type: "line",
    },
    title: {
      text: `Daily Mood Trends for ${summary.month}`
    },
    accessibility: {
      enabled: true,
      description: `Line chart showing daily mood trends for the month of ${summary.month}. Each line represents a mood and its count per day.`
    },
    xAxis: {
      categories: days,
      title: {
        text: "Date"
      }
    },
    yAxis: {
      title: {
        text: "Mood Count"
      },
      min: 0
    },
    tooltip: {
      shared: true,
      valueSuffix: " entries"
    },
    series: series as Highcharts.SeriesOptionsType[]
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}