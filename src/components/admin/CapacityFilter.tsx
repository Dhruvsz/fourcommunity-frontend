
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface CapacityFilterProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const CapacityFilter = ({ value, onChange }: CapacityFilterProps) => {
  const [sliderValue, setSliderValue] = useState<number[]>(value);
  
  const handleValueChange = (val: number[]) => {
    setSliderValue(val);
    onChange(val);
  };
  
  const getCapacityLabel = (value: number) => {
    if (value >= 95) return "Critical";
    if (value >= 80) return "High";
    if (value >= 50) return "Medium";
    return "Low";
  };
  
  const getCapacityColor = (value: number) => {
    if (value >= 95) return "bg-red-900/30 text-red-400 border-red-600/50";
    if (value >= 80) return "bg-amber-900/30 text-amber-400 border-amber-600/50";
    if (value >= 50) return "bg-yellow-900/30 text-yellow-400 border-yellow-600/50";
    return "bg-green-900/30 text-green-400 border-green-600/50";
  };
  
  return (
    <Card className="bg-gray-900/80 border-gray-800 shadow-lg h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-200">Capacity Filter</CardTitle>
            <CardDescription className="text-gray-400">
              Filter groups by their capacity utilization
            </CardDescription>
          </div>
          <Badge className={`border ${getCapacityColor(sliderValue[0])}`}>
            {sliderValue[0] >= 95 && <AlertTriangle className="h-3 w-3 mr-1" />}
            {getCapacityLabel(sliderValue[0])}%+
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            defaultValue={[50]}
            min={0}
            max={100}
            step={5}
            value={sliderValue}
            onValueChange={handleValueChange}
            className="my-4"
          />
          
          <div className="flex justify-between">
            <div className="text-xs text-gray-500">0%</div>
            <div className="text-xs text-gray-500">25%</div>
            <div className="text-xs text-gray-500">50%</div>
            <div className="text-xs text-gray-500">75%</div>
            <div className="text-xs text-gray-500">100%</div>
          </div>
          
          <div className="text-center text-sm text-gray-300 mt-2">
            Showing groups with <span className="text-primary font-semibold">{sliderValue[0]}%+</span> capacity utilization
          </div>
          
          {/* Capacity level indicators */}
          <div className="grid grid-cols-4 gap-1 mt-4">
            <div className="flex flex-col items-center">
              <div className="h-1 w-full bg-green-500 rounded-full mb-1"></div>
              <span className="text-[10px] text-gray-500">Low</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-1 w-full bg-yellow-500 rounded-full mb-1"></div>
              <span className="text-[10px] text-gray-500">Medium</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-1 w-full bg-amber-500 rounded-full mb-1"></div>
              <span className="text-[10px] text-gray-500">High</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-1 w-full bg-red-500 rounded-full mb-1"></div>
              <span className="text-[10px] text-gray-500">Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityFilter;
