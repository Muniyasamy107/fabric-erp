# ---- Stage 1: Build the Spring Boot jar ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY demo/pom.xml .
RUN mvn -q dependency:go-offline

COPY demo/src ./src
RUN mvn -q package -DskipTests

# ---- Stage 2: Run ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
