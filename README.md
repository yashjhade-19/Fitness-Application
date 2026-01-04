# 🏋️ Fitness AI Microservices Platform

A full-stack, AI-powered fitness application built using **Microservices Architecture**, **Spring Boot**, **Kafka**, **Keycloak**, and a **React (Vite + MUI)** frontend.

This project tracks user fitness activities and generates **AI-based personalized recommendations** asynchronously using Apache Kafka and Google Gemini API.

---

## 🚀 Tech Stack

### Backend (Microservices)
- Java 17
- Spring Boot
- Spring Cloud (Eureka, Gateway)
- Spring Security (OAuth2 Resource Server)
- Apache Kafka
- PostgreSQL (User Service)
- MongoDB (Activity & AI Data)
- Keycloak (Authentication & Authorization)

### Frontend
- React (Vite)
- Material UI (MUI)
- Redux Toolkit
- OAuth2 PKCE Authentication

### DevOps / Tools
- Docker
- Docker Desktop
- Maven
- npm

---

## 🧩 Microservices Overview

| Service | Description |
|------|------------|
| **Eureka Server** | Service discovery |
| **API Gateway** | Central routing & security |
| **User Service** | User management (PostgreSQL) |
| **Activity Service** | Fitness activity tracking |
| **AI Service** | AI recommendation engine |
| **Kafka Broker** | Async communication |

---

## 🔐 Authentication Flow

- Keycloak used as **Identity Provider**
- OAuth2 + PKCE flow
- API Gateway acts as **Resource Server**
- User auto-synced from Keycloak to database

---

## ⚙️ Architecture Flow

1. User logs in via Keycloak
2. Frontend receives access token
3. API Gateway validates token (JWKS)
4. Activity data sent to Activity Service
5. Activity published to Kafka topic
6. AI Service consumes message
7. Gemini API generates recommendations
8. Results stored and displayed in UI

---

## 🖥 Frontend Features

- Dashboard-style UI
- Activity list & details view
- AI recommendations in readable format
- Loading states & empty states
- Responsive design
