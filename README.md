# WebSocket Handler

## Introduction
Project handles input from temperature and humidity sensors over WebSockets, uses Docker for container orchestration, MongoDB for data storage, and Nest for the application framework.

## Requirements
- Docker
- *Node (to run tests)*

## Instructions

**Start handler**:

`make start`

**Stop handler**:

`make stop`

**Install dependencies**:

`make install`

**Run tests**:

`make test`

**Run tests with coverage report**:

`make coverage`

## Entrypoint
Project exposes an HTTP server on port `3000` listening to WebSocket `weather-data` events with payload defined as below:

```
{
  temperature: number,
  humidity: number
}
```

## Discussion
Project utilizes Mongoose to make the interactions with the Mongo database straight-forward.
Data validation is handled with Nest built-in tools: Validation Pipes.
Tests use MongoDB in-memory server with socket.io clients.
Database URI is passed to server through an environmental variable in Docker Compose.
