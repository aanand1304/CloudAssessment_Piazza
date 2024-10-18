
# CloudAssessment_Piazza

## Overview
**Piazza** is a cloud-based application inspired by Twitter, where users can post messages on different topics like Politics, Health, Sports, and Tech. Other users can interact with these posts by liking, disliking, or commenting on them. This project was developed as part of a cloud computing coursework, demonstrating the use of RESTful APIs, authentication, cloud deployment, and testing.

## Features
- **User Authentication**: Secure user login and authorization using OAuth v2 and JWT.
- **Post Management**: Users can create posts on specific topics with an expiration time, after which interactions are disabled.
- **Interactions**: Users can like, dislike, and comment on posts while they are active.
- **View Active Posts**: Browse posts with the highest activity (likes and dislikes).
- **Expired Posts**: View the history of expired posts for each topic.
- **Cloud Deployment**: Deployed using Docker and Kubernetes on Google Cloud Platform.

## Tech Stack
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: OAuth v2, JWT (JSON Web Tokens)
- **Cloud Platforms**: Docker, Kubernetes, Google Cloud Platform (GCP)
- **Testing**: Postman for API testing and custom Node.js scripts for automated tests


### Prerequisites
- Node.js installed
- MongoDB instance (local or cloud-based)
- Docker and Google Cloud account

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/CloudAssessment_Piazza.git
   cd CloudAssessment_Piazza
