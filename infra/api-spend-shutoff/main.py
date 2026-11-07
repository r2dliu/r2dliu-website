"""Stop the API (App Engine) once it starts costing money.

A Cloud Billing budget that only covers App Engine publishes its current
month's cost to a Pub/Sub topic several times a day. This function receives
those messages and, as soon as the cost is above $0 (i.e. past the free
tier), sets the App Engine app's serving status to stopped.

Billing data lags by a few hours, so this limits overspend rather than
guaranteeing exactly $0. Re-enable with:
    gcloud app update --serving-status=serving --project=r2dliu-website
"""

import base64
import json
import logging

import functions_framework
import google.auth
from google.auth.transport.requests import AuthorizedSession

PROJECT = "r2dliu-website"
APP_URL = f"https://appengine.googleapis.com/v1/apps/{PROJECT}"

logging.basicConfig(level=logging.INFO)


@functions_framework.cloud_event
def stop_api_over_budget(event):
    message = event.data["message"]
    budget = json.loads(base64.b64decode(message["data"]))
    cost = float(budget.get("costAmount", 0))
    # Test messages can set the attribute dryRun=true to skip the shutdown
    dry_run = message.get("attributes", {}).get("dryRun") == "true"
    logging.info(
        "Budget %r: cost %.2f %s since %s",
        budget.get("budgetDisplayName"),
        cost,
        budget.get("currencyCode"),
        budget.get("costIntervalStart"),
    )
    if cost <= 0:
        return

    credentials, _ = google.auth.default(
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    session = AuthorizedSession(credentials)
    status = session.get(APP_URL).json().get("servingStatus")
    if status != "SERVING":
        logging.info("App Engine already %s; nothing to do", status)
        return
    if dry_run:
        logging.warning("Dry run: would stop App Engine (cost %.2f)", cost)
        return

    response = session.patch(
        APP_URL,
        params={"updateMask": "servingStatus"},
        json={"servingStatus": "USER_DISABLED"},
    )
    response.raise_for_status()
    logging.warning("Stopped App Engine: cost %.2f is past the free tier", cost)
