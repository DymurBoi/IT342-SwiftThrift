# Use a lightweight Java image
FROM openjdk:17-jdk-slim

# Set the working directory inside container
WORKDIR /app

# Copy your built jar file into the container
COPY target/*.jar app.jar

# Expose port 8080 to outside
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
