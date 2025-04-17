
import { useMemo } from "react";

interface TimelineHeaderProps {
  dateRange: {
    start: Date;
    end: Date;
  };
}

const TimelineHeader = ({ dateRange }: TimelineHeaderProps) => {
  // Generate array of dates for the timeline
  const dates = useMemo(() => {
    const { start, end } = dateRange;
    const datesArray = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return datesArray;
  }, [dateRange]);

  return (
    <div className="grid grid-cols-[180px_1fr] pl-8">
      <div className="text-sm font-medium">ASIN / Metric</div>
      <div className="flex">
        {dates.map((date, index) => {
          const isToday = date.toDateString() === new Date().toDateString();
          const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          
          // Only show every 3rd date for cleaner UI when there are many days
          const showLabel = index % 3 === 0 || isToday || index === dates.length - 1;
          
          return (
            <div 
              key={date.toISOString()} 
              className={`flex-1 text-center text-xs ${isToday ? 'font-bold text-primary' : ''}`}
            >
              {showLabel && <div>{formattedDate}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineHeader;
