# EliteOps Lead Intelligence & Client Acquisition Platform

> **Enterprise AI-Powered B2B Lead Intelligence, Insurance Agency Scanner & Automated Client Acquisition System**  
> Tailored for **EliteOps Global** B2B service offerings across high-growth markets (**USA, Canada, United Kingdom, Australia, UAE**).

---

## 🌟 Platform Overview

The **EliteOps Lead Intelligence Platform** is an enterprise-grade client discovery and acquisition system designed to identify, audit, score, and convert high-intent B2B prospects. 

The platform combines real-time Google Maps location data, official web domain verification, Hunter.io & Apollo.io API enrichment, and OpenAI GPT-4o intelligence synthesis into a unified, high-density command center.

---

## Key Platform Hubs & Capabilities

### 1. 📊 Full-Screen Executive Command Center
- **Full Viewport Flexibility**: 1-click **Full Screen** mode toggle (`Maximize2`) and **Collapsible Navigation Sidebar** (`PanelLeft`) allowing edge-to-edge `100%` monitor layout expansion up to `1920px`.
- **Live Metrics Dashboard**: Real-time KPI counters tracking *Today's Discovered Leads*, *High-Intent Prospects (80+ Score)*, *Google Calendar Meetings*, and *Total Active Pipeline Value ($)*.
- **Global Market Matrix**: Activity distribution heatmaps across **USA, Canada, UK, Australia, and UAE**.

### 2. 🛡️ Insurance Agencies & Brokerages Directory
- **Targeted B2B Focus**: Specifically monitors independent commercial insurance agencies, local brokerages, and risk consulting firms (20–100 employees) requiring Web Dev, Local SEO, Virtual Assistants, and Back-Office support.
- **Google Maps & Domain Registry Integration**: Verified business listings per state featuring real Google Maps star ratings, review counts, direct phone hotlines, and registered web domains.
- **Table & Grid View Modes**: High-density table mode with direct domain links, corporate contact info, and agency principal badges, alongside interactive grid card views.

### 3. 🔍 Live API Scan Engine (`/api/scan`)
- **Real API Integration**: Powered by environment configuration keys in `.env`:
  - **Google Custom Search & Places API**: Queries live domain listings across target US states and Canadian provinces.
  - **Hunter.io API**: Fetches verified domain emails and executive contact records.
  - **Apollo.io API**: Enriches company firmographics, employee counts, and revenue figures.
  - **OpenAI GPT-4o**: Synthesizes multi-factor opportunity scores (0–100) and technical audit breakdowns.
- **Live Data Refresh**: 1-click **"Scan 100 NEW Google & Maps"** wipes old cached data (`setCompanies([])`) and populates fresh, genuine API-scanned listings.

### 4. 👤 Key Decision Makers & Non-404 LinkedIn Sync
- **Executive Contact Profiles**: Lists **Agency Principals**, **Agency Owners**, **CEOs**, **Founders**, and **Agency Marketing Managers**.
- **100% Deliverable Domain Emails**: Uses verified corporate domain mailboxes (`support@`, `info@`, `marketing@`) with 1-click **Copy Email** functionality to prevent Mailer-Daemon bounce errors.
- **Zero 404 LinkedIn Search Sync**: Automatically generates targeted LinkedIn Search URLs (`https://www.linkedin.com/search/results/people/?keywords=...`), ensuring 1-click **Search LinkedIn** buttons open valid account searches with 0% chance of 404 errors.

### 5. 📥 1-Click Microsoft Excel Export
- **XLSX Compatible CSV Exporter**: Generates UTF-8 BOM (`\uFEFF`) formatted files that open natively in Microsoft Excel.
- **Comprehensive Columns**: Exports Company Name, Domain, Support Email/Phone, CEO/Founder Name, Title, Direct Email, Phone, LinkedIn, Marketing Manager Name, Email, Phone, LinkedIn, Category, Revenue, Ratings, and About text.

### 6. 💻 Website Development Hub & Kanban CRM Pipeline
- **Audit & Bottleneck Detection**: Audits performance speeds, mobile responsiveness, SEO scores, and outdated CMS tech (e.g. legacy WordPress/PHP vs modern Next.js/React).
- **Interactive 9-Stage Kanban**: Drag-and-drop workflow tracking leads from `NEW` -> `RESEARCHING` -> `CONTACTED` -> `PROPOSAL_SENT` -> `WON`.
- **1-Click AI Pitch Writer**: Generates cold emails, follow-ups, LinkedIn connection hooks, and phone call scripts tailored to each prospect.

---

## 🛠️ Tech Stack Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Zustand State Management.
- **Backend Services**: Next.js API Routes (`/api/scan`, `/api/enrich`, `/api/places`, `/api/leads`).
- **External API Integrations**: Google Custom Search, Google Places, Hunter.io, Apollo.io, OpenAI GPT-4o.
- **Database & ORM**: PostgreSQL + Prisma ORM (`prisma/schema.prisma`).
- **Background Jobs**: BullMQ + Redis queue worker architecture.
- **Deployment & DevOps**: Multi-stage `Dockerfile`, `docker-compose.yml`, GitHub Actions CI/CD.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20.0+
- **PostgreSQL**: v16+
- **Redis**: v7+

### 2. Environment Configuration (`.env`)
```env
# Database & Supabase
DATABASE_URL="postgresql://postgres:postgres_password@localhost:5432/eliteops_leads?schema=public"

# AI & Enrichment API Keys
OPENAI_API_KEY="sk-proj-your-openai-key"
GOOGLE_SEARCH_API_KEY="AIzaSy-your-google-search-key"
GOOGLE_SEARCH_CX="a07df3fd16e414c98"
APOLLO_API_KEY="eD7sUcVsWCH-nWroWpCDpA"
HUNTER_API_KEY="fc755e4d15a867f22c06d3ea54110efd138b5964"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Launch Development Server
```bash
npm install
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📄 License & Attribution
Designed for **EliteOps Global** B2B Client Acquisition operations. All rights reserved.
