# LeetSquad

## Leetcode Performance Tracker and Dashboard


![demo](https://i.ibb.co/5W31J6PD/Screenshot-from-2026-02-02-19-21-50.png)

## Setup Instructions

Clone the repo
```bash
git clone https://github.com/you/leetstack.git
cd leetstack
```
For python backend

Create environment variables
Create a .env file inside the backend directory:

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_secret_key


```bash
cd ./leetstack/backend #from project root
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py

```
Backend will run at http://localhost:5000


For react frontend

Create a .env file inside the frontend/leetsquad directory:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_public_key

```bash
cd ./leetstack/frontend/leetsquad #from the project root 
npm install
npm run dev
```
Frontend will run at
http://localhost:5173
