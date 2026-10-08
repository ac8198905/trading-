// Realistic Initial Stock and Market Indices Data

export const INITIAL_MARKET_INDICES = [
  {
    id: "nifty50",
    name: "NIFTY 50",
    value: 24985.45,
    previousClose: 24800.25,
    change: 185.20,
    changePercent: 0.75,
  },
  {
    id: "banknifty",
    name: "BANK NIFTY",
    value: 51420.80,
    previousClose: 51533.30,
    change: -112.50,
    changePercent: -0.22,
  },
  {
    id: "sensex",
    name: "SENSEX",
    value: 81890.30,
    previousClose: 81470.15,
    change: 420.15,
    changePercent: 0.52,
  },
  {
    id: "niftyit",
    name: "NIFTY IT",
    value: 42150.25,
    previousClose: 41839.45,
    change: 310.80,
    changePercent: 0.74,
  },
];

export const INITIAL_STOCKS = [
  {
    id: 1,
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2850.45,
    previousClose: 2825.30,
    change: 25.15,
    changePercent: 0.89,
    volume: 1450200,
    dayHigh: 2875.20,
    dayLow: 2802.10,
    open: 2832.50,
    sector: "Energy",
    marketCap: "₹19.28T",
    peRatio: 28.4,
  },
  {
    id: 2,
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3920.80,
    previousClose: 3950.00,
    change: -29.20,
    changePercent: -0.74,
    volume: 820400,
    dayHigh: 3965.00,
    dayLow: 3898.00,
    open: 3955.00,
    sector: "IT",
    marketCap: "₹14.18T",
    peRatio: 30.2,
  },
  {
    id: 3,
    symbol: "INFY",
    name: "Infosys Ltd",
    price: 1845.60,
    previousClose: 1818.00,
    change: 27.60,
    changePercent: 1.52,
    volume: 2150000,
    dayHigh: 1860.00,
    dayLow: 1812.50,
    open: 1820.00,
    sector: "IT",
    marketCap: "₹7.66T",
    peRatio: 26.8,
  },
  {
    id: 4,
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1680.25,
    previousClose: 1692.50,
    change: -12.25,
    changePercent: -0.72,
    volume: 3410000,
    dayHigh: 1698.40,
    dayLow: 1672.00,
    open: 1690.00,
    sector: "Banking",
    marketCap: "₹12.77T",
    peRatio: 19.5,
  },
  {
    id: 5,
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 1245.90,
    previousClose: 1230.10,
    change: 15.80,
    changePercent: 1.28,
    volume: 2980000,
    dayHigh: 1255.00,
    dayLow: 1228.00,
    open: 1232.00,
    sector: "Banking",
    marketCap: "₹8.76T",
    peRatio: 18.2,
  },
  {
    id: 6,
    symbol: "SBIN",
    name: "State Bank of India",
    price: 795.30,
    previousClose: 788.60,
    change: 6.70,
    changePercent: 0.85,
    volume: 4120000,
    dayHigh: 802.40,
    dayLow: 785.00,
    open: 790.00,
    sector: "Banking",
    marketCap: "₹7.10T",
    peRatio: 10.9,
  },
  {
    id: 7,
    symbol: "ITC",
    name: "ITC Limited",
    price: 485.50,
    previousClose: 482.00,
    change: 3.50,
    changePercent: 0.73,
    volume: 3890000,
    dayHigh: 489.20,
    dayLow: 480.00,
    open: 481.50,
    sector: "FMCG",
    marketCap: "₹6.05T",
    peRatio: 27.6,
  },
  {
    id: 8,
    symbol: "WIPRO",
    name: "Wipro Limited",
    price: 532.10,
    previousClose: 538.40,
    change: -6.30,
    changePercent: -1.17,
    volume: 1640000,
    dayHigh: 541.00,
    dayLow: 529.50,
    open: 539.00,
    sector: "IT",
    marketCap: "₹2.78T",
    peRatio: 23.4,
  },
  {
    id: 9,
    symbol: "TATAMOTORS",
    name: "Tata Motors Passenger Vehicles",
    price: 942.75,
    previousClose: 928.30,
    change: 14.45,
    changePercent: 1.56,
    volume: 3200000,
    dayHigh: 955.00,
    dayLow: 925.00,
    open: 930.00,
    sector: "Automobile",
    marketCap: "₹3.46T",
    peRatio: 14.8,
  },
  {
    id: 10,
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    price: 2470.15,
    previousClose: 2490.50,
    change: -20.35,
    changePercent: -0.82,
    volume: 910000,
    dayHigh: 2498.00,
    dayLow: 2455.00,
    open: 2492.00,
    sector: "FMCG",
    marketCap: "₹5.80T",
    peRatio: 54.1,
  },
  {
    id: 11,
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Limited",
    price: 6890.00,
    previousClose: 6780.50,
    change: 109.50,
    changePercent: 1.61,
    volume: 670000,
    dayHigh: 6940.00,
    dayLow: 6750.00,
    open: 6790.00,
    sector: "Financial Services",
    marketCap: "₹4.26T",
    peRatio: 29.3,
  },
  {
    id: 12,
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd",
    price: 1560.40,
    previousClose: 1542.20,
    change: 18.20,
    changePercent: 1.18,
    volume: 1890000,
    dayHigh: 1575.00,
    dayLow: 1538.00,
    open: 1545.00,
    sector: "Telecom",
    marketCap: "₹8.82T",
    peRatio: 68.2,
  },
];

// Helper to generate realistic historical data points for a given stock base price and timeframe
export const generateHistoryData = (basePrice, timeframe = "1D") => {
  const points = [];


  switch (timeframe) {
    case "1D": {
      // 9:15 to 15:30 (intervals of 15 mins = 25 points)
      const times = [
        "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45",
        "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30",
        "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15",
        "14:30", "14:45", "15:00", "15:15", "15:30"
      ];
      // Work backward or forward from morning open to current price
      let p = basePrice * (1 - (Math.random() * 0.012 - 0.006));
      times.forEach((t, i) => {
        const drift = (basePrice - p) / (times.length - i);
        const noise = (Math.random() - 0.49) * (basePrice * 0.004);
        p = i === times.length - 1 ? basePrice : +(p + drift + noise).toFixed(2);
        points.push({
          time: t,
          price: Math.max(1, p),
          volume: Math.floor(20000 + Math.random() * 80000),
        });
      });
      break;
    }
    case "1W": {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      let p = +(basePrice * 0.985).toFixed(2);
      days.forEach((d, i) => {
        const step = (basePrice - p) / (days.length - i) + (Math.random() - 0.5) * (basePrice * 0.01);
        p = i === days.length - 1 ? basePrice : +(p + step).toFixed(2);
        points.push({
          time: d,
          price: Math.max(1, p),
          volume: Math.floor(400000 + Math.random() * 800000),
        });
      });
      break;
    }
    case "1M": {
      const totalDays = 22; // trading days in a month
      let p = +(basePrice * 0.95).toFixed(2);
      for (let i = 1; i <= totalDays; i++) {
        const step = (basePrice - p) / (totalDays - i + 1) + (Math.random() - 0.48) * (basePrice * 0.015);
        p = i === totalDays ? basePrice : +(p + step).toFixed(2);
        points.push({
          time: `Day ${i}`,
          price: Math.max(1, p),
          volume: Math.floor(500000 + Math.random() * 900000),
        });
      }
      break;
    }
    case "3M": {
      const weeks = 12;
      let p = +(basePrice * 0.91).toFixed(2);
      for (let i = 1; i <= weeks; i++) {
        const step = (basePrice - p) / (weeks - i + 1) + (Math.random() - 0.47) * (basePrice * 0.02);
        p = i === weeks ? basePrice : +(p + step).toFixed(2);
        points.push({
          time: `Wk ${i}`,
          price: Math.max(1, p),
          volume: Math.floor(2500000 + Math.random() * 3000000),
        });
      }
      break;
    }
    case "1Y": {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      let p = +(basePrice * 0.82).toFixed(2);
      months.forEach((m, i) => {
        const step = (basePrice - p) / (months.length - i) + (Math.random() - 0.46) * (basePrice * 0.03);
        p = i === months.length - 1 ? basePrice : +(p + step).toFixed(2);
        points.push({
          time: m,
          price: Math.max(1, p),
          volume: Math.floor(10000000 + Math.random() * 15000000),
        });
      });
      break;
    }
    default:
      break;
  }

  return points;
};

// Initial Seed Positions
export const INITIAL_POSITIONS = [
  {
    id: "POS-101",
    symbol: "RELIANCE",
    companyName: "Reliance Industries",
    qty: 15,
    avgPrice: 2780.00,
    product: "Delivery",
  },
  {
    id: "POS-102",
    symbol: "INFY",
    companyName: "Infosys Ltd",
    qty: 25,
    avgPrice: 1790.50,
    product: "Delivery",
  },
  {
    id: "POS-103",
    symbol: "TATAMOTORS",
    companyName: "Tata Motors Passenger Vehicles",
    qty: 20,
    avgPrice: 910.20,
    product: "Delivery",
  },
];

// Initial Seed Orders
export const INITIAL_ORDERS = [
  {
    id: "ORD-94812",
    symbol: "RELIANCE",
    type: "BUY",
    orderType: "Market",
    product: "Delivery",
    quantity: 15,
    price: 2780.00,
    status: "Executed",
    timestamp: "Today, 09:24 AM",
  },
  {
    id: "ORD-94813",
    symbol: "INFY",
    type: "BUY",
    orderType: "Limit",
    product: "Delivery",
    quantity: 25,
    price: 1790.50,
    status: "Executed",
    timestamp: "Today, 10:15 AM",
  },
  {
    id: "ORD-94814",
    symbol: "TATAMOTORS",
    type: "BUY",
    orderType: "Market",
    product: "Delivery",
    quantity: 20,
    price: 910.20,
    status: "Executed",
    timestamp: "Today, 11:32 AM",
  },
  {
    id: "ORD-94815",
    symbol: "TCS",
    type: "BUY",
    orderType: "Limit",
    product: "Delivery",
    quantity: 5,
    price: 3880.00,
    status: "Pending",
    timestamp: "Today, 01:10 PM",
  },
];

export const INITIAL_WATCHLIST_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "ITC",
  "WIPRO",
  "TATAMOTORS",
  "HINDUNILVR",
];

export const INITIAL_USER = {
  name: "Abhishek",
  balance: 125450.00, // ₹1,25,450
  email: "abhishek@tradex.terminal",
};
