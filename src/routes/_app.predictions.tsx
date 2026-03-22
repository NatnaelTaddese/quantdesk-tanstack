import { useState, useMemo } from "react"
import { GridPanel } from "@/components/layout/grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {

  Brain,
  Lightning,
  Play,
  Pause,
  Gear,
  ChartBar,
  ChartLine,
  Table,
  Export,
  CaretUp,
  CaretDown,
  Check,
  Clock,
  Star,
  Funnel,
  ArrowsClockwise,
  TreeStructure,
  Sparkle,
  Info,
  CircleNotch,
  CheckCircle,
  Warning,
  X,
  Eye,
  Copy,
  Trash,
} from "@phosphor-icons/react"

import { createFileRoute } from '@tanstack/react-router'

// ============================================================================
// MOCK DATA
// ============================================================================

// Feature sets grouped by category
const featureCategories = {
  "Price/Volume": [
    {
      id: "ohlcv",
      name: "OHLCV Features",
      description: "Open, High, Low, Close, Volume",
    },
    {
      id: "log_returns",
      name: "Log Returns",
      description: "Daily log returns",
    },
    {
      id: "rolling_vol",
      name: "Rolling Volatility",
      description: "5/10/20 day vol",
    },
  ],
  Technical: [
    { id: "rsi", name: "RSI (14)", description: "Relative Strength Index" },
    {
      id: "macd",
      name: "MACD",
      description: "Moving Average Convergence Divergence",
    },
    { id: "bb_pctb", name: "BB %B", description: "Bollinger Band %B" },
    { id: "atr", name: "ATR", description: "Average True Range" },
    {
      id: "sma_cross",
      name: "SMA Crossovers",
      description: "20/50/200 SMA crosses",
    },
    {
      id: "vol_zscore",
      name: "Volume Z-Score",
      description: "Volume vs 20d avg",
    },
  ],
  Momentum: [
    {
      id: "mom_1m",
      name: "1M Momentum",
      description: "1-month price momentum",
    },
    {
      id: "mom_3m",
      name: "3M Momentum",
      description: "3-month price momentum",
    },
    {
      id: "mom_6m",
      name: "6M Momentum",
      description: "6-month price momentum",
    },
    {
      id: "high_52w",
      name: "52W High Proximity",
      description: "Distance from 52W high",
    },
  ],
  Fundamental: [
    { id: "pe", name: "P/E Ratio", description: "Price to Earnings" },
    { id: "pb", name: "P/B Ratio", description: "Price to Book" },
    {
      id: "eps_surprise",
      name: "EPS Surprise",
      description: "Last earnings surprise %",
    },
    {
      id: "rev_beat",
      name: "Revenue Beat/Miss",
      description: "Revenue vs estimates",
    },
  ],
  Macro: [
    { id: "vix", name: "VIX Level", description: "Market volatility index" },
    {
      id: "yield_curve",
      name: "Yield Curve Slope",
      description: "10Y-2Y spread",
    },
    {
      id: "dxy_mom",
      name: "DXY Momentum",
      description: "Dollar index momentum",
    },
  ],
  Sentiment: [
    {
      id: "news_sent",
      name: "News Sentiment",
      description: "Rolling news sentiment avg",
    },
  ],
}

const modelTypes = [
  {
    id: "logistic",
    name: "Logistic Regression",
    description: "Baseline linear model",
    complexity: "Low",
  },
  {
    id: "random_forest",
    name: "Random Forest",
    description: "Ensemble of decision trees",
    complexity: "Medium",
  },
  {
    id: "xgboost",
    name: "XGBoost",
    description: "Gradient boosted trees",
    complexity: "Medium",
  },
  {
    id: "lightgbm",
    name: "LightGBM",
    description: "Light gradient boosting",
    complexity: "Medium",
  },
  {
    id: "lstm",
    name: "LSTM",
    description: "Long Short-Term Memory RNN",
    complexity: "High",
  },
  {
    id: "tft",
    name: "Temporal Fusion Transformer",
    description: "Attention-based time series",
    complexity: "Very High",
  },
]

const trainingWindows = [
  { id: "1y", name: "1 Year", days: 252 },
  { id: "2y", name: "2 Years", days: 504 },
  { id: "5y", name: "5 Years", days: 1260 },
]

const horizons = [
  { id: "1d", name: "1 Day" },
  { id: "5d", name: "5 Days" },
  { id: "10d", name: "10 Days" },
  { id: "21d", name: "21 Days (1M)" },
]

const universeOptions = [
  { id: "single", name: "Single Ticker" },
  { id: "custom", name: "Custom List" },
  { id: "sp500", name: "S&P 500" },
  { id: "nasdaq100", name: "NASDAQ 100" },
  { id: "screener", name: "Screener Results" },
]

// Mock experiments/training runs
const mockExperiments = [
  {
    id: "exp_001",
    name: "LSTM-v3-SPY",
    model: "LSTM",
    target: "Direction",
    horizon: "5D",
    universe: "SPY",
    features: 18,
    accuracy: 72.4,
    f1: 0.71,
    sharpe: 1.82,
    ic: 0.089,
    status: "production",
    trainDate: "2024-03-10",
    epochs: 100,
    params: { hidden_size: 128, layers: 2, dropout: 0.2 },
  },
  {
    id: "exp_002",
    name: "XGBoost-Momentum",
    model: "XGBoost",
    target: "Direction",
    horizon: "1D",
    universe: "QQQ",
    features: 24,
    accuracy: 68.9,
    f1: 0.67,
    sharpe: 1.45,
    ic: 0.072,
    status: "completed",
    trainDate: "2024-03-08",
    epochs: null,
    params: { n_estimators: 500, max_depth: 6, learning_rate: 0.05 },
  },
  {
    id: "exp_003",
    name: "TFT-Multi-v1",
    model: "TFT",
    target: "% Return",
    horizon: "1D",
    universe: "S&P 500",
    features: 32,
    accuracy: null,
    f1: null,
    sharpe: 2.12,
    ic: 0.105,
    status: "training",
    trainDate: "2024-03-12",
    progress: 67,
    epochs: 50,
    params: { hidden_size: 256, attention_heads: 4, dropout: 0.1 },
  },
  {
    id: "exp_004",
    name: "RF-Value-Factor",
    model: "Random Forest",
    target: "Direction",
    horizon: "21D",
    universe: "Russell 2000",
    features: 15,
    accuracy: 58.3,
    f1: 0.56,
    sharpe: 0.92,
    ic: 0.045,
    status: "completed",
    trainDate: "2024-03-05",
    epochs: null,
    params: { n_estimators: 200, max_depth: 10, min_samples_leaf: 5 },
  },
  {
    id: "exp_005",
    name: "LightGBM-Sector",
    model: "LightGBM",
    target: "Direction",
    horizon: "10D",
    universe: "Sector ETFs",
    features: 20,
    accuracy: 64.2,
    f1: 0.62,
    sharpe: 1.28,
    ic: 0.068,
    status: "failed",
    trainDate: "2024-03-07",
    error: "Insufficient data for validation split",
    params: { n_estimators: 300, num_leaves: 31, learning_rate: 0.03 },
  },
]

// Mock signals from production model
const mockSignals = [
  {
    ticker: "NVDA",
    direction: "BUY",
    confidence: 0.92,
    price: 878.34,
    target: 945.0,
    shapTop3: ["mom_3m", "rsi", "vol_zscore"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "AMD",
    direction: "BUY",
    confidence: 0.87,
    price: 178.45,
    target: 195.0,
    shapTop3: ["mom_1m", "eps_surprise", "macd"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "META",
    direction: "BUY",
    confidence: 0.78,
    price: 502.3,
    target: 540.0,
    shapTop3: ["rev_beat", "mom_6m", "pe"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "GOOGL",
    direction: "BUY",
    confidence: 0.72,
    price: 155.72,
    target: 168.0,
    shapTop3: ["pb", "mom_3m", "vix"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "MSFT",
    direction: "NEUTRAL",
    confidence: 0.54,
    price: 415.56,
    target: 420.0,
    shapTop3: ["rolling_vol", "yield_curve", "sma_cross"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "INTC",
    direction: "SELL",
    confidence: 0.88,
    price: 42.85,
    target: 38.0,
    shapTop3: ["mom_6m", "eps_surprise", "high_52w"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "BA",
    direction: "SELL",
    confidence: 0.81,
    price: 198.45,
    target: 175.0,
    shapTop3: ["rev_beat", "atr", "news_sent"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "TSLA",
    direction: "SELL",
    confidence: 0.75,
    price: 175.21,
    target: 155.0,
    shapTop3: ["mom_1m", "rsi", "vol_zscore"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "DIS",
    direction: "SELL",
    confidence: 0.68,
    price: 112.45,
    target: 102.0,
    shapTop3: ["pe", "rev_beat", "mom_3m"],
    signalDate: "2024-03-12",
  },
  {
    ticker: "AAPL",
    direction: "NEUTRAL",
    confidence: 0.51,
    price: 189.84,
    target: 192.0,
    shapTop3: ["bb_pctb", "dxy_mom", "vix"],
    signalDate: "2024-03-12",
  },
]

// Mock feature importance (global SHAP values)
const mockFeatureImportance = [
  { feature: "mom_3m", importance: 0.142, category: "Momentum" },
  { feature: "rsi", importance: 0.128, category: "Technical" },
  { feature: "eps_surprise", importance: 0.115, category: "Fundamental" },
  { feature: "vol_zscore", importance: 0.098, category: "Technical" },
  { feature: "mom_1m", importance: 0.089, category: "Momentum" },
  { feature: "vix", importance: 0.082, category: "Macro" },
  { feature: "macd", importance: 0.076, category: "Technical" },
  { feature: "pe", importance: 0.068, category: "Fundamental" },
  { feature: "yield_curve", importance: 0.055, category: "Macro" },
  { feature: "rolling_vol", importance: 0.048, category: "Price/Volume" },
  { feature: "bb_pctb", importance: 0.042, category: "Technical" },
  { feature: "mom_6m", importance: 0.038, category: "Momentum" },
  { feature: "news_sent", importance: 0.019, category: "Sentiment" },
]

// Mock correlation matrix data (simplified)
const correlationFeatures = [
  "mom_1m",
  "mom_3m",
  "rsi",
  "macd",
  "vol_zscore",
  "pe",
  "vix",
]
const mockCorrelationMatrix = [
  [1.0, 0.82, 0.45, 0.38, 0.22, -0.15, -0.28],
  [0.82, 1.0, 0.52, 0.42, 0.18, -0.12, -0.32],
  [0.45, 0.52, 1.0, 0.65, 0.35, -0.08, -0.18],
  [0.38, 0.42, 0.65, 1.0, 0.28, -0.05, -0.15],
  [0.22, 0.18, 0.35, 0.28, 1.0, 0.12, 0.45],
  [-0.15, -0.12, -0.08, -0.05, 0.12, 1.0, 0.08],
  [-0.28, -0.32, -0.18, -0.15, 0.45, 0.08, 1.0],
]

// Mock rolling IC data
const mockRollingIC = [
  {
    date: "Jan",
    mom_3m: 0.12,
    rsi: 0.08,
    eps_surprise: 0.15,
    vix: 0.05,
    vol_zscore: 0.09,
  },
  {
    date: "Feb",
    mom_3m: 0.11,
    rsi: 0.09,
    eps_surprise: 0.12,
    vix: 0.07,
    vol_zscore: 0.08,
  },
  {
    date: "Mar",
    mom_3m: 0.14,
    rsi: 0.07,
    eps_surprise: 0.11,
    vix: 0.04,
    vol_zscore: 0.1,
  },
  {
    date: "Apr",
    mom_3m: 0.1,
    rsi: 0.11,
    eps_surprise: 0.09,
    vix: 0.08,
    vol_zscore: 0.07,
  },
  {
    date: "May",
    mom_3m: 0.08,
    rsi: 0.1,
    eps_surprise: 0.13,
    vix: 0.06,
    vol_zscore: 0.11,
  },
  {
    date: "Jun",
    mom_3m: 0.13,
    rsi: 0.06,
    eps_surprise: 0.1,
    vix: 0.03,
    vol_zscore: 0.09,
  },
  {
    date: "Jul",
    mom_3m: 0.15,
    rsi: 0.08,
    eps_surprise: 0.08,
    vix: 0.05,
    vol_zscore: 0.06,
  },
  {
    date: "Aug",
    mom_3m: 0.09,
    rsi: 0.12,
    eps_surprise: 0.14,
    vix: 0.09,
    vol_zscore: 0.08,
  },
  {
    date: "Sep",
    mom_3m: 0.07,
    rsi: 0.09,
    eps_surprise: 0.11,
    vix: 0.11,
    vol_zscore: 0.12,
  },
  {
    date: "Oct",
    mom_3m: 0.11,
    rsi: 0.07,
    eps_surprise: 0.09,
    vix: 0.08,
    vol_zscore: 0.1,
  },
  {
    date: "Nov",
    mom_3m: 0.12,
    rsi: 0.1,
    eps_surprise: 0.12,
    vix: 0.04,
    vol_zscore: 0.07,
  },
  {
    date: "Dec",
    mom_3m: 0.09,
    rsi: 0.08,
    eps_surprise: 0.1,
    vix: 0.06,
    vol_zscore: 0.09,
  },
]

// Mock SHAP waterfall for a single ticker
const mockTickerShap = [
  { feature: "mom_3m", value: 0.85, impact: 0.15, direction: "positive" },
  { feature: "rsi", value: 72, impact: 0.12, direction: "positive" },
  { feature: "vol_zscore", value: 2.1, impact: 0.08, direction: "positive" },
  {
    feature: "eps_surprise",
    value: 0.05,
    impact: -0.03,
    direction: "negative",
  },
  { feature: "vix", value: 14.8, impact: -0.02, direction: "negative" },
  { feature: "pe", value: 72.5, impact: -0.05, direction: "negative" },
]

// ============================================================================
// COMPONENT
// ============================================================================

type TabSection = "config" | "training" | "signals" | "explainability"

export const Route = createFileRoute("/_app/predictions")({
  component: PredictionsPage,
})

function PredictionsPage() {
  const [activeTab, setActiveTab] = useState<TabSection>("signals")

  // Model Configuration State
  const [targetType, setTargetType] = useState<"classification" | "regression">(
    "classification"
  )
  const [selectedHorizon, setSelectedHorizon] = useState("5d")
  const [selectedModel, setSelectedModel] = useState("xgboost")
  const [selectedWindow, setSelectedWindow] = useState("2y")
  const [selectedUniverse, setSelectedUniverse] = useState("sp500")
  const [singleTicker, setSingleTicker] = useState("")
  const [customTickers, setCustomTickers] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "ohlcv",
    "log_returns",
    "rsi",
    "macd",
    "mom_1m",
    "mom_3m",
    "pe",
    "vix",
  ])
  const [walkForwardWindow, setWalkForwardWindow] = useState("63")
  const [walkForwardStep, setWalkForwardStep] = useState("21")

  // Training State
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)

  // Signals State
  const [confidenceThreshold, setConfidenceThreshold] = useState(0)
  const [signalFilter, setSignalFilter] = useState<
    "all" | "buy" | "sell" | "neutral"
  >("all")

  // Explainability State
  const [selectedTickerForShap, setSelectedTickerForShap] = useState("NVDA")
  const [explainView, setExplainView] = useState<
    "importance" | "correlation" | "ic"
  >("importance")

  // Compare experiments
  const [compareMode, setCompareMode] = useState(false)
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([])

  // Toggle feature selection
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    )
  }

  // Filter signals based on confidence and direction
  const filteredSignals = useMemo(() => {
    return mockSignals.filter((s) => {
      if (s.confidence * 100 < confidenceThreshold) return false
      if (signalFilter === "buy" && s.direction !== "BUY") return false
      if (signalFilter === "sell" && s.direction !== "SELL") return false
      if (signalFilter === "neutral" && s.direction !== "NEUTRAL") return false
      return true
    })
  }, [confidenceThreshold, signalFilter])

  // Simulate training
  const startTraining = () => {
    setIsTraining(true)
    setTrainingProgress(0)
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + Math.random() * 5
      })
    }, 500)
  }

  const tabs = [
    { id: "config", label: "Configuration", icon: Gear },
    { id: "training", label: "Training", icon: Brain },
    { id: "signals", label: "Signals", icon: Lightning },
    { id: "explainability", label: "Explainability", icon: TreeStructure },
  ]

  const statusColors: Record<string, string> = {
    production: "bg-emerald-500/20 text-emerald-500",
    completed: "bg-blue-500/20 text-blue-500",
    training: "bg-amber-500/20 text-amber-500",
    failed: "bg-rose-500/20 text-rose-500",
  }

  const statusIcons: Record<string, React.ElementType> = {
    production: Star,
    completed: CheckCircle,
    training: CircleNotch,
    failed: Warning,
  }

  return (
    <div className="flex h-full flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between border bg-card px-3 py-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold">PREDICTIONS</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Brain size={12} className="text-purple-500" />
            ML Engine
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabSection)}
              className={cn(
                "flex h-7 items-center gap-1.5 px-3 text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-1 overflow-hidden">
        {/* ================================================================ */}
        {/* MODEL CONFIGURATION TAB */}
        {/* ================================================================ */}
        {activeTab === "config" && (
          <>
            {/* Left: Configuration Options */}
            <div className="flex w-80 flex-col gap-1">
              {/* Target Configuration */}
              <GridPanel title="Target" className="shrink-0">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Prediction Type
                    </label>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setTargetType("classification")}
                        className={cn(
                          "flex-1 rounded-none border px-2 py-1.5 text-[10px] font-medium",
                          targetType === "classification"
                            ? "border-blue-500 bg-blue-500/10 text-blue-500"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Classification
                        <div className="text-[9px] font-normal opacity-70">
                          UP/DOWN/NEUTRAL
                        </div>
                      </button>
                      <button
                        onClick={() => setTargetType("regression")}
                        className={cn(
                          "flex-1 rounded-none border px-2 py-1.5 text-[10px] font-medium",
                          targetType === "regression"
                            ? "border-blue-500 bg-blue-500/10 text-blue-500"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Regression
                        <div className="text-[9px] font-normal opacity-70">
                          % Return
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Forward Horizon
                    </label>
                    <div className="flex gap-1">
                      {horizons.map((h) => (
                        <button
                          key={h.id}
                          onClick={() => setSelectedHorizon(h.id)}
                          className={cn(
                            "flex-1 rounded-none border px-2 py-1.5 text-[10px] font-medium",
                            selectedHorizon === h.id
                              ? "border-blue-500 bg-blue-500/10 text-blue-500"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {h.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GridPanel>

              {/* Model Selection */}
              <GridPanel title="Model Type" className="shrink-0">
                <div className="space-y-1">
                  {modelTypes.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-none border px-2 py-1.5 text-left",
                        selectedModel === model.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "hover:bg-foreground/[0.03]"
                      )}
                    >
                      <div>
                        <div className="text-xs font-medium">{model.name}</div>
                        <div className="text-[9px] text-muted-foreground">
                          {model.description}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[9px]",
                          model.complexity === "Low" &&
                            "bg-emerald-500/20 text-emerald-500",
                          model.complexity === "Medium" &&
                            "bg-blue-500/20 text-blue-500",
                          model.complexity === "High" &&
                            "bg-amber-500/20 text-amber-500",
                          model.complexity === "Very High" &&
                            "bg-rose-500/20 text-rose-500"
                        )}
                      >
                        {model.complexity}
                      </span>
                    </button>
                  ))}
                </div>
              </GridPanel>

              {/* Training Window & Walk-Forward */}
              <GridPanel title="Training Settings" className="flex-1">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Training Window
                    </label>
                    <div className="flex gap-1">
                      {trainingWindows.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => setSelectedWindow(w.id)}
                          className={cn(
                            "flex-1 rounded-none border px-2 py-1.5 text-[10px] font-medium",
                            selectedWindow === w.id
                              ? "border-blue-500 bg-blue-500/10 text-blue-500"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {w.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <label className="mb-2 block text-[10px] font-medium text-muted-foreground">
                      WALK-FORWARD SETTINGS
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-[9px] text-muted-foreground">
                          Window (days)
                        </label>
                        <Input
                          value={walkForwardWindow}
                          onChange={(e) => setWalkForwardWindow(e.target.value)}
                          className="h-6 text-[10px]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[9px] text-muted-foreground">
                          Step (days)
                        </label>
                        <Input
                          value={walkForwardStep}
                          onChange={(e) => setWalkForwardStep(e.target.value)}
                          className="h-6 text-[10px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Universe
                    </label>
                    <select
                      value={selectedUniverse}
                      onChange={(e) => setSelectedUniverse(e.target.value)}
                      className="h-7 w-full rounded-none border bg-transparent px-2 text-xs"
                    >
                      {universeOptions.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>

                    {selectedUniverse === "single" && (
                      <Input
                        placeholder="Enter ticker (e.g. AAPL)"
                        value={singleTicker}
                        onChange={(e) => setSingleTicker(e.target.value)}
                        className="mt-2 h-6 text-[10px]"
                      />
                    )}

                    {selectedUniverse === "custom" && (
                      <textarea
                        placeholder="AAPL, MSFT, NVDA, ..."
                        value={customTickers}
                        onChange={(e) => setCustomTickers(e.target.value)}
                        className="mt-2 h-16 w-full rounded-none border bg-transparent p-2 font-mono text-[10px] placeholder:text-muted-foreground"
                      />
                    )}
                  </div>
                </div>
              </GridPanel>
            </div>

            {/* Right: Feature Selection */}
            <GridPanel
              title="Feature Set"
              className="flex-1"
              actions={
                <span className="text-[10px] text-muted-foreground">
                  {selectedFeatures.length} selected
                </span>
              }
            >
              <div className="space-y-4">
                {Object.entries(featureCategories).map(
                  ([category, features]) => (
                    <div key={category}>
                      <div className="mb-2 flex items-center gap-2 border-b pb-1">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                          {category}
                        </span>
                        <button
                          onClick={() => {
                            const categoryFeatureIds = features.map((f) => f.id)
                            const allSelected = categoryFeatureIds.every((id) =>
                              selectedFeatures.includes(id)
                            )
                            if (allSelected) {
                              setSelectedFeatures((prev) =>
                                prev.filter(
                                  (f) => !categoryFeatureIds.includes(f)
                                )
                              )
                            } else {
                              setSelectedFeatures((prev) => [
                                ...new Set([...prev, ...categoryFeatureIds]),
                              ])
                            }
                          }}
                          className="text-[9px] text-blue-500 hover:underline"
                        >
                          {features.every((f) =>
                            selectedFeatures.includes(f.id)
                          )
                            ? "Deselect all"
                            : "Select all"}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {features.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            className={cn(
                              "flex items-start gap-2 rounded-none border px-2 py-1.5 text-left",
                              selectedFeatures.includes(feature.id)
                                ? "border-blue-500 bg-blue-500/10"
                                : "hover:bg-foreground/[0.03]"
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-sm border",
                                selectedFeatures.includes(feature.id)
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-muted-foreground"
                              )}
                            >
                              {selectedFeatures.includes(feature.id) && (
                                <Check
                                  size={8}
                                  className="text-background"
                                  weight="bold"
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[10px] font-medium">
                                {feature.name}
                              </div>
                              <div className="truncate text-[9px] text-muted-foreground">
                                {feature.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </GridPanel>
          </>
        )}

        {/* ================================================================ */}
        {/* TRAINING & EXPERIMENTS TAB */}
        {/* ================================================================ */}
        {activeTab === "training" && (
          <>
            {/* Left: Training Controls */}
            <div className="flex w-72 flex-col gap-1">
              {/* Training Status */}
              <GridPanel title="Train Model" className="shrink-0">
                <div className="space-y-3">
                  <div className="rounded border border-blue-500/30 bg-blue-500/5 p-2 text-[10px]">
                    <div className="flex items-center gap-1.5 text-blue-500">
                      <Info size={12} />
                      <span className="font-medium">Current Configuration</span>
                    </div>
                    <div className="mt-2 space-y-1 text-muted-foreground">
                      <div>
                        Model:{" "}
                        <span className="text-foreground">
                          {modelTypes.find((m) => m.id === selectedModel)?.name}
                        </span>
                      </div>
                      <div>
                        Target:{" "}
                        <span className="text-foreground">
                          {targetType === "classification"
                            ? "Direction"
                            : "% Return"}
                        </span>
                      </div>
                      <div>
                        Horizon:{" "}
                        <span className="text-foreground">
                          {horizons.find((h) => h.id === selectedHorizon)?.name}
                        </span>
                      </div>
                      <div>
                        Features:{" "}
                        <span className="text-foreground">
                          {selectedFeatures.length} selected
                        </span>
                      </div>
                      <div>
                        Window:{" "}
                        <span className="text-foreground">
                          {
                            trainingWindows.find((w) => w.id === selectedWindow)
                              ?.name
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {isTraining ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="flex items-center gap-1.5 text-amber-500">
                          <CircleNotch size={12} className="animate-spin" />
                          Training in progress...
                        </span>
                        <span className="font-mono">
                          {Math.round(trainingProgress)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-amber-500 transition-all"
                          style={{ width: `${trainingProgress}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        Epoch 67/100 - Loss: 0.342 - Val Acc: 68.2%
                      </div>
                      <Button
                        variant="outline"
                        size="xs"
                        className="w-full gap-1"
                        onClick={() => setIsTraining(false)}
                      >
                        <Pause size={12} />
                        Cancel Training
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full gap-1.5" onClick={startTraining}>
                      <Play size={14} weight="fill" />
                      Start Training
                    </Button>
                  )}
                </div>
              </GridPanel>

              {/* Quick Stats */}
              <GridPanel title="Experiment Stats" className="shrink-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded border p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-foreground">
                      {mockExperiments.length}
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Total Runs
                    </div>
                  </div>
                  <div className="rounded border p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-emerald-500">
                      {
                        mockExperiments.filter((e) => e.status === "production")
                          .length
                      }
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Production
                    </div>
                  </div>
                  <div className="rounded border p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-blue-500">
                      72.4%
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Best Accuracy
                    </div>
                  </div>
                  <div className="rounded border p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-purple-500">
                      1.82
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      Best Sharpe
                    </div>
                  </div>
                </div>
              </GridPanel>

              {/* Actions */}
              <GridPanel title="Actions" className="flex-1">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start gap-2"
                  >
                    <Copy size={12} />
                    Clone Best Model
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start gap-2"
                  >
                    <ArrowsClockwise size={12} />
                    Hyperparameter Sweep
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start gap-2"
                  >
                    <Export size={12} />
                    Export to MLflow
                  </Button>
                  <Button
                    variant={compareMode ? "default" : "outline"}
                    size="xs"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setCompareMode(!compareMode)
                      setSelectedExperiments([])
                    }}
                  >
                    <ChartBar size={12} />
                    {compareMode ? "Exit Compare Mode" : "Compare Experiments"}
                  </Button>
                </div>
              </GridPanel>
            </div>

            {/* Right: Experiments Table */}
            <div className="flex flex-1 flex-col overflow-hidden border bg-card">
              <div className="flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
                <span className="font-medium">Experiments</span>
                {compareMode && selectedExperiments.length > 0 && (
                  <span className="text-blue-500">
                    {selectedExperiments.length} selected for comparison
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-[10px] text-muted-foreground">
                      {compareMode && <th className="w-8 px-2 py-1.5"></th>}
                      <th className="px-3 py-1.5 text-left font-medium">
                        NAME
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium">
                        MODEL
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium">
                        TARGET
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        ACC
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">F1</th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        SHARPE
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">IC</th>
                      <th className="px-3 py-1.5 text-center font-medium">
                        STATUS
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        DATE
                      </th>
                      <th className="px-3 py-1.5 text-center font-medium">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockExperiments.map((exp) => {
                      const StatusIcon = statusIcons[exp.status]
                      return (
                        <tr
                          key={exp.id}
                          className={cn(
                            "border-b border-border/50 hover:bg-foreground/[0.03]",
                            compareMode &&
                              selectedExperiments.includes(exp.id) &&
                              "bg-blue-500/10"
                          )}
                        >
                          {compareMode && (
                            <td className="px-2 py-1.5">
                              <button
                                onClick={() => {
                                  setSelectedExperiments((prev) =>
                                    prev.includes(exp.id)
                                      ? prev.filter((id) => id !== exp.id)
                                      : [...prev, exp.id]
                                  )
                                }}
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-sm border",
                                  selectedExperiments.includes(exp.id)
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-muted-foreground"
                                )}
                              >
                                {selectedExperiments.includes(exp.id) && (
                                  <Check
                                    size={10}
                                    className="text-background"
                                    weight="bold"
                                  />
                                )}
                              </button>
                            </td>
                          )}
                          <td className="px-3 py-1.5 font-mono font-medium">
                            {exp.name}
                          </td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {exp.model}
                          </td>
                          <td className="px-3 py-1.5">
                            <span className="text-muted-foreground">
                              {exp.target}
                            </span>
                            <span className="ml-1 text-[9px] text-muted-foreground/70">
                              {exp.horizon}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono">
                            {exp.accuracy !== null ? `${exp.accuracy}%` : "-"}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                            {exp.f1 !== null ? exp.f1.toFixed(2) : "-"}
                          </td>
                          <td
                            className={cn(
                              "px-3 py-1.5 text-right font-mono",
                              exp.sharpe >= 1.5
                                ? "text-emerald-500"
                                : exp.sharpe >= 1.0
                                  ? "text-blue-500"
                                  : "text-muted-foreground"
                            )}
                          >
                            {exp.sharpe.toFixed(2)}
                          </td>
                          <td className="px-3 py-1.5 text-right font-mono text-muted-foreground">
                            {exp.ic.toFixed(3)}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-medium uppercase",
                                statusColors[exp.status]
                              )}
                            >
                              <StatusIcon
                                size={10}
                                className={
                                  exp.status === "training"
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                              {exp.status}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-right text-muted-foreground">
                            {exp.trainDate}
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex items-center justify-center gap-1">
                              <button className="rounded p-1 text-muted-foreground hover:bg-foreground/10 hover:text-foreground">
                                <Eye size={12} />
                              </button>
                              {exp.status === "completed" && (
                                <button className="rounded p-1 text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-500">
                                  <Star size={12} />
                                </button>
                              )}
                              <button className="rounded p-1 text-muted-foreground hover:bg-rose-500/20 hover:text-rose-500">
                                <Trash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t px-3 py-1 text-[10px] text-muted-foreground">
                <span>{mockExperiments.length} experiments logged</span>
                <span>MLflow Connected</span>
              </div>
            </div>
          </>
        )}

        {/* ================================================================ */}
        {/* SIGNAL DASHBOARD TAB */}
        {/* ================================================================ */}
        {activeTab === "signals" && (
          <>
            {/* Left: Filters & Stats */}
            <div className="flex w-72 flex-col gap-1">
              {/* Production Model Info */}
              <GridPanel title="Production Model" className="shrink-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star
                      size={14}
                      className="text-emerald-500"
                      weight="fill"
                    />
                    <span className="font-mono text-sm font-medium">
                      LSTM-v3-SPY
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="ml-1 font-mono">72.4%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sharpe:</span>
                      <span className="ml-1 font-mono text-emerald-500">
                        1.82
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Horizon:</span>
                      <span className="ml-1 font-mono">5D</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Features:</span>
                      <span className="ml-1 font-mono">18</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 text-[9px] text-muted-foreground">
                    Last updated: Today at 09:30 EST
                  </div>
                </div>
              </GridPanel>

              {/* Signal Filters */}
              <GridPanel title="Filters" className="shrink-0">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Confidence Threshold
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={confidenceThreshold}
                        onChange={(e) =>
                          setConfidenceThreshold(Number(e.target.value))
                        }
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted"
                      />
                      <span className="w-8 font-mono text-[10px]">
                        {confidenceThreshold}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] text-muted-foreground">
                      Signal Direction
                    </label>
                    <div className="flex gap-1">
                      {[
                        { id: "all", label: "All" },
                        { id: "buy", label: "Buy", color: "emerald" },
                        { id: "sell", label: "Sell", color: "rose" },
                        { id: "neutral", label: "Neutral", color: "gray" },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() =>
                            setSignalFilter(f.id as typeof signalFilter)
                          }
                          className={cn(
                            "flex-1 rounded-none border px-2 py-1 text-[10px] font-medium",
                            signalFilter === f.id
                              ? f.color === "emerald"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                : f.color === "rose"
                                  ? "border-rose-500 bg-rose-500/10 text-rose-500"
                                  : "border-blue-500 bg-blue-500/10 text-blue-500"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GridPanel>

              {/* Signal Summary */}
              <GridPanel title="Signal Summary" className="shrink-0">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded border border-emerald-500/30 bg-emerald-500/5 p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-emerald-500">
                      {mockSignals.filter((s) => s.direction === "BUY").length}
                    </div>
                    <div className="text-[9px] text-muted-foreground">BUY</div>
                  </div>
                  <div className="rounded border border-rose-500/30 bg-rose-500/5 p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-rose-500">
                      {mockSignals.filter((s) => s.direction === "SELL").length}
                    </div>
                    <div className="text-[9px] text-muted-foreground">SELL</div>
                  </div>
                  <div className="rounded border p-2 text-center">
                    <div className="font-mono text-lg font-semibold text-muted-foreground">
                      {
                        mockSignals.filter((s) => s.direction === "NEUTRAL")
                          .length
                      }
                    </div>
                    <div className="text-[9px] text-muted-foreground">
                      NEUTRAL
                    </div>
                  </div>
                </div>
                <div className="mt-3 border-t pt-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">
                      Avg Confidence
                    </span>
                    <span className="font-mono">
                      {(
                        (mockSignals.reduce((acc, s) => acc + s.confidence, 0) /
                          mockSignals.length) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">
                      Filtered Signals
                    </span>
                    <span className="font-mono">
                      {filteredSignals.length} / {mockSignals.length}
                    </span>
                  </div>
                </div>
              </GridPanel>

              {/* Export */}
              <GridPanel title="Export" className="flex-1">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start gap-2"
                  >
                    <Export size={12} />
                    Export to CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    className="w-full justify-start gap-2"
                  >
                    <Table size={12} />
                    Export to Google Sheets
                  </Button>
                </div>
              </GridPanel>
            </div>

            {/* Right: Signals Table */}
            <div className="flex flex-1 flex-col overflow-hidden border bg-card">
              <div className="flex items-center justify-between border-b px-3 py-1.5 text-[10px]">
                <span className="font-medium">Current Signals</span>
                <span className="text-muted-foreground">
                  {filteredSignals.length} signals passing filters
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b text-[10px] text-muted-foreground">
                      <th className="px-3 py-1.5 text-left font-medium">
                        TICKER
                      </th>
                      <th className="px-3 py-1.5 text-center font-medium">
                        SIGNAL
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        CONFIDENCE
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        PRICE
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        TARGET
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        UPSIDE
                      </th>
                      <th className="px-3 py-1.5 text-left font-medium">
                        KEY DRIVERS (SHAP)
                      </th>
                      <th className="px-3 py-1.5 text-right font-medium">
                        DATE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSignals.map((signal) => {
                      const upside =
                        ((signal.target - signal.price) / signal.price) * 100
                      return (
                        <tr
                          key={signal.ticker}
                          className={cn(
                            "border-b border-border/50 hover:bg-foreground/[0.03]",
                            signal.direction === "BUY" &&
                              "bg-emerald-500/[0.03]",
                            signal.direction === "SELL" && "bg-rose-500/[0.03]"
                          )}
                        >
                          <td className="px-3 py-2">
                            <span className="font-mono font-medium">
                              {signal.ticker}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold",
                                signal.direction === "BUY" &&
                                  "bg-emerald-500/20 text-emerald-500",
                                signal.direction === "SELL" &&
                                  "bg-rose-500/20 text-rose-500",
                                signal.direction === "NEUTRAL" &&
                                  "bg-muted text-muted-foreground"
                              )}
                            >
                              {signal.direction === "BUY" && (
                                <CaretUp size={10} weight="bold" />
                              )}
                              {signal.direction === "SELL" && (
                                <CaretDown size={10} weight="bold" />
                              )}
                              {signal.direction}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted">
                                <div
                                  className={cn(
                                    "h-full rounded-full",
                                    signal.confidence >= 0.8
                                      ? "bg-emerald-500"
                                      : signal.confidence >= 0.6
                                        ? "bg-blue-500"
                                        : "bg-amber-500"
                                  )}
                                  style={{
                                    width: `${signal.confidence * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="w-10 font-mono text-[10px]">
                                {(signal.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right font-mono">
                            ${signal.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                            ${signal.target.toFixed(2)}
                          </td>
                          <td
                            className={cn(
                              "px-3 py-2 text-right font-mono",
                              upside >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}
                          >
                            {upside >= 0 ? "+" : ""}
                            {upside.toFixed(1)}%
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              {signal.shapTop3.map((feature, i) => (
                                <span
                                  key={feature}
                                  className={cn(
                                    "rounded px-1.5 py-0.5 text-[9px]",
                                    i === 0
                                      ? "bg-purple-500/20 text-purple-500"
                                      : i === 1
                                        ? "bg-blue-500/20 text-blue-500"
                                        : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right text-muted-foreground">
                            {signal.signalDate}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t px-3 py-1 text-[10px] text-muted-foreground">
                <span>
                  Showing {filteredSignals.length} of {mockSignals.length}{" "}
                  signals
                </span>
                <span>Last refresh: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </>
        )}

        {/* ================================================================ */}
        {/* EXPLAINABILITY TAB */}
        {/* ================================================================ */}
        {activeTab === "explainability" && (
          <>
            {/* Left: View Selector & Ticker SHAP */}
            <div className="flex w-80 flex-col gap-1">
              {/* View Selector */}
              <GridPanel title="Analysis View" className="shrink-0">
                <div className="flex gap-1">
                  {[
                    {
                      id: "importance",
                      label: "Feature Importance",
                      icon: ChartBar,
                    },
                    { id: "correlation", label: "Correlation", icon: Table },
                    { id: "ic", label: "Rolling IC", icon: ChartLine },
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() =>
                        setExplainView(view.id as typeof explainView)
                      }
                      className={cn(
                        "flex flex-1 flex-col items-center gap-1 rounded-none border px-2 py-2",
                        explainView === view.id
                          ? "border-blue-500 bg-blue-500/10 text-blue-500"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <view.icon size={16} />
                      <span className="text-[9px]">{view.label}</span>
                    </button>
                  ))}
                </div>
              </GridPanel>

              {/* Per-Ticker SHAP Waterfall */}
              <GridPanel
                title="Ticker Explanation"
                className="flex-1"
                actions={
                  <select
                    value={selectedTickerForShap}
                    onChange={(e) => setSelectedTickerForShap(e.target.value)}
                    className="h-5 rounded-none border bg-transparent px-1 text-[10px]"
                  >
                    {mockSignals.map((s) => (
                      <option key={s.ticker} value={s.ticker}>
                        {s.ticker}
                      </option>
                    ))}
                  </select>
                }
              >
                <div className="space-y-2">
                  <div className="rounded border border-purple-500/30 bg-purple-500/5 p-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Prediction</span>
                      <span
                        className={cn(
                          "font-semibold",
                          mockSignals.find(
                            (s) => s.ticker === selectedTickerForShap
                          )?.direction === "BUY"
                            ? "text-emerald-500"
                            : "text-rose-500"
                        )}
                      >
                        {
                          mockSignals.find(
                            (s) => s.ticker === selectedTickerForShap
                          )?.direction
                        }
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono">
                        {(
                          (mockSignals.find(
                            (s) => s.ticker === selectedTickerForShap
                          )?.confidence || 0) * 100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-medium text-muted-foreground">
                    SHAP WATERFALL
                  </div>

                  <div className="space-y-1.5">
                    {mockTickerShap.map((item) => {
                      const barWidth = Math.abs(item.impact) * 400
                      return (
                        <div
                          key={item.feature}
                          className="flex items-center gap-2"
                        >
                          <span className="w-20 truncate text-[10px] text-muted-foreground">
                            {item.feature}
                          </span>
                          <div className="flex flex-1 items-center">
                            <div className="relative h-4 flex-1">
                              {/* Center line */}
                              <div className="absolute top-0 left-1/2 h-full w-px bg-border" />
                              {/* Bar */}
                              <div
                                className={cn(
                                  "absolute top-1/2 h-3 -translate-y-1/2 rounded-sm",
                                  item.direction === "positive"
                                    ? "bg-emerald-500"
                                    : "bg-rose-500",
                                  item.direction === "positive"
                                    ? "left-1/2"
                                    : "right-1/2"
                                )}
                                style={{
                                  width: `${barWidth}%`,
                                  maxWidth: "50%",
                                }}
                              />
                            </div>
                          </div>
                          <span
                            className={cn(
                              "w-12 text-right font-mono text-[10px]",
                              item.direction === "positive"
                                ? "text-emerald-500"
                                : "text-rose-500"
                            )}
                          >
                            {item.direction === "positive" ? "+" : ""}
                            {item.impact.toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-3 border-t pt-2 text-[9px] text-muted-foreground">
                    <Sparkle
                      size={10}
                      className="mr-1 inline text-purple-500"
                    />
                    SHAP values show feature contribution to prediction
                  </div>
                </div>
              </GridPanel>
            </div>

            {/* Right: Main Visualization */}
            <GridPanel
              title={
                explainView === "importance"
                  ? "Global Feature Importance"
                  : explainView === "correlation"
                    ? "Feature Correlation Matrix"
                    : "Rolling Information Coefficient"
              }
              className="flex-1"
              actions={
                <Button variant="ghost" size="xs" className="gap-1">
                  <Export size={12} />
                  Export
                </Button>
              }
            >
              {/* Feature Importance Bar Chart */}
              {explainView === "importance" && (
                <div className="space-y-2">
                  <div className="mb-4 rounded border border-blue-500/30 bg-blue-500/5 p-2 text-[10px] text-muted-foreground">
                    <Info size={12} className="mr-1 inline text-blue-500" />
                    Global SHAP importance averaged across all predictions in
                    the training set
                  </div>
                  {mockFeatureImportance.map((item, index) => {
                    const maxImportance = mockFeatureImportance[0].importance
                    const barWidth = (item.importance / maxImportance) * 100
                    return (
                      <div
                        key={item.feature}
                        className="flex items-center gap-3"
                      >
                        <span className="w-4 text-right font-mono text-[10px] text-muted-foreground">
                          {index + 1}
                        </span>
                        <span className="w-24 truncate text-xs">
                          {item.feature}
                        </span>
                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-5 flex-1 rounded-sm bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-sm",
                                item.category === "Momentum" && "bg-purple-500",
                                item.category === "Technical" && "bg-blue-500",
                                item.category === "Fundamental" &&
                                  "bg-emerald-500",
                                item.category === "Macro" && "bg-amber-500",
                                item.category === "Price/Volume" &&
                                  "bg-cyan-500",
                                item.category === "Sentiment" && "bg-rose-500"
                              )}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="w-12 font-mono text-[10px] text-muted-foreground">
                            {(item.importance * 100).toFixed(1)}%
                          </span>
                        </div>
                        <span
                          className={cn(
                            "w-20 rounded px-1.5 py-0.5 text-center text-[9px]",
                            item.category === "Momentum" &&
                              "bg-purple-500/20 text-purple-500",
                            item.category === "Technical" &&
                              "bg-blue-500/20 text-blue-500",
                            item.category === "Fundamental" &&
                              "bg-emerald-500/20 text-emerald-500",
                            item.category === "Macro" &&
                              "bg-amber-500/20 text-amber-500",
                            item.category === "Price/Volume" &&
                              "bg-cyan-500/20 text-cyan-500",
                            item.category === "Sentiment" &&
                              "bg-rose-500/20 text-rose-500"
                          )}
                        >
                          {item.category}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Correlation Matrix Heatmap */}
              {explainView === "correlation" && (
                <div className="space-y-4">
                  <div className="mb-4 rounded border border-blue-500/30 bg-blue-500/5 p-2 text-[10px] text-muted-foreground">
                    <Info size={12} className="mr-1 inline text-blue-500" />
                    Pearson correlation between features. High correlation may
                    indicate redundancy.
                  </div>

                  {/* Matrix */}
                  <div className="overflow-auto">
                    <div className="inline-block">
                      {/* Header row */}
                      <div className="flex">
                        <div className="h-8 w-20" />
                        {correlationFeatures.map((f) => (
                          <div
                            key={f}
                            className="flex h-8 w-14 items-center justify-center text-[9px] text-muted-foreground"
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg)",
                            }}
                          >
                            {f}
                          </div>
                        ))}
                      </div>

                      {/* Data rows */}
                      {correlationFeatures.map((rowFeature, rowIndex) => (
                        <div key={rowFeature} className="flex">
                          <div className="flex h-10 w-20 items-center text-[10px] text-muted-foreground">
                            {rowFeature}
                          </div>
                          {mockCorrelationMatrix[rowIndex].map(
                            (value, colIndex) => {
                              const absValue = Math.abs(value)
                              const isPositive = value >= 0
                              const isDiagonal = rowIndex === colIndex
                              return (
                                <div
                                  key={colIndex}
                                  className={cn(
                                    "flex h-10 w-14 items-center justify-center border font-mono text-[10px]",
                                    isDiagonal && "bg-muted",
                                    !isDiagonal &&
                                      isPositive &&
                                      absValue > 0.5 &&
                                      "bg-emerald-500/30 text-emerald-500",
                                    !isDiagonal &&
                                      isPositive &&
                                      absValue > 0.3 &&
                                      absValue <= 0.5 &&
                                      "bg-emerald-500/15 text-emerald-500",
                                    !isDiagonal &&
                                      !isPositive &&
                                      absValue > 0.3 &&
                                      "bg-rose-500/20 text-rose-500",
                                    !isDiagonal &&
                                      absValue <= 0.3 &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  {value.toFixed(2)}
                                </div>
                              )
                            }
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-4 pt-4 text-[10px]">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-rose-500/30" />
                      <span className="text-muted-foreground">Negative</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-muted" />
                      <span className="text-muted-foreground">Weak</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-emerald-500/30" />
                      <span className="text-muted-foreground">Positive</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rolling IC Chart */}
              {explainView === "ic" && (
                <div className="space-y-4">
                  <div className="mb-4 rounded border border-blue-500/30 bg-blue-500/5 p-2 text-[10px] text-muted-foreground">
                    <Info size={12} className="mr-1 inline text-blue-500" />
                    Information Coefficient measures predictive power of each
                    feature over time. Higher IC = more predictive. Watch for IC
                    decay.
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 text-[10px]">
                    {[
                      {
                        key: "mom_3m",
                        color: "bg-purple-500",
                        label: "mom_3m",
                      },
                      { key: "rsi", color: "bg-blue-500", label: "rsi" },
                      {
                        key: "eps_surprise",
                        color: "bg-emerald-500",
                        label: "eps_surprise",
                      },
                      { key: "vix", color: "bg-amber-500", label: "vix" },
                      {
                        key: "vol_zscore",
                        color: "bg-cyan-500",
                        label: "vol_zscore",
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center gap-1">
                        <div
                          className={cn("h-2 w-2 rounded-full", item.color)}
                        />
                        <span className="text-muted-foreground">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Simple line chart representation */}
                  <div className="relative h-64 w-full border-b border-l">
                    {/* Y-axis labels */}
                    <div className="absolute top-0 -left-8 flex h-full flex-col justify-between text-[9px] text-muted-foreground">
                      <span>0.15</span>
                      <span>0.10</span>
                      <span>0.05</span>
                      <span>0.00</span>
                    </div>

                    {/* Grid lines */}
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="absolute left-0 w-full border-t border-dashed border-border/50"
                        style={{ top: `${i * 33.33}%` }}
                      />
                    ))}

                    {/* Data points and lines (simplified visualization) */}
                    <svg className="absolute inset-0 h-full w-full overflow-visible">
                      {/* mom_3m line */}
                      <polyline
                        fill="none"
                        stroke="rgb(168, 85, 247)"
                        strokeWidth="2"
                        points={mockRollingIC
                          .map(
                            (d, i) =>
                              `${(i / (mockRollingIC.length - 1)) * 100}%,${100 - (d.mom_3m / 0.15) * 100}%`
                          )
                          .join(" ")}
                      />
                      {/* rsi line */}
                      <polyline
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2"
                        points={mockRollingIC
                          .map(
                            (d, i) =>
                              `${(i / (mockRollingIC.length - 1)) * 100}%,${100 - (d.rsi / 0.15) * 100}%`
                          )
                          .join(" ")}
                      />
                      {/* eps_surprise line */}
                      <polyline
                        fill="none"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth="2"
                        points={mockRollingIC
                          .map(
                            (d, i) =>
                              `${(i / (mockRollingIC.length - 1)) * 100}%,${100 - (d.eps_surprise / 0.15) * 100}%`
                          )
                          .join(" ")}
                      />
                      {/* vix line */}
                      <polyline
                        fill="none"
                        stroke="rgb(245, 158, 11)"
                        strokeWidth="2"
                        points={mockRollingIC
                          .map(
                            (d, i) =>
                              `${(i / (mockRollingIC.length - 1)) * 100}%,${100 - (d.vix / 0.15) * 100}%`
                          )
                          .join(" ")}
                      />
                    </svg>

                    {/* X-axis labels */}
                    <div className="absolute -bottom-5 left-0 flex w-full justify-between text-[9px] text-muted-foreground">
                      {mockRollingIC
                        .filter((_, i) => i % 2 === 0)
                        .map((d) => (
                          <span key={d.date}>{d.date}</span>
                        ))}
                    </div>
                  </div>

                  {/* Summary stats */}
                  <div className="mt-8 grid grid-cols-5 gap-2 pt-4">
                    {[
                      {
                        feature: "mom_3m",
                        avgIC: 0.109,
                        trend: "stable",
                        color: "purple",
                      },
                      {
                        feature: "rsi",
                        avgIC: 0.088,
                        trend: "improving",
                        color: "blue",
                      },
                      {
                        feature: "eps_surprise",
                        avgIC: 0.112,
                        trend: "stable",
                        color: "emerald",
                      },
                      {
                        feature: "vix",
                        avgIC: 0.063,
                        trend: "decaying",
                        color: "amber",
                      },
                      {
                        feature: "vol_zscore",
                        avgIC: 0.088,
                        trend: "stable",
                        color: "cyan",
                      },
                    ].map((item) => (
                      <div
                        key={item.feature}
                        className="rounded border p-2 text-center"
                      >
                        <div
                          className={cn(
                            "font-mono text-sm font-semibold",
                            `text-${item.color}-500`
                          )}
                        >
                          {item.avgIC.toFixed(3)}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {item.feature}
                        </div>
                        <div
                          className={cn(
                            "mt-1 text-[9px]",
                            item.trend === "improving" && "text-emerald-500",
                            item.trend === "decaying" && "text-rose-500",
                            item.trend === "stable" && "text-muted-foreground"
                          )}
                        >
                          {item.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GridPanel>
          </>
        )}
      </div>
    </div>
  )
}
