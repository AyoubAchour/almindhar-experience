# Almindhar Experience

A modern tourism platform for exploring Tunisian experiences with interactive games and rewards.

![Almindhar Experience](https://github.com/AyoubAchour/almindhar-experience/assets/59311151/placeholder-image)

## 🌟 Features

- **Curated Experiences**: Discover handpicked Tunisian destinations with detailed information
- **Interactive Mini-Games**: Engage with fun games related to the experiences
- **Rewards System**: Earn points and unlock special offers through participation
- **User Profiles**: Track your bookings, game progress, and rewards
- **Seamless Booking**: Easy-to-use booking system for all experiences

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **Styling**: Modern UI with animated gradients, responsive design
- **Authentication**: Custom-themed auth UI with Supabase Auth
- **Deployment**: Vercel (frontend), Supabase (backend)

## 📋 Database Schema

The application uses the following Supabase tables:

- `user_profiles`: User information linked to auth.users
- `experiences`: Travel experiences with details and availability
- `bookings`: User bookings for experiences
- `rewards`: Available loyalty program rewards
- `user_rewards`: Junction table for user-reward relationships
- `game_scores`: User scores in experience-related games
- `user_game_progress`: User progress in games

## 🎮 Interactive Games

The platform features several mini-games that enhance the tourism experience:

- Historical quizzes
- Cultural puzzles
- Geographic challenges
- Virtual tours

## 🎨 Design Features

- Animated gradient blob backgrounds
- Modern card designs with hover effects
- Stylish buttons with gradient animations
- Responsive layout for all device sizes
- Accessible design with proper contrast

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/AyoubAchour/almindhar-experience.git
   cd almindhar-experience
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Images from [Unsplash](https://unsplash.com)
- Icons from [Heroicons](https://heroicons.com)