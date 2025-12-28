# 1. Use official Python image
FROM python:3.11-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# 4. Prevent Python from buffering stdout/stderr
ENV PYTHONUNBUFFERED=1

# 5. Copy requirements first (better caching)
COPY requirements.txt .

# 6. Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 7. Copy rest of backend code
COPY . .

# 8. Expose backend port
EXPOSE 8000

# 9. Run FastAPI with Gunicorn (production)
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]
