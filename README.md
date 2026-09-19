<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=32&duration=3000&pause=1000&color=FF6B5B&center=true&vCenter=true&width=650&lines=CustomerIQ;Customer+Intelligence+Platform;Unsupervised+ML+%2B+FastAPI+%2B+React" alt="Typing SVG" />

**Unsupervised Machine Learning Platform for Customer Segmentation, Behavioral Analytics & Anomaly Detection**

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.141-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.9-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br/>

CustomerIQ ingests raw e-commerce transaction data and automatically discovers customer segments, flags unusual purchasing behavior, and turns unsupervised ML output into business-ready recommendations — a complete pipeline from a Jupyter notebook to a live API and dashboard.

<br/>

`Don't just say "Customer belongs to Cluster 2" — say "High-Value Loyal Customer, recommend a VIP retention campaign."`

</div>

---

## Table of Contents

- [Why This Project](#why-this-project)
- [Dashboard Preview](#dashboard-preview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Dataset](#dataset)
- [ML Pipeline](#ml-pipeline)
- [Choosing K Empirically](#choosing-k-empirically)
- [PCA Visualization](#pca-visualization)
- [Model Evaluation](#model-evaluation)
- [Discovered Segments](#discovered-segments)
- [Anomaly Detection](#anomaly-detection)
- [Customer Similarity](#customer-similarity)
- [API Reference](#api-reference)
- [Backend Design](#backend-design)
- [Frontend Design](#frontend-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Why This Project

Most portfolio clustering projects stop at `KMeans(n_clusters=4)` and a static scatter plot. CustomerIQ was built to go further at every layer:

| Layer | What a typical project does | What CustomerIQ does |
|---|---|---|
| Clustering | Guesses `n_clusters` | Selects K empirically via Elbow Method + Silhouette Analysis across K=2..7 |
| Output | Prints a cluster number | Maps clusters to named business personas with recommended actions |
| Evaluation | Skips it entirely | Reports Silhouette, Davies–Bouldin, and Calinski–Harabasz scores |
| Anomalies | Not attempted | Isolation Forest flags behavioral outliers with severity scoring |
| Delivery | A single notebook | A serialized, versioned model pipeline behind a real FastAPI service |
| Interface | None | A live React dashboard with charts, segment explorer, and a prediction form |

---

## Dashboard Preview

<table>
<tr>
<td width="50%">

**Overview** — live per-segment stats, distribution donut, and spend comparison

<img src="docs/ui1.jpeg" width="100%"/>

</td>
<td width="50%">

**Segments** — every cluster as a named persona with recommended action

<img src="docs/ui2.jpeg" width="100%"/>

</td>
</tr>
<tr>
<td width="50%">

**Behavioral Anomalies** — flagged customers ranked by severity

<img src="docs/ui3.jpeg" width="100%"/>

</td>
<td width="50%">

**Analyze a Customer** — live prediction against the trained model

<img src="docs/ui4.jpeg" width="100%"/>

</td>
</tr>
</table>

<div align="center">
<img src="docs/ui6.jpeg" width="90%"/>
<p><em>Segment distribution and average-spend comparison, rendered live from the FastAPI response</em></p>
</div>

---

## Architecture

```
 ┌─────────────────────────────────────────────────────────┐
 │                    React Dashboard                       │
 │      Vite · React Router · Axios · Recharts               │
 └───────────────────────────┬─────────────────────────────┘
                              │  REST (JSON)
 ┌───────────────────────────▼─────────────────────────────┐
 │                     FastAPI Backend                      │
 │  routers/  health · analyze · customers · segments ·      │
 │             anomalies                                     │
 └──────┬──────────┬──────────┬──────────┬──────────────────┘
        │          │          │          │
        ▼          ▼          ▼          ▼
   K-Means     Isolation    KNN        Scaler +
   (k=4)       Forest      Similarity   Metadata
        │          │          │          │
        └──────────┴────┬─────┴──────────┘
                         ▼
             customer_behavior.csv
             (RFM + cluster + anomaly flags)
                         ▲
                         │
             ┌───────────┴───────────┐
             │      ML Pipeline       │
             │      (Jupyter)         │
             └───────────┬───────────┘
                         ▲
                         │
          Online Retail II — raw transactions (UCI)
```

Every model is trained once inside the notebook, serialized with `joblib`, and loaded exactly once at API startup (`model_loader.py`) — no retraining ever happens on a request.

---

## Tech Stack

<table>
<tr><td><strong>Data Processing</strong></td><td>pandas · numpy</td></tr>
<tr><td><strong>Machine Learning</strong></td><td>scikit-learn — K-Means · Isolation Forest · K-Nearest Neighbors · PCA · StandardScaler</td></tr>
<tr><td><strong>Model Evaluation</strong></td><td>Silhouette Score · Davies–Bouldin Index · Calinski–Harabasz Score</td></tr>
<tr><td><strong>Backend</strong></td><td>FastAPI · Pydantic · Uvicorn · CORS Middleware</td></tr>
<tr><td><strong>Model Persistence</strong></td><td>joblib (.pkl) · JSON metadata</td></tr>
<tr><td><strong>Frontend</strong></td><td>React (Vite) · React Router · Axios · Recharts</td></tr>
<tr><td><strong>EDA Visualization</strong></td><td>matplotlib · seaborn</td></tr>
</table>

---

## Dataset

**[Online Retail II](https://archive.ics.uci.edu/dataset/502/online+retail+ii)** (UCI Machine Learning Repository) — real invoice-level transactions from a UK-based online retailer, December 2009 – December 2011.

| Stage | Rows | Unique Customers |
|---|---:|---:|
| Raw | 1,067,371 | — |
| After cleaning | 805,549 | 5,878 |

Cleaning removed: rows with a missing `Customer ID`, cancelled invoices (prefixed `C`), and rows with non-positive `Quantity` or `Price`.

---

## ML Pipeline

```
Raw Transactions (1,067,371 rows)
        │
        ▼
Data Cleaning ──────────────► drop missing IDs · cancellations · invalid values
        │
        ▼
RFM Feature Engineering ────► Recency, Frequency, Monetary per customer
        │
        ▼
Log Transform + Scaling ────► np.log1p() then StandardScaler
        │
        ▼
Model Selection ─────────────► Elbow Method + Silhouette Analysis, K = 2..7
        │
        ▼
K-Means Clustering ──────────► K = 4 (empirically chosen)
        │
        ▼
Cluster Profiling ───────────► business-named segments + recommended actions
        │
        ▼
PCA Visualization ───────────► 3 features → 2D, 94.1% variance retained
        │
        ▼
Isolation Forest ────────────► flags behavioral anomalies (contamination = 0.05)
        │
        ▼
KNN Similarity Index ────────► find comparable customers (Euclidean)
        │
        ▼
Model Serialization ─────────► joblib .pkl + metadata.json
        │
        ▼
FastAPI Backend ─────────────► live inference, zero retraining per request
```

---

## Choosing K Empirically

<table>
<tr>
<td width="45%">

K was not guessed. The Elbow Method and Silhouette Score were computed across a range of candidates before selecting K = 4.

| K | Silhouette Score |
|---|---|
| 2 | 0.4381 |
| 3 | 0.3478 |
| **4** | **0.3653 ← selected** |
| 5 | 0.3421 |
| 6 | 0.3336 |
| 7 | 0.3052 |

K=2 scores numerically highest but yields only two generic groups. K=4 sits at the elbow of the inertia curve and produces four business-distinguishable personas — the right trade-off between statistical quality and business usefulness.

</td>
<td width="55%">
<img src="docs/elbow&silhoute_method.png" width="100%"/>
</td>
</tr>
</table>

---

## PCA Visualization

The 3 scaled RFM features were reduced to 2 dimensions for visualization, retaining **94.1%** of the original variance (PC1: 76.4%, PC2: 18.8%). The four clusters separate cleanly even after compression:

<div align="center">
<img src="docs/pca Visulation.png" width="70%"/>
</div>

---

## Model Evaluation

Unsupervised learning has no ground-truth label to check accuracy against, so quality is measured through cluster-separation metrics instead.

| Metric | Score | What it means |
|---|---|---|
| **Silhouette Score** | 0.3653 | Moderate, well-separated clusters — real customer behavior rarely clusters perfectly |
| **Davies–Bouldin Index** | 0.9303 | Below 1.0 — clusters are compact and reasonably distinct (lower is better) |
| **Calinski–Harabasz Score** | 5,061.72 | High between-cluster variance relative to within-cluster variance (higher is better) |

```json
{
  "model_version": "v1",
  "n_clusters": 4,
  "features_used": ["Recency_log", "Frequency_log", "Monetary_log"],
  "silhouette_score": 0.3653,
  "davies_bouldin_index": 0.9303,
  "calinski_harabasz_score": 5061.7168
}
```

---

## Discovered Segments

| Segment | % of Base | Customers | Avg. Recency | Avg. Frequency | Avg. Monetary | Recommended Action |
|---|---:|---:|---:|---:|---:|---|
| 🟠 **High-Value Loyal Customers** | 20.2% | 1,188 | 27.4 days | 19.3 orders | $11,014.37 | VIP retention campaign |
| 🟣 **Lost / Churned Customers** | 33.6% | 1,974 | 395.9 days | 1.4 orders | $325.75 | Win-back email campaign |
| 🟡 **At-Risk Customers** | 24.9% | 1,465 | 227.9 days | 5.1 orders | $2,002.10 | Urgent re-engagement offers |
| 🟢 **New / Regular Customers** | 21.3% | 1,251 | 28.4 days | 3.0 orders | $865.11 | Loyalty incentives, cross-sell |

Every prediction from `/api/customer/analyze` returns this persona and action directly — never a raw integer.

---

## Anomaly Detection

Isolation Forest flagged **294 customers (~5%)** whose purchasing behavior deviates sharply from the base — high-frequency, high-spend accounts that behave more like wholesale buyers than typical retail customers.

| | Recency | Frequency | Monetary |
|---|---:|---:|---:|
| Normal customers | 207.1 days | 4.9 orders | $1,776.57 |
| **Flagged anomalies** | **91.8 days** | **33.3 orders** | **$26,609.14** |

<div align="center">
<img src="docs/anomlies_detector_pca_view.png" width="70%"/>
<p><em>Anomalies (red) sit visibly on the outer edge of the customer population in PCA space — confirming genuine outliers, not noise.</em></p>
</div>

---

## Customer Similarity

A KNN index (Euclidean distance, fit on scaled RFM features) powers `/api/customer/similar` — given any customer ID, it returns the N closest customers by actual spending level and behavior, not just correlation. Euclidean was chosen over cosine similarity specifically because it respects magnitude: two customers with very different total spend are never called "similar" just because their *ratios* match.

---

## API Reference

Interactive docs are auto-generated by FastAPI at `/docs` (Swagger UI) and `/redoc`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/model/health` | Confirms all four models loaded successfully |
| `GET` | `/api/model/metrics` | Returns Silhouette, Davies–Bouldin, Calinski–Harabasz scores |
| `POST` | `/api/customer/analyze` | Predicts segment + anomaly status for a given RFM profile |
| `POST` | `/api/customer/similar` | Returns the N most similar customers via KNN |
| `GET` | `/api/customers` | Paginated list of all customers |
| `GET` | `/api/customers/{id}` | Single customer detail |
| `GET` | `/api/segments` | Summary of all 4 segments with stats |
| `GET` | `/api/segments/{id}` | Single segment detail + sample customers |
| `GET` | `/api/anomalies` | All flagged anomaly customers, sorted by severity |
| `GET` | `/api/anomalies/{id}` | Single anomaly customer detail |

<details>
<summary><strong>Example — POST /api/customer/analyze</strong></summary>

```json
// Request
{
  "recency": 10,
  "frequency": 20,
  "monetary": 5000
}

// Response
{
  "segment": "High-Value Loyal Customers",
  "cluster_id": 0,
  "anomaly": false,
  "anomaly_score": 0.0842,
  "recommended_action": "VIP retention campaign"
}
```
</details>

<details>
<summary><strong>Example — POST /api/customer/similar</strong></summary>

```json
// Request
{ "customer_id": 12346, "top_n": 3 }

// Response
{
  "customer_id": 12346,
  "similar_customers": [
    { "customer_id": 16754, "recency": 372, "frequency": 29, "monetary": 67502.47, "distance": 0.41 },
    { "customer_id": 13802, "recency": 139, "frequency": 19, "monetary": 26259.11, "distance": 0.58 },
    { "customer_id": 18251, "recency": 87,  "frequency": 9,  "monetary": 26278.86, "distance": 0.63 }
  ]
}
```
</details>

---

## Backend Design

The API is organized as one FastAPI router per concern, all wired into `main.py`, with models loaded once at import time in `model_loader.py`:

```python
# model_loader.py — loaded once at startup, never per-request
def load_models():
    clustering_model = joblib.load(f"{MODELS_DIR}/clustering_model_v1.pkl")
    scaler = joblib.load(f"{MODELS_DIR}/scaler_v1.pkl")
    anomaly_model = joblib.load(f"{MODELS_DIR}/anomaly_model_v1.pkl")
    knn_model = joblib.load(f"{MODELS_DIR}/knn_model_v1.pkl")
    with open(f"{MODELS_DIR}/metadata.json") as f:
        metadata = json.load(f)
    customer_data = pd.read_csv(DATA_PATH)
    return {"clustering_model": clustering_model, "scaler": scaler,
            "anomaly_model": anomaly_model, "knn_model": knn_model,
            "metadata": metadata, "customer_data": customer_data}

models = load_models()
```

Preprocessing logic (log transform + scaling) is factored into a single reusable function so it's never duplicated between endpoints:

```python
# utils/preprocessing.py
def preprocess_customer_data(recency, frequency, monetary, scaler):
    features = np.array([[np.log1p(recency), np.log1p(frequency), np.log1p(monetary)]])
    return scaler.transform(features)
```

Every request/response shape is validated through Pydantic schemas (`schemas.py`), and CORS is centrally configured in `config.py` so the React dev server can call the API during development.

---

## Frontend Design

The dashboard is a Vite + React app with:

- **`services/api.js`** — a single Axios client wrapping every backend endpoint
- **`components/`** — reusable `StatCard`, `SegmentCard`, `AnomalyTable`, `Navbar`
- **`pages/`** — `Dashboard`, `Segments`, `Anomalies`, `CustomerAnalyze`, wired together with React Router
- A dark, glassmorphic design system (CSS custom properties in `index.css`) with a coral-to-amber gradient accent, `Space Grotesk` display type, and Recharts-powered pie/bar visualizations that pull live from the FastAPI response — no hardcoded chart data anywhere in the UI.

---

## Project Structure

```
CustomerIQ-Segmentation-Platform/
├── data/raw/                       # online_retail_II.xlsx
├── notebooks/
│   └── Coutomer_segmentation_behavior.ipynb   # full ML pipeline
├── models/
│   ├── clustering_model_v1.pkl
│   ├── scaler_v1.pkl
│   ├── anomaly_model_v1.pkl
│   ├── knn_model_v1.pkl
│   └── metadata.json
├── customer_behavior.csv           # processed RFM + cluster + anomaly data
├── backend/
│   ├── main.py
│   ├── config.py
│   ├── schemas.py
│   ├── model_loader.py
│   ├── routers/
│   │   ├── health.py
│   │   ├── analyze.py
│   │   ├── customers.py
│   │   ├── segments.py
│   │   └── anomalies.py
│   └── utils/
│       └── preprocessing.py
├── frontend/
│   └── src/
│       ├── pages/         Dashboard · Segments · Anomalies · CustomerAnalyze
│       ├── components/    Navbar · StatCard · SegmentCard · AnomalyTable
│       └── services/api.js
└── docs/                  # screenshots and evaluation charts
```

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1        # Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload
```
API → `http://127.0.0.1:8000` · Docs → `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```
Dashboard → `http://localhost:5173`

---

## Roadmap

- [ ] PostgreSQL persistence layer (replacing the static CSV)
- [ ] Docker Compose for one-command setup
- [ ] Cloud deployment (Render/Railway backend, Vercel frontend)
- [ ] Authentication for multi-user access
- [ ] Dynamic, per-customer anomaly explanations (not just a global reason string)

---

<div align="center">

## Author

**Muzammil Ahmed**
Computer Science — AI Specialization, NED University of Engineering & Technology, Karachi

[![GitHub](https://img.shields.io/badge/GitHub-muzammilahmed321-181717?style=for-the-badge&logo=github)](https://github.com/muzammilahmed321)

</div>
