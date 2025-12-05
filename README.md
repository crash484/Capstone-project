# AttendanceAI

AI-powered student attendance analytics and predictions dashboard built with Next.js and Python machine learning models.

## Overview

AttendanceAI is a comprehensive web application designed to help educational institutions track, analyze, and predict student attendance patterns. The system combines a modern React frontend with powerful Python machine learning models to provide actionable insights for administrators and educators.

## Features

### Dashboard Analytics
- **Real-time Metrics Cards** - Display key attendance statistics including:
  - Average attendance rates
  - Total active students
  - At-risk student counts
  - AI prediction accuracy

- **Interactive Attendance Charts** - Visualize attendance trends with:
  - Area charts for trend visualization
  - Bar charts for comparison views
  - Actual vs AI-predicted attendance overlays

### AI-Powered Predictions
- **7-Day Attendance Forecasting** - Machine learning models predict daily attendance rates with confidence scores
- **Holiday Pattern Analysis** - Automatically detects patterns in student absences including:
  - Weekend effects (absence spikes before extended weekends)
  - Seasonal holiday correlations
  - Midweek attendance dips

- **Predictive Alerts** - Risk-based alerts for upcoming attendance concerns:
  - High-risk periods (e.g., holiday weeks)
  - Medium-risk patterns (e.g., Friday sessions)
  - Monitoring status for stable periods

### Student Risk Classification
- Individual student risk level predictions
- Probability scores for risk categories
- Features analyzed include:
  - 30-day attendance rates
  - Absence streaks
  - Sudden attendance drops
  - Weekly patterns (e.g., Friday absences)

### Data Management
- **CSV/Excel Upload** - Import attendance data via drag-and-drop or file browser
- **Export Reports** - Generate attendance reports for stakeholders
- **Required Data Format**:
  - Columns: Date, Student ID, Present (Yes/No)
  - Supported formats: CSV, XLSX
  - Max file size: 10 MB

## Technology Stack

### Frontend
- **Next.js 16** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI component primitives
- **Recharts** - React charting library
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Groq SDK** - LLM integration for chat functionality

### Machine Learning (Python)
- **Pandas** - Data manipulation and analysis
- **scikit-learn** - Machine learning models
- **Joblib** - Model serialization

#### ML Models
1. **Daily Attendance Forecaster** - Predicts next-day attendance using rolling averages and temporal features
2. **Student Risk Classifier** - Classifies students into risk categories based on attendance patterns
3. **Pattern Analyzer** - Detects recurring absence patterns in historical data

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/          # LLM chat API endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── ui/                # Base UI components (Button, Card, Badge)
│   ├── dashboard.tsx      # Main dashboard layout
│   ├── navigation.tsx     # Top navigation bar
│   ├── metrics-cards.tsx  # Key metrics display
│   ├── attendance-chart.tsx # Interactive charts
│   ├── ai-predictions.tsx # AI prediction cards
│   ├── data-upload.tsx    # File upload modal
│   └── llmChat.tsx        # Chat interface
├── lib/
│   ├── python_modules/
│   │   ├── src/
│   │   │   ├── forecasting/   # Attendance forecasting model
│   │   │   ├── risk/          # Student risk classification
│   │   │   ├── patterns/      # Pattern analysis
│   │   │   └── predict.py     # Main prediction script
│   │   ├── models/        # Trained ML models (.joblib)
│   │   ├── inputs/        # Input CSV files
│   │   ├── outputs/       # Prediction outputs (JSON)
│   │   └── training_data/ # Training datasets
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/crash484/Capstone-project.git
   cd Capstone-project
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies** (for ML models)
   ```bash
   pip install pandas scikit-learn joblib
   ```

4. **Set up environment variables**
   ```bash
   # Create .env.local file
   GROQ_API_KEY=your_groq_api_key  # For LLM chat functionality
   ```

### Running the Application

**Development mode**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production build**
```bash
npm run build
npm run start
```

### Running ML Predictions

Generate attendance predictions using the Python models:
```bash
cd lib/python_modules/src
python predict.py
```

This will:
- Generate 7-day attendance forecasts
- Classify student risk levels
- Analyze attendance patterns
- Output results to `lib/python_modules/outputs/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Data Input Format

### Daily Attendance Input (`input_daily.csv`)
```csv
date,attendance_pct,weekday,month,is_weekend
2024-01-01,92.5,0,1,0
```

### Student Risk Input (`input_student_risk.csv`)
```csv
student_id,overall_attendance_30d,max_absence_streak,num_sudden_drops,variance_30d,weekday_miss_friday
STU001,85.0,3,1,0.05,2
```

### Raw Attendance Input (`input_raw_attendance.csv`)
```csv
date,student_id,present
2024-01-01,STU001,1
```

## Output Format

### Forecast Output (`forecast_output.json`)
```json
[
  {
    "date": "2024-01-15",
    "predicted_attendance": 87.5,
    "confidence": 0.95
  }
]
```

### Risk Output (`risk_output.json`)
```json
[
  {
    "student_id": "STU001",
    "risk_level": "low",
    "probabilities": {"low": 0.8, "medium": 0.15, "high": 0.05}
  }
]
```

## License

This project was developed as a Capstone project.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.