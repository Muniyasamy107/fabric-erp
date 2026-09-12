# Render / cloud Dockerfile for the Spring Boot API
# Root Directory on Render should be: backend/demo
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY . .
RUN chmod +x mvnw
RUN ./mvnw -B -q clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render sets $PORT dynamically
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
EXPOSE 8083
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT:-8083} --server.address=0.0.0.0"]
