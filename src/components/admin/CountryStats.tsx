
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CountryStatsProps {
  data: {
    name: string;
    value: number;
  }[];
}

const CountryStats = ({ data }: CountryStatsProps) => {
  return (
    <Card className="shadow-sm border border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-200">Communities by Country</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800/90 p-3 border border-gray-700 shadow-xl rounded-md backdrop-blur-sm">
                        <p className="text-sm font-medium text-gray-200">{payload[0].payload.name}</p>
                        <p className="text-sm text-primary">{`${payload[0].value}% of communities`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#3e90cf" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <rect 
                    key={`rect-${index}`}
                    className="transition-all duration-300 hover:opacity-80"
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryStats;
