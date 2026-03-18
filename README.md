# FurniVision

FurniVision is a 3D room planning and interior design application. It allows users to create floor plans, furnish rooms using a 3D catalog, and visualize interior design concepts in real-time.

## Features

- **2D/3D Room Designer**: Draw walls, adjust room dimensions, and toggle between top-down 2D and immersive 3D views.
- **Furniture Catalog**: Browse a wide selection of furniture and drag-and-drop items into the 3D space.
- **Customization**: Rotate, move, and customize furniture placement.
- **User Roles**: distinct dashboards for Customers, Staff Designers, and Administrators.
- **Authentication**: JWT-based login and registration system.

## Tech Stack

### Frontend
- **React 18** (Vite)
- **Three.js** (@react-three/fiber & @react-three/drei) for the 3D graphics engine.
- **Tailwind CSS** for UI styling.
- **Framer Motion** for animations.

### Backend
- **Node.js** & **Express**
- **MongoDB** (Mongoose)
- **JSON Web Tokens (JWT)** for secure sessions.

## Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/FurniVision.git
   cd FurniVision
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   - In the `server/` directory, create a `.env` file based on `.env.example` (if provided) or add your `MONGO_URI` and `JWT_SECRET`.

### Running the Application

1. Start the backend Server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend Client (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## License
MIT License
