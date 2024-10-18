CloudAssessment_Piazza

Overview
Piazza is a cloud-based application inspired by Twitter, where users can post messages on different topics like Politics, Health, Sports, and Tech. Other users can interact with these posts by liking, disliking, or commenting on them. The project was developed as part of a cloud computing coursework, demonstrating the use of RESTful APIs, authentication, cloud deployment, and testing.

Features
User Authentication: Uses OAuth v2 and JWT for secure user login and authorization.
Post Management: Users can create posts on specific topics and set an expiration time after which interactions are disabled.
Interactions: Users can like, dislike, and comment on posts while they are active.
View Active Posts: Browse posts with the highest activity (likes and dislikes).
Expired Posts: View the history of expired posts for each topic.
Cloud Deployment: The application is deployed using Docker and Kubernetes on Google Cloud.
Tech Stack
Backend: Node.js with Express
Database: MongoDB
Authentication: OAuth v2, JWT (JSON Web Tokens)
Cloud Platforms: Docker, Kubernetes, Google Cloud Platform (GCP)
Testing: Postman for API testing, and custom Node.js scripts for automated tests
Project Structure
graphql
Copy code
├── Validations/          # Input validation logic
├── models/               # MongoDB schemas for posts and users
├── node_modules/         # Dependencies for the project
├── routes/               # API routes (e.g., user registration, posts)
├── app.js                # Main server file
├── package.json          # Node.js package information
├── package-lock.json     # Dependency lock file
├── Command.md            # Commands for setup and deployment
├── Read_me               # Detailed project description (moved)
├── verifyToken.js        # Middleware for JWT verification
├── references.md         # References for resources used in the project

Setup Instructions
Prerequisites
Node.js installed
MongoDB instance (local or cloud-based)
Docker and Google Cloud account
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/CloudAssessment_Piazza.git
cd CloudAssessment_Piazza
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the root directory.
Add the following variables:
makefile
Copy code
MONGODB_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
OAUTH_CLIENT_ID=<Your OAuth Client ID>
OAUTH_CLIENT_SECRET=<Your OAuth Client Secret>
Start the server:

bash
Copy code
npm start
Access the API at http://localhost:3000.

Testing
Use Postman to test API endpoints.
Test user registration, posting messages, and interactions (like, dislike, comment).
Alternatively, use the Node.js test scripts included in the tests folder.
Deployment
Docker Deployment
Build Docker Image:

bash
Copy code
docker build -t piazza-app .
Run the Docker Container:

bash
Copy code
docker run -p 3000:3000 piazza-app
Push to DockerHub (optional):

bash
Copy code
docker tag piazza-app your-dockerhub-username/piazza-app
docker push your-dockerhub-username/piazza-app
Kubernetes Deployment
Create a Kubernetes Cluster on Google Cloud Platform.
Deploy the Docker image:
Use the provided kubernetes directory for deployment files.
Create deployments and services using kubectl commands:
bash
Copy code
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
Set up a Load Balancer for scaling the application:
Include five replicas for the application to ensure high availability.
API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive a JWT token
POST	/api/posts	Create a new post
GET	/api/posts/:topic	Browse posts by topic
POST	/api/posts/:id/like	Like a post
POST	/api/posts/:id/dislike	Dislike a post
POST	/api/posts/:id/comment	Add a comment to a post
GET	/api/posts/:topic/active	View active posts with most likes
GET	/api/posts/:topic/expired	View expired posts for a topic
Example: Create a Post
bash
Copy code
POST /api/posts
Headers: { "Authorization": "Bearer <token>" }
Body: {
    "title": "New Tech Trends",
    "topic": "Tech",
    "body": "Let's discuss the latest in AI!",
    "expiresIn": 5 // expires in 5 minutes
}
Use Case Scenarios
User Registration: Users like Olga, Nick, and Mary register and get JWT tokens.
Posting Messages: Users post messages on topics like Tech and Health.
Interacting with Posts: Users like/dislike posts, comment, and see updated interactions.
Expired Posts: After a post's expiration, users can no longer interact but can view it.
Querying Active Posts: Find the most engaged posts in a topic based on likes and dislikes.
Future Improvements
Add Frontend: A React or Angular front-end for a better user experience.
Improved Search: Add advanced search features for posts by keywords.
CI/CD Pipeline: Use GitHub Actions for automated testing and deployment.
References
Node.js Documentation: https://nodejs.org/
MongoDB Documentation: https://www.mongodb.com/
Docker Documentation: https://docs.docker.com/
Kubernetes Documentation: https://kubernetes.io/
License
This project is licensed under the MIT License.

