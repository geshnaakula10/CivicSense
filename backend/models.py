from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

# ---------------- REPORT ----------------
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)

    latitude = Column(Float, nullable=False, index=True)
    longitude = Column(Float, nullable=False, index=True)
    address = Column(String(255), nullable=True)

    image_path = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    current_status = Column(String(50), default="Pending")

    # Relationships
    context = relationship("ContextSignal", back_populates="report", uselist=False, cascade="all, delete")
    priority = relationship("PriorityEvaluation", back_populates="report", uselist=False, cascade="all, delete")
    routing_logs = relationship("RoutingLog", back_populates="report", cascade="all, delete")
    status_history = relationship("StatusHistory", back_populates="report", cascade="all, delete")


# ---------------- CONTEXT ----------------
class ContextSignal(Base):
    __tablename__ = "context_signals"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)

    near_school = Column(Boolean, default=False)
    near_hospital = Column(Boolean, default=False)
    high_density_area = Column(Boolean, default=False)
    peak_hour = Column(Boolean, default=False)
    public_danger = Column(Boolean, default=False)

    report = relationship("Report", back_populates="context")


# ---------------- PRIORITY ----------------
class PriorityEvaluation(Base):
    __tablename__ = "priority_evaluations"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)

    nlp_score = Column(Float)
    context_score = Column(Float)
    total_score = Column(Float)

    priority_label = Column(String(50))
    model_version = Column(String(50), default="v1")

    evaluated_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="priority")


# ---------------- DEPARTMENT ----------------
class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, index=True)
    contact_email = Column(String(255))


# ---------------- ROUTING ----------------
class RoutingLog(Base):
    __tablename__ = "routing_logs"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), index=True)

    routed_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="routing_logs")
    department = relationship("Department")


# ---------------- STATUS HISTORY ----------------
class StatusHistory(Base):
    __tablename__ = "status_history"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("reports.id"), index=True)

    status = Column(String(50))
    updated_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("Report", back_populates="status_history")
