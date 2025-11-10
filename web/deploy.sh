#!/bin/bash

# Deployment script for Google Cloud Run
# Usage: ./deploy.sh [region]
#
# Required environment variables:
#   GCP_PROJECT_ID: Google Cloud project ID
#   VITE_API_URL: API endpoint URL
#   VITE_GA_TRACKING_ID: Google Analytics tracking ID

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${1:-us-central1}"
SERVICE_NAME="r2dliu-website"
API_URL="${VITE_API_URL}"
GA_TRACKING_ID="${VITE_GA_TRACKING_ID}"

# Validate required environment variables
if [ -z "$PROJECT_ID" ]; then
  echo "Error: GCP_PROJECT_ID environment variable is required"
  exit 1
fi

if [ -z "$API_URL" ]; then
  echo "Error: VITE_API_URL environment variable is required"
  exit 1
fi

if [ -z "$GA_TRACKING_ID" ]; then
  echo "Error: VITE_GA_TRACKING_ID environment variable is required"
  exit 1
fi

echo "🚀 Deploying to Google Cloud Run..."
echo "   Project: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Service: $SERVICE_NAME"
echo "   API URL: ${API_URL:0:30}..."
echo "   GA Tracking ID: ${GA_TRACKING_ID:0:8}..."
echo ""

# Set the project
gcloud config set project "$PROJECT_ID"

# Build and deploy in one command (Cloud Run will build from source)
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --platform managed \
  --port 8080 \
  --set-env-vars "VITE_API_URL=$API_URL,VITE_GA_TRACKING_ID=$GA_TRACKING_ID" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your service is available at:"
gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)'
