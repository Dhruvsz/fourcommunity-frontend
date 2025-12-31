
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataExportProps {
  data: any[];
  className?: string;
}

const DataExport = ({ data, className = "" }: DataExportProps) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    try {
      const headers = Object.keys(data[0]).join(',');
      const csvRows = data.map(row => 
        Object.values(row)
          .map(value => typeof value === 'string' ? `"${value}"` : value)
          .join(',')
      );
      
      const csvContent = [headers, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `communities_data_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Data exported as CSV",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  const exportToJSON = () => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `communities_data_${new Date().toISOString().slice(0, 10)}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: "Data exported as JSON",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs h-8 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
        onClick={exportToCSV}
      >
        <Download className="w-3 h-3 mr-1" /> CSV
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs h-8 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
        onClick={exportToJSON}
      >
        <Download className="w-3 h-3 mr-1" /> JSON
      </Button>
    </div>
  );
};

export default DataExport;
