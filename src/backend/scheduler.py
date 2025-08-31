from apscheduler.schedulers.background import BackgroundScheduler
from main import generate_monthly_summary

# Initalize the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(generate_monthly_summary, 'cron', day=1, hour=0, minute=0)
scheduler.start()