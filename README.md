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

First, clone the repository:

```bash
git clone https://github.com/AyoubAchour/almindhar-experience.git
cd almindhar-experience
```

Then install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Academic Project

This project is being developed as part of a PFE (Final Year Project).
