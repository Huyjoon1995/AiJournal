import React from 'react';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "./highcharts-config";

const TestHeatmap = () => {
  const options: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      height: 300
    },
    title: {
      text: 'Test Heatmap'
    },
    xAxis: {
      categories: ['A', 'B', 'C', 'D', 'E']
    },
    yAxis: {
      categories: ['1', '2', '3', '4', '5']
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#7cb5ec'
    },
    series: [{
      type: 'heatmap',
      name: 'Test Data',
      data: [
        [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
        [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
        [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
        [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
        [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115]
      ],
      dataLabels: {
        enabled: true
      }
    } as Highcharts.SeriesHeatmapOptions]
  };

  return (
    <div>
      <h2>Test Heatmap</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TestHeatmap;

