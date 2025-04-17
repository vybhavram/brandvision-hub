
import { generateRealisticValue } from './format-utils';

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

export interface AgentCheck {
  id: string;
  name: string;
  description: string;
  result: "pass" | "fail" | "warning";
  details?: string;
}

export interface DailyAgentChecks {
  date: string;
  overallStatus: "pass" | "fail" | "warning";
  checks: AgentCheck[];
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
  agentChecks: DailyAgentChecks[];
}

export interface ParentAsin {
  id: string;
  name: string;
  children: Asin[];
}

// Define common agent checks that can be run
export const COMMON_AGENT_CHECKS = [
  {
    id: "inventory",
    name: "Inventory Check",
    description: "Verifies if inventory levels are sufficient"
  },
  {
    id: "buybox",
    name: "Buy Box Health",
    description: "Checks buy box ownership percentage"
  },
  {
    id: "listing",
    name: "Listing Health",
    description: "Validates listing quality and compliance"
  },
  {
    id: "pricing",
    name: "Pricing Strategy",
    description: "Analyzes pricing relative to competition"
  },
  {
    id: "reviews",
    name: "Review Monitoring",
    description: "Checks for new negative reviews"
  },
  {
    id: "ppc",
    name: "PPC Performance",
    description: "Monitors advertising efficiency"
  },
  {
    id: "searchrank",
    name: "Search Rank",
    description: "Tracks keyword ranking changes"
  },
  {
    id: "competition",
    name: "Competitor Activity",
    description: "Monitors competitor price and listing changes"
  },
  {
    id: "returns",
    name: "Return Rate",
    description: "Analyzes product return patterns"
  },
  {
    id: "content",
    name: "Content Compliance",
    description: "Verifies A+ content and image compliance"
  }
];

// Helper function to generate a random number between min and max
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate realistic data for a metric over the last 30 days
const generateMetricData = (baseValue: number, volatility: number, trend: number = 0, weekendEffect: number = 0.2): MetricData[] => {
  const days = 30;
  const data: MetricData[] = [];
  
  const today = new Date();
  
  // Generate some random annotations
  const annotationCount = randomNumber(0, 3);
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
    "Keyword ranking improved",
    "Out of stock warning",
    "Sales velocity increased",
    "Buy box lost",
    "Listing suppression",
    "Advertising campaign adjusted"
  ];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i - 1));
    
    const value = generateRealisticValue(baseValue, date, volatility, trend, weekendEffect);
    
    const dataPoint: MetricData = {
      value,
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

// Generate agent checks for an ASIN over the last 30 days
const generateAgentChecks = (asinId: string): DailyAgentChecks[] => {
  const days = 30;
  const today = new Date();
  const checks: DailyAgentChecks[] = [];
  
  // Randomly select 5-8 checks from the common checks for this ASIN
  const selectedCheckCount = randomNumber(5, 8);
  const selectedChecks = [...COMMON_AGENT_CHECKS]
    .sort(() => 0.5 - Math.random())
    .slice(0, selectedCheckCount);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i - 1));
    
    const dailyChecks: AgentCheck[] = selectedChecks.map(check => {
      // Most checks will pass, but occasionally fail
      const rand = Math.random();
      const result = rand > 0.85 ? "fail" : (rand > 0.7 ? "warning" : "pass");
      
      let details = "";
      if (result === "fail") {
        if (check.id === "inventory") {
          details = "Inventory level below 7-day threshold";
        } else if (check.id === "buybox") {
          details = "Buy box percentage dropped below 90%";
        } else if (check.id === "listing") {
          details = "Missing recommended keywords in title";
        } else if (check.id === "pricing") {
          details = "Price is 15% higher than main competitor";
        } else if (check.id === "reviews") {
          details = "Received 3 new negative reviews";
        } else if (check.id === "ppc") {
          details = "ACOS exceeds target by 8%";
        } else if (check.id === "searchrank") {
          details = "Dropped out of top 10 for main keyword";
        } else if (check.id === "competition") {
          details = "New competitor entered with lower price";
        } else if (check.id === "returns") {
          details = "Return rate increased by 5%";
        } else if (check.id === "content") {
          details = "A+ content missing mobile optimization";
        }
      } else if (result === "warning") {
        if (check.id === "inventory") {
          details = "Inventory level approaching 14-day threshold";
        } else if (check.id === "buybox") {
          details = "Buy box percentage dropped to 95%";
        } else if (check.id === "pricing") {
          details = "Price is 5% higher than average competitor";
        } else if (check.id === "reviews") {
          details = "Review velocity decreased by 10%";
        } else if (check.id === "ppc") {
          details = "ACOS trending upward in last 3 days";
        } else if (check.id === "searchrank") {
          details = "Dropped 3 positions for secondary keyword";
        }
      }
      
      return {
        ...check,
        result,
        details: details || undefined
      };
    });
    
    // Overall status is the worst status of any check
    const overallStatus = dailyChecks.some(c => c.result === "fail")
      ? "fail"
      : dailyChecks.some(c => c.result === "warning")
        ? "warning"
        : "pass";
    
    checks.push({
      date: date.toISOString(),
      overallStatus,
      checks: dailyChecks
    });
  }
  
  return checks;
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
  
  const asinId = `ASIN-${id}-${childId}`;
  const asinName = `B${String(1000000 + id * 100 + childId).substring(1)}`;
  
  return {
    id: asinId,
    name: asinName,
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
    },
    agentChecks: generateAgentChecks(asinId)
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

// Mock data for agent alerts
export interface AgentAlert {
  id: string;
  type: 'inventory' | 'pricing' | 'listing' | 'reviews' | 'competitive' | 'advertising';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  asinId: string;
  date: string;
  status: 'pending' | 'dismissed' | 'actioned';
  action?: string;
}

// Generate mock agent alerts
export const generateMockAgentAlerts = (): AgentAlert[] => {
  return [
    {
      id: 'alert-1',
      type: 'inventory',
      severity: 'critical',
      title: 'Inventory Alert: B001234',
      description: 'Inventory level critically low. Estimated stock-out in 3 days based on current sell-through rate.',
      asinId: 'ASIN-1-1',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'pending'
    },
    {
      id: 'alert-2',
      type: 'pricing',
      severity: 'high',
      title: 'Price Alert: B003456',
      description: 'Competitor has lowered price by 15%. Current price is no longer competitive.',
      asinId: 'ASIN-1-3',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      status: 'pending'
    },
    {
      id: 'alert-3',
      type: 'listing',
      severity: 'medium',
      title: 'Listing Alert: B002345',
      description: 'Listing suppressed due to potential safety claim. Immediate review required.',
      asinId: 'ASIN-1-2',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      status: 'pending'
    },
    {
      id: 'alert-4',
      type: 'reviews',
      severity: 'high',
      title: 'Review Alert: B001234',
      description: 'Spike in negative reviews (4 new 1-star) mentioning product quality issues.',
      asinId: 'ASIN-1-1',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      status: 'pending'
    },
    {
      id: 'alert-5',
      type: 'competitive',
      severity: 'medium',
      title: 'Competitive Alert: B004567',
      description: 'New competitor entered market with similar product at 10% lower price point.',
      asinId: 'ASIN-1-4',
      date: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
      status: 'pending'
    },
    {
      id: 'alert-6',
      type: 'advertising',
      severity: 'low',
      title: 'Advertising Alert: B003456',
      description: 'Campaign ACOS has exceeded target by 15% over the last 3 days.',
      asinId: 'ASIN-1-3',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      status: 'pending'
    },
    {
      id: 'alert-7',
      type: 'inventory',
      severity: 'medium',
      title: 'Inventory Alert: B005678',
      description: 'Seasonal inventory forecasting suggests potential stock-out during upcoming holiday period.',
      asinId: 'ASIN-1-5',
      date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      status: 'pending'
    }
  ];
};

// Mock chat data
export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  asinReferences?: string[];
}

export interface Chat {
  id: string;
  title: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

// Generate mock chat history
export const generateMockChatHistory = (): Chat[] => {
  return [
    {
      id: 'chat-1',
      title: 'Inventory Planning',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-1-1',
          role: 'user',
          content: 'Can you help me analyze the inventory levels for #B001234 and suggest reorder quantities?',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          asinReferences: ['ASIN-1-1']
        },
        {
          id: 'msg-1-2',
          role: 'agent',
          content: 'I\'ve analyzed the inventory levels for B001234. Based on the current sell-through rate of 15 units/day and 45 units remaining, you have approximately 3 days of inventory left. I recommend placing an expedited reorder of at least 200 units to account for the 14-day lead time. Would you like me to prepare a purchase order draft?',
          timestamp: new Date(Date.now() - 7.5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-1-3',
          role: 'user',
          content: 'Yes, please prepare the PO. Can you also check if we have any inventory in other warehouses that could be transferred?',
          timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-1-4',
          role: 'agent',
          content: 'I\'ve found 25 units in the West Coast warehouse that could be transferred to the main FC. I\'ve prepared the PO for 200 additional units and initiated a transfer request for the 25 units. The transfer should complete within 3 days, which should help bridge the gap until the new inventory arrives. Would you like to review the PO now?',
          timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-1-5',
          role: 'user',
          content: 'That sounds good. Yes, let me review the PO.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'chat-2',
      title: 'Pricing Strategy',
      lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-2-1',
          role: 'user',
          content: 'I\'ve noticed that #B003456 has been losing Buy Box share. Can you analyze why and suggest pricing adjustments?',
          timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          asinReferences: ['ASIN-1-3']
        },
        {
          id: 'msg-2-2',
          role: 'agent',
          content: 'I\'ve analyzed the Buy Box performance for B003456. The main issue appears to be that Competitor X has reduced their price by 8% in the last week. Your current price is $34.99, while theirs is now $32.49. Your Buy Box percentage has dropped from 98% to 78%. Based on historical data, I recommend a price reduction to $32.99, which should recover most of your Buy Box share while minimizing margin impact. Would you like to see a profitability analysis of this adjustment?',
          timestamp: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2-3',
          role: 'user',
          content: 'Yes, please show me the profitability analysis.',
          timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2-4',
          role: 'agent',
          content: 'Here\'s the profitability analysis:\n\nCurrent Price: $34.99\n- COGS: $18.25\n- FBA Fees: $5.40\n- Margin: $11.34 (32.4%)\n- Daily Units (avg): 22\n- Daily Revenue: $769.78\n- Daily Profit: $249.48\n\nProposed Price: $32.99\n- COGS: $18.25\n- FBA Fees: $5.40\n- Margin: $9.34 (28.3%)\n- Projected Daily Units: 28 (based on elasticity model)\n- Projected Daily Revenue: $923.72\n- Projected Daily Profit: $261.52\n\nThe analysis suggests a 4.8% increase in daily profit despite the lower margin, due to the projected volume increase. Would you like to implement this price change?',
          timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2-5',
          role: 'user',
          content: 'That looks promising. Let\'s implement the price change and monitor for 48 hours. Set up an alert if Buy Box percentage doesn\'t improve to at least 90%.',
          timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-2-6',
          role: 'agent',
          content: 'I\'ve updated the price to $32.99 and set up monitoring for the Buy Box percentage. I\'ll alert you if it doesn\'t reach 90% within 48 hours. I\'ll also provide a performance summary comparing pre and post-adjustment metrics after the 48-hour period.',
          timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'chat-3',
      title: 'Listing Optimization',
      lastMessageTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-3-1',
          role: 'user',
          content: 'Can you analyze the conversion rate for #B002345 and suggest listing improvements?',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          asinReferences: ['ASIN-1-2']
        },
        {
          id: 'msg-3-2',
          role: 'agent',
          content: 'I\'ve analyzed the listing for B002345. The current conversion rate is 12.3%, which is 4.5% below the category average. Here are my recommendations:\n\n1. Title: Add key benefit phrases like "Easy Install" and "Energy Efficient" based on positive review analysis\n2. Images: Add an infographic showing product dimensions and a lifestyle image\n3. Bullet Points: Lead with quantifiable benefits rather than features\n4. Description: Expand with use case examples and customer testimonials\n\nWould you like me to prepare a draft of the updated content?',
          timestamp: new Date(Date.now() - 4.8 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-3-3',
          role: 'user',
          content: 'Yes, please draft the updated content. Also, can you analyze which competitors have higher conversion rates and what they're doing differently?',
          timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-3-4',
          role: 'agent',
          content: 'I\'ve completed the competitor analysis. The top 3 competitors have conversion rates between 15.8% and 18.2%. Their key differentiators are:\n\n1. They all include video content demonstrating product usage\n2. They have more customer images (avg. 12 vs. your 4)\n3. They use comparison tables in their A+ content\n4. Their titles include specific problem statements that the product solves\n\nI\'ve incorporated these insights into your content draft. Would you like me to also create a video script and comparison table for your A+ content?',
          timestamp: new Date(Date.now() - 4.2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg-3-5',
          role: 'user',
          content: 'Yes to both. Send over everything when it\'s ready.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  ];
};
