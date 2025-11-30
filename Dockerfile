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
# STAGE 2: Producción (Ubuntu Jammy)
# ==========================
FROM eclipse-temurin:21-jre AS runtime

# Instalar Python, pip y ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar jar desde el build
COPY --from=build /app/target/*.jar app.jar

# Python requirements
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt || echo "No requirements.txt found"
COPY songs_list ./songs_list
COPY python ./python
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]