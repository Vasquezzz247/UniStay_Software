# Use Maven image for building
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies first (for caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Make mvnw executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]