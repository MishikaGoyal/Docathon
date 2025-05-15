#!/bin/bash

# Step 1: Activate the virtual environment inside backend/
source venv/bin/activate

# Step 2: Install dependencies
pip install -r requirements.txt

# Step 3: Run FastAPI server
uvicorn app.main:app --reload
