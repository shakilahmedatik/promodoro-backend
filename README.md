
# Promodoro | Focus Tracker - Backend

This repository contains the backend implementation for the Time Management and Focus Tracker feature, handling API services, data storage, and gamification logic. It also supports two leaderboard features for ranking users based on focus time.

## Tech Stack

	•	Framework: Express.js
	•	Database: PostgreSQL
	•	Caching: Redis
	•	Authentication: JWT
	•	Containerization: Docker
	•	Monitoring: Prometheus
	•	Logging: Winston


## Live Demo Urls

- ⚠️ Express server, Postgres database & Redis database is hosted on Render(free tier).
- ⚠️ On Render's free tier, a service will go to sleep after approximately 15 minutes of inactivity. Please keep that in mind while checking out the live demos down below:

- ‼️ Base API URL - https://promodoro-app-theta.vercel.app/api
- ‼️ Prometheus Metrics - https://promodoro-app-theta.vercel.app/metrics


![App Screenshot](https://i.ibb.co.com/xf7PDMc/render-services.png)
## API Reference

Api requests are secured by jwt token. Except Authentication api endpoints, all requests must carry jwt token named "token" as cookie in header of the request to work as expected.
### Focus Session Endpoints:
#### Log focus session with duration and user ID->

```http
  	POST /focus-session
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| duration, timestamp, userId | object | **Required** |

#### Fetch daily/weekly focus metrics, streak, badge for a user->

```http
  GET /focus-metrics
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |

#### Fetch focus logs for a user->

```http
  GET /focus-logs
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |


#### Retrieve the overall leaderboard->

```http
  GET /leaderboard-overall
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |

#### Retrieve Daily leaderboard->

```http
  GET /leaderboard-today
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |

#### Fetch daily/weekly focus metrics for a user->

```http
  GET /focus-metrics
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |


### Authentication Endpoints:
#### Register a new user->

```http
  POST /user/register
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| name, image, email, password | object | **Required** |

#### Login an existing user->

```http
  POST /user/login
```

| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| email, password | object | **Required** |

#### Logout user->
```http
  POST /user/logout
```

| cookie | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | **Required**. |




## Database Design
1. 	Users Table
	####	Stores user details.
	    -	id
	    -	name
	    -	email
        -   hashed password
        -   timestamp

2. Focus Sessions Table
	####	Logs focus sessions with the following fields:
	    -	user_id
	    -	duration
	    -	timestamp




## Caching
	•	Uses Redis for caching daily and weekly metrics for quick retrieval.
	•	Implements Redis-based rate limiting for API endpoints.
## Gamification Logic
	•	Calculates streaks and assigns badges based on consecutive days of focus sessions.
	•	Resets streaks after inactivity.
## Monitoring & Logging
	•	API performance monitoring via Prometheus.
	•	Logging API requests and errors using Winston.
## Folder Structure

```javascript
src/
├── controllers/    # Request handlers
├── models/         # Database models
├── services/       # Database services
├── routes/         # API routes
├── middleware/     # Middleware functions
├── utils/          # Utility functions
└── config/         # Configuration files
```


## Installation

1.	Clone the repository:
```bash
git clone <repository-url>
cd backend
```
2.	Install dependencies:
```bash
npm install
```

3.	Set up the environment variables in a .env file:
```bash
PORT=4000
DATABASE_URL=<postgresql-connection-string>
REDIS_URL=<redis-connection-string>
JWT_SECRET=<your-secret-key>
```

4.	Run the development server:
```bash
npm run dev
```

5.	The API will be available at:
```bash
http://localhost:4000
```
## Screenshots - Dashboard
![Dashboard](https://i.ibb.co.com/rbLD2Jm/screencapture-promodoro-app-theta-vercel-app-dashboard-2025-01-13-23-17-44.png)

