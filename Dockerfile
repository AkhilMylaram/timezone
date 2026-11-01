# Base image with Python 3.10
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies required for MySQL client, netcat, and Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    netcat-openbsd \
    curl \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy entrypoint script to /entrypoint.sh (outside /app) so volume mounts (- .:/app) do not overwrite it with host CRLF files
COPY entrypoint.sh /entrypoint.sh
RUN dos2unix /entrypoint.sh || sed -i 's/\r$//' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy project files
COPY . /app/
RUN (dos2unix /app/entrypoint.sh 2>/dev/null || sed -i 's/\r$//' /app/entrypoint.sh 2>/dev/null || true) && chmod +x /app/entrypoint.sh 2>/dev/null || true

# Expose Django port
EXPOSE 8000

# Run entrypoint script explicitly with /bin/sh to prevent kernel shebang path lookup errors
ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]
