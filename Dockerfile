# ==========================
# STAGE 1: Build con Maven
# ==========================
FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests


# ==========================
# STAGE 2: Producción
# ==========================
FROM eclipse-temurin:21-jre AS runtime

# Instalar Python, pip, venv y ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Crear entorno virtual
RUN python3 -m venv /opt/venv

# Activar entorno virtual
ENV PATH="/opt/venv/bin:$PATH"

# Copiar JAR
COPY --from=build /app/target/*.jar app.jar

# Copiar requirements e instalarlos en el venv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY songs_list ./songs_list
COPY python ./python

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]