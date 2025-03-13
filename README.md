# Almindhar Experience

A web platform for booking Tunisian adventures with integrated mini-games.

## Project Overview

Almindhar Experience is a platform that allows users to:
- Browse and book Tunisian adventures (camel rides, parachuting, diving)
- Play immersive mini-games related to each experience
- Earn rewards and badges through gameplay
- Complete reservations with integrated payment processing

## Features

- **User Authentication**: Register, login, and profile management
- **Experience Catalog**: Browse adventures by category with filtering options
- **Mini-Games**:
  - Desert Rider (3D camel riding game)
  - Skyfall Simulator (3D parachuting simulation)
  - Coral Reef Explorer (2D underwater adventure)
- **Reward System**: Earn discounts and badges through gameplay
- **Booking System**: Reserve experiences with date selection and payment
- **Recommendation System**: Personalized adventure suggestions

## Technology Stack

- **Frontend**: Next.js, Tailwind CSS
- **Game Development**: Three.js (3D), Phaser.js (2D)
- **State Management**: Zustand, React Query
- **Backend**: Supabase (Authentication, Database, Storage, Realtime)
- **Forms**: React Hook Form

## Implementation Plan

The project will be implemented in phases:

1. **Core Platform**: Authentication, user profiles, experience catalog
2. **First Game**: Coral Reef Explorer (Phaser.js)
3. **Reward System**: Score tracking, discounts, badges
4. **Booking System**: Reservations and mock payments
5. **Additional Games**: Desert Rider and Skyfall Simulator
6. **Recommendation Engine**: Personalized experience suggestions

## Getting Started

```bash
# Clone the repository
git clone https://github.com/AyoubAchour/almindhar-experience.git

# Navigate to the project directory
cd almindhar-experience

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start the development server
npm run dev
```

## Academic Project

This project is being developed as part of a PFE (Final Year Project) at [Your University/School].
