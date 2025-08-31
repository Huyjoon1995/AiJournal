import { useAuth0 } from "@auth0/auth0-react";
import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MonthlyMoodLineChart } from "./MonthlyMoodLineChart";
import { MonthlyMoodDashboard } from "./MonthlyMoodDashboard";

export interface MonthlySummaryModel {
  month: string;
  dailyData: Record<string, Record<string, number>>;
  monthlyTotals: Record<string, number>;
}

const API_URL = "http://localhost:8000";
export const MonthlySummary = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [monthlySummaryData, setMonthlySummaryData] =
    useState<MonthlySummaryModel | null>(null);

  useEffect(() => {
    const fetchMonthlySummary = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: API_URL,
          },
        });

        const response = await fetch(`${API_URL}/monthly-summary`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const formattedData: MonthlySummaryModel = {
            month: data.month,
            dailyData: data.daily_data,
            monthlyTotals: data.monthly_totals,
          };
          setMonthlySummaryData(formattedData);
        } else {
          console.error(
            "Failed to fetch monthly summary:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error(`Error fetching monthly summary from server: ${error}`);
      }
    };

    if (isAuthenticated) {
      fetchMonthlySummary();
    }
  }, [getAccessTokenSilently, isAuthenticated]);
  return (
    <Stack spacing={6}>
      <MonthlyMoodLineChart summary={monthlySummaryData} />
      <MonthlyMoodDashboard summary={monthlySummaryData} />
    </Stack>
  );
};
