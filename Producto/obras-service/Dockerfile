# 1. Usamos una imagen que ya tiene Maven instalado
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

WORKDIR /app

COPY . .

# 2. Compilamos usando el comando nativo de maven (mvn) en lugar de ./mvnw
RUN mvn clean package -DskipTests

# 3. Empaquetamos la aplicación en la imagen más liviana de Java
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]