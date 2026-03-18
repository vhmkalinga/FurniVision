# FurniVision
PUSL3122 Group 53 3D Room Designer Website

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
   git clone https://github.com/vhmkalinga/FurniVision.git
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
   - In the `server/` directory, create a `.env` file based on `.env.example` (if provided) or add your `MONGODB_URI` and `JWT_SECRET`.

### Seeding the Database (Optional)

If you need initial data for your local environment (users, categories, products, blogs), you can run the seed scripts:

```bash
cd server
npm run seed              # Basic setup: seeds initial users, categories, products, and blogs
node seed_products.js     # Extended catalog: seeds specific products (Sofas, Tables, Beds, etc.)
```

*Note: Running these scripts will clear the existing data in the respective collections.*

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

## Credits & Additional Resources

This project makes use of the following open-source libraries, frameworks, and external resources:

### Frontend Libraries & Frameworks
- **[React 18](https://react.dev/)** — UI framework (MIT License)
- **[Vite](https://vitejs.dev/)** — Build tool and dev server (MIT License)
- **[Three.js](https://threejs.org/)** — 3D graphics library (MIT License)
- **[@react-three/fiber](https://github.com/pmndrs/react-three-fiber)** — React renderer for Three.js (MIT License)
- **[@react-three/drei](https://github.com/pmndrs/drei)** — Three.js helpers and abstractions (MIT License)
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first CSS framework (MIT License)
- **[Framer Motion](https://www.framer.com/motion/)** — Animation library for React (MIT License)

### Backend Libraries & Frameworks
- **[Node.js](https://nodejs.org/)** — JavaScript runtime (MIT License)
- **[Express](https://expressjs.com/)** — Web framework for Node.js (MIT License)
- **[Mongoose](https://mongoosejs.com/)** — MongoDB object modelling (MIT License)
- **[JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)** — JWT authentication (MIT License)
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — Password hashing (MIT License)
- **[Multer](https://github.com/expressjs/multer)** — File upload middleware (MIT License)
- **[dotenv](https://github.com/motdotla/dotenv)** — Environment variable management (BSD-2-Clause License)
- **[cors](https://github.com/expressjs/cors)** — Cross-Origin Resource Sharing middleware (MIT License)
- **[slugify](https://github.com/simov/slugify)** — String slug generation (MIT License)

### Database
- **[MongoDB](https://www.mongodb.com/)** — NoSQL database (SSPL License — free for development use)

### 3D Models & Assets
- **Furniture & Architectural 3D Models** — *(Please credit the actual source/author of each .glb model file)*

### Icons & UI
- **Icons** — *(Please credit icon library used, e.g., Heroicons, Lucide, etc.)*

## License
MIT License
