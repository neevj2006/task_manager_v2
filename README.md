# Task Tracker App

## Project Overview

This project is a Task Tracker Application where users can sign in via Google authentication, manage tasks, and interact with a Firebase backend using RESTful APIs. The application is designed to store tasks, allow users to add, edit, and delete tasks, and filter them based on status or due date. The frontend is built with React and Redux, while the backend uses Firebase Firestore and Firebase Functions to handle user data and task management.

## Technologies Used

- **Frontend**: React with Redux for state management
- **Backend**: Firebase Firestore, Firebase Authentication
- **API**: Firebase Functions as REST API
- **Hosting**: Vercel for frontend deployment

## Project Features and Accomplishments

### 1. **User Authentication**

- Implemented **Google Sign-In** using Firebase Authentication, allowing users to log in and out securely.
- Displayed **user information** (profile picture, name) on the dashboard after sign-in.

### 2. **Task Management**

- Created a **Task Management UI** that lists tasks for the logged-in user.
  - Each task contains a title, description, status (To Do, In Progress, Completed), and due date.
  - Users can **add**, **edit**, and **delete** tasks through a form-based interface.
- **Form Validation**: Limited the number of characters allowed in the task title and description, and ensured that these fields are required. Appropriate error messages are displayed for invalid inputs.
- **Task Filters**: Added functionality to filter & sort tasks by **status** (To Do, In Progress, Completed) and **due date**.

### 3. **State Management**

- Managed application state using **React Redux Toolkit**, efficiently storing user and task data across components.

### 4. **Backend - Firebase**

- Used **Firestore Database** to store tasks, ensuring data integrity by storing task fields (title, description, status, dueDate) along with the user's unique ID.
- Implemented **Firestore Security Rules** to ensure that only authenticated users can access and manage their own tasks.

### 5. **Firebase Functions - REST API**

- Built a RESTful API with Firebase Functions to handle task management
- Ensured **authorization** for each API request by validating Firebase Authentication tokens.

### 6. **Responsive Design**

- Developed a **responsive UI** that adjusts seamlessly across different screen sizes (desktop, tablet, mobile).
- Enhanced the navigation bar to be more **responsive**, improving user experience across devices.

### 7. **Light and Dark Theme Support**

- Implemented **dark mode** support, enabling users to switch between dark and light themes. Both themes are designed with accessible color palettes for optimal readability.

### 8. **Hosting and Deployment**

- **Deployed the frontend** on Vercel with continuous integration. The project is automatically deployed upon every push to the main branch on GitHub.

## Problems Faced and Solutions

- **Authentication Challenges**: Faced some initial difficulties integrating Firebase Authentication with Google Sign-In, but resolved this by thoroughly understanding Firebase documentation and handling token management properly.
- **State Management Issues**: Managing state across multiple components was challenging at first, but using Redux Toolkit simplified the state management process.
- **Responsive Design**: Ensuring that the UI worked well on both desktop and mobile devices required multiple iterations and testing.

## Stretch Goals Achieved

- Implemented **dark mode** as an optional feature.
- Added functionality to **filter tasks** based on status and due date, enhancing the user experience.

## How AI Helped

- Used AI tools for code optimization, UI design inspiration, and solving minor implementation bugs.

## Links

- **Live Project**: [Deployed Link](https://task-manager-v2-inky.vercel.app/)
- **GitHub Repository**: [GitHub Link](https://github.com/neevj2006/task_manager_v2)
