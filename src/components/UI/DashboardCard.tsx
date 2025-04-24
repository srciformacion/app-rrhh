
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { 
    value: number; 
    label: string; 
  };
  className?: string;
}

export function DashboardCard({ title, value, icon, trend, className }: DashboardCardProps) {
  const isPositiveTrend = trend ? trend.value >= 0 : true;
  
  return (
    <div className={cn("rounded-lg border bg-white shadow-sm p-6", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-full p-2 bg-gray-100">{icon}</div>
      </div>
      <div className="mt-3">
        <h2 className="text-3xl font-bold">{value}</h2>
        {trend && (
          <p className={cn("text-sm flex items-center mt-1",
            isPositiveTrend ? "text-green-600" : "text-red-600"
          )}>
            <span className="mr-1">
              {isPositiveTrend ? '↑' : '↓'}
            </span>
            <span>{Math.abs(trend.value)}% {trend.label}</span>
          </p>
        )}
      </div>
    </div>
  );
}
