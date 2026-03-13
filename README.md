# AfyaAI

A lightweight health assistant that gives calm, clear guidance when you don't know what to do next.

AfyaAI is not a diagnostic tool. It helps you understand your symptoms, decide whether to seek care, and track your daily wellness — all through a conversational interface with a 3D avatar.

---

## The Problem

Most people don't have a reliable first point of contact when symptoms appear. They turn to generic search engines, get overwhelmed, and either panic or ignore something serious. AfyaAI sits in that gap — not replacing doctors, but helping you make a more informed first decision.

---

## Features

- **Symptom guidance** — describe how you feel and get clear, non-diagnostic suggestions on what to do next
- **Daily check-ins** — log sleep, hydration, mood, and activity each day
- **Stats panel** — track patterns in your wellness data over time
- **3D avatar** — a friendly, approachable character that makes the experience feel less clinical
- **Voice responses** — optional text-to-speech replies
- **Nearby clinic finder** — surfaces local clinics and hospitals when care is needed
- **Hotline support** — links to urgent care lines for serious concerns

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| 3D Avatar | Three.js |
| Backend | FastAPI (Python) |
| AI Model | Llama |

---

## Getting Started

### Prerequisites

- Node.js
- Python 3.10+
- Llama API access

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Design Principles

**Simple.** The interface is conversational and avatar-driven. No clinical jargon, no overwhelming menus.

**Responsible.** AfyaAI never diagnoses. Every response is framed as guidance and always points toward real professionals for serious concerns.

**Lightweight.** Built to perform on low bandwidth connections, because reliable internet is not guaranteed everywhere we intend this to be used.

---

## Team

| Name | Role | GitHub |
|---|---|---|
| Elvis Chege | Frontend | [@elviscgn](https://github.com/elviscgn) |
| Mphele Moswane | Backend | [@Mphele](https://github.com/Mphele) |

Built for the [Mjanga AI Challenge](https://mjangatech.org).

---

## Disclaimer

AfyaAI is not a medical device and does not provide medical diagnoses. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.
