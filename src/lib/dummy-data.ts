
// Types for our ASIN data model
export interface Annotation {
  text: string;
  type: "info" | "warning" | "success";
  date: string;
}

export interface MetricData {
  value: number;
  date: string;
  annotations?: Annotation[];
}

export interface Metrics {
  [key: string]: MetricData[];
}

export interface Asin {
  id: string;
  name: string;
  metrics: {
    revenue: MetricData[];
    unitsSold: MetricData[];
    sessions: MetricData[];
    conversionRate: MetricData[];
    adSpend: MetricData[];
    acos: MetricData[];
    tacos: MetricData[];
    dos: MetricData[];
    deals: MetricData[];
  };
}

export interface ParentAsin {
  id: string;
  name: string;
  children: Asin[];
}

// Helper function to generate a random number between min and max
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate random data for a metric
const generateMetricData = (baseValue: number, volatility: number): MetricData[] => {
  const days = 30;
  const data: MetricData[] = [];
  let currentValue = baseValue;
  
  const today = new Date();
  
  // Generate some random annotations
  const annotationCount = randomNumber(0, 2);
  const annotationDays = Array.from({ length: annotationCount })
    .map(() => randomNumber(0, days - 1));
  
  const annotationTypes: ("info" | "warning" | "success")[] = [
    "info", "warning", "success"
  ];
  
  const annotationTexts = [
    "Price change",
    "Inventory alert",
    "Promotion started",
    "Competitor price drop",
    "Listing optimized",
    "New review",
    "Keyword ranking improved"
  ];
  
  for (let i = 0; i < days; i++) {
    // Apply some random fluctuation to the value
    const change = (Math.random() - 0.5) * volatility * baseValue;
    currentValue = Math.max(0, currentValue + change);
    
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i - 1));
    
    const dataPoint: MetricData = {
      value: currentValue,
      date: date.toISOString()
    };
    
    // Add annotations if this day is in the annotation days list
    if (annotationDays.includes(i)) {
      dataPoint.annotations = [{
        text: annotationTexts[randomNumber(0, annotationTexts.length - 1)],
        type: annotationTypes[randomNumber(0, annotationTypes.length - 1)],
        date: date.toISOString()
      }];
    }
    
    data.push(dataPoint);
  }
  
  return data;
};

// Generate dummy data for ASINs
const generateAsin = (id: number, childId: number): Asin => {
  const revenueBase = randomNumber(5000, 50000);
  const unitsSoldBase = randomNumber(100, 1000);
  const sessionsBase = randomNumber(1000, 10000);
  const conversionRateBase = randomNumber(5, 20);
  const adSpendBase = randomNumber(500, 5000);
  const acosBase = randomNumber(10, 30);
  const tacosBase = randomNumber(5, 20);
  const dosBase = randomNumber(10, 40);
  const dealsBase = randomNumber(1, 10);
  
  return {
    id: `ASIN-${id}-${childId}`,
    name: `B${String(1000000 + id * 100 + childId).substring(1)}`,
    metrics: {
      revenue: generateMetricData(revenueBase, 0.05),
      unitsSold: generateMetricData(unitsSoldBase, 0.08),
      sessions: generateMetricData(sessionsBase, 0.1),
      conversionRate: generateMetricData(conversionRateBase, 0.03),
      adSpend: generateMetricData(adSpendBase, 0.06),
      acos: generateMetricData(acosBase, 0.04),
      tacos: generateMetricData(tacosBase, 0.03),
      dos: generateMetricData(dosBase, 0.02),
      deals: generateMetricData(dealsBase, 0.2)
    }
  };
};

// Generate dummy data for parent ASINs
export const generateParentAsin = (id: number, childCount: number): ParentAsin => {
  return {
    id: `PARENT-${id}`,
    name: `Parent ASIN ${id}`,
    children: Array.from({ length: childCount }).map((_, index) => 
      generateAsin(id, index + 1)
    )
  };
};

// Generate all dummy ASIN data
export const generateDummyAsinData = (totalAsinCount: number): ParentAsin[] => {
  // Create some parent ASINs with varying numbers of children
  const parentCount = Math.ceil(totalAsinCount / 10);
  let remainingAsins = totalAsinCount;
  
  const parents: ParentAsin[] = [];
  
  for (let i = 1; i <= parentCount; i++) {
    const childCount = i === parentCount 
      ? remainingAsins 
      : randomNumber(Math.min(5, remainingAsins), Math.min(15, remainingAsins));
    
    parents.push(generateParentAsin(i, childCount));
    remainingAsins -= childCount;
    
    if (remainingAsins <= 0) break;
  }
  
  return parents;
};
