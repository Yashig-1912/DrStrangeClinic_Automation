# 🤖 AI Appointment Automation System (n8n)

An intelligent multi-channel appointment scheduling system built with **n8n** for a physiotherapy clinic.

The backend automates patient management, calendar availability, booking logic, and confirmation workflows, while supporting both:

• Telegram chatbot interactions
• Web frontend bookings via webhook (Lovable UI)

All logic runs through a single AI-driven workflow.

---

## ⚙️ Core Backend Workflow (n8n)

The n8n automation handles:

* AI-based request interpretation
* Patient lookup and creation in Google Sheets
* Real-time slot validation using Google Calendar
* Conflict detection and alternate slot suggestions
* Appointment event creation
* Email confirmations via Gmail
* Multi-trigger routing (Telegram + Webhook)

The system is designed as a unified backend brain with multiple input/output channels.

---

## 🧩 Integrations

* n8n Automation Engine
* OpenAI AI Agent
* Google Calendar (availability & booking)
* Google Sheets (patient + appointment database)
* Gmail (confirmation emails)
* Telegram Bot API
* Lovable Frontend (web booking interface)

---

## ⏱️ Scheduling Logic

* Monday to Friday bookings only
* Working hours: 9 AM – 5 PM
* Lunch break exclusion (1 PM – 2 PM)
* 30-minute appointments
* 30-minute buffer between sessions
* No overlapping bookings
* Public holidays blocked via calendar

---

## 🎯 Design Approach

* Single intelligent workflow
* Multi-channel input handling
* AI-driven automation with strict calendar control
* Stateless webhook processing + conversational Telegram flow
* Backend-first architecture

---

## 🌐 Frontend

A lightweight booking interface built with **Lovable** connects to the n8n webhook for structured appointment requests.

(Frontend link included in project)

---

## 📌 Why This Project

This project demonstrates real-world workflow automation, backend system design, and AI-driven scheduling using n8n.

It focuses on:

• orchestration over UI
• system reliability
• automation logic
• real service integrations


