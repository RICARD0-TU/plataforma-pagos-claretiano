FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn
COPY src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV DATABASE_URL=jdbc:postgresql://postgres:5432/gestion_pagos
ENV DATABASE_USERNAME=postgres
ENV DATABASE_PASSWORD=postgres
ENV JWT_SECRET=ClaretianPay2024SecretKeyForJWTTokenGenerationMustBe256BitsLong
ENTRYPOINT ["java", "-jar", "app.jar"]
