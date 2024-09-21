# Hungri NEWS

## Description

A "clone" of the Tengrinews website in the Material-UI style. Written with FastAPI + React.js.

## Development Process

It was decided to implement the backend in Python using FastAPI and the frontend in React.js. The reason for choosing these frameworks is simple: they are the ones I have the most experience with.

Due to my limited full-stack experience, a few issues arose, leading to some compromises:

- The view counter during parsing did not register since it updates dynamically, so a random value between 1 and 1000 was selected. However, the counter's update mechanism was implemented (persistently).
- Categories for articles were not implemented.

## Installation

The installation process is very simple. You need to:

1. Clone the repository (download it).
2. Install Docker and the Docker Compose extension.
3. In the root folder of the repository, run the command:
   ```bash
   sudo docker compose --build
   ```

After both servers have started, you will need to wait a bit for the articles to finish parsing.

The website will be available at http://localhost:3000, and the backend API will be available at http://localhost:8000/docs.
