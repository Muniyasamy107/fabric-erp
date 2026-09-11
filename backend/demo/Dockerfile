FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

EXPOSE 8083

CMD ["sh", "-c", "java -jar target/*.jar --server.port=${PORT:-8083}"]