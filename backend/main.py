from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
from models import Report, ContextSignal, PriorityEvaluation, StatusHistory

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "CivicSense Backend Running"}


@app.post("/report")
def create_report(
    description: str,
    category: str,
    latitude: float,
    longitude: float,
    near_school: bool = False,
    near_hospital: bool = False,
    high_density_area: bool = False,
    peak_hour: bool = False,
    public_danger: bool = False,
    db: Session = Depends(get_db)
):

    # 1️⃣ Create report
    report = Report(
        description=description,
        category=category,
        latitude=latitude,
        longitude=longitude
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    # 2️⃣ Add context
    context = ContextSignal(
        report_id=report.id,
        near_school=near_school,
        near_hospital=near_hospital,
        high_density_area=high_density_area,
        peak_hour=peak_hour,
        public_danger=public_danger
    )

    db.add(context)

    # 3️⃣ Priority scoring logic (demo logic)
    score = 0

    if public_danger:
        score += 40
    if near_hospital:
        score += 30
    if near_school:
        score += 20
    if peak_hour:
        score += 10
    if high_density_area:
        score += 15

    if score >= 70:
        label = "Critical"
    elif score >= 40:
        label = "High"
    else:
        label = "Normal"

    priority = PriorityEvaluation(
        report_id=report.id,
        context_score=score,
        total_score=score,
        priority_label=label,
        model_version="v1"
    )

    db.add(priority)

    # 4️⃣ Add initial status history
    status_entry = StatusHistory(
        report_id=report.id,
        status="Pending"
    )

    db.add(status_entry)

    db.commit()

    return {
        "report_id": report.id,
        "priority": label,
        "score": score
    }
