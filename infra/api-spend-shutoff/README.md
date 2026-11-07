# API spend shutoff

Stops the API (App Engine) as soon as it costs anything, i.e. once usage goes
past the free tier. Google Cloud has no hard spending cap, so this follows
Google's documented pattern:

1. A Cloud Billing **budget** covering only App Engine in this project
   ("API (App Engine) past free tier", $1) publishes the month's cost to the
   Pub/Sub topic `api-budget` several times a day.
2. The Cloud Function **`api-spend-shutoff`** (`main.py`, region us-west2)
   receives each message and, if the cost is above $0, sets the App Engine
   app's serving status to stopped.

Billing data lags by a few hours, so this limits overspend rather than
guaranteeing exactly $0. `api/app.yaml` also caps the API at 2 instances.

## When it has fired

The API returns errors until it's re-enabled:

```
gcloud app update --serving-status=serving --project=r2dliu-website
```

The budget resets each calendar month, so re-enabling mid-month will be
stopped again by the next budget message while the month's cost is above $0.

## Deploying

```
gcloud functions deploy api-spend-shutoff --gen2 --project=r2dliu-website \
  --region=us-west2 --runtime=python311 --source=infra/api-spend-shutoff \
  --entry-point=stop_api_over_budget --trigger-topic=api-budget \
  --service-account=api-spend-shutoff@r2dliu-website.iam.gserviceaccount.com \
  --trigger-service-account=api-spend-shutoff@r2dliu-website.iam.gserviceaccount.com \
  --memory=256Mi --max-instances=1
```

The service account needs `roles/appengine.appAdmin` on the project (to stop
the app) and `roles/run.invoker` on the function (to receive the messages).

Test without stopping anything by publishing a message with `dryRun=true`:

```
gcloud pubsub topics publish api-budget --project=r2dliu-website \
  --attribute=dryRun=true \
  --message='{"budgetDisplayName":"test","costAmount":0.5,"currencyCode":"USD"}'
```
