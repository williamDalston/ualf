FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY apps/api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY apps/api/ualf_api /app/ualf_api
ENV PORT=8000
EXPOSE 8000
CMD ["uvicorn", "ualf_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
