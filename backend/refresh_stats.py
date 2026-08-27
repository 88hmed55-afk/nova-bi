import logging
import time

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")

from app.core.database import SessionLocal
from app.application.services.statistics_service import StatisticsService

db = SessionLocal()
try:
    t = time.time()
    StatisticsService(db).refresh_range(180)
    db.commit()
    print(f"stats_done_seconds={time.time() - t:.1f}")
finally:
    db.close()