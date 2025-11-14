"""SQLAlchemy Base and model imports."""

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with Base
# This is needed for Alembic migrations
from app.models.experiment import Experiment  # noqa
from app.models.variant import Variant  # noqa
from app.models.impression import Impression  # noqa
from app.models.event import Event  # noqa
from app.models.api_key import APIKey  # noqa
