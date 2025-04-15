# Linklyzer

Linklyzer is a simple service that allows users to track visits to their shared links. Generate short links that track visits, locations, devices, and more with no sign-up required.

## Features

- **Create Short Links**: Generate short, trackable links to any URL
- **Analytics Dashboard**: View detailed analytics for each link
- **Track Visitors**: Capture information about visitor IP, device, location, and referrer
- **No Registration Required**: Use the service without creating an account
- **Easy Sharing**: Copy links with one click for easy sharing

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account for the database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/linklyzer.git
cd linklyzer
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.example`
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your Supabase credentials

5. Set up the Supabase database with the following tables:

**links table**
- id (uuid, primary key)
- shortId (string, unique)
- originalUrl (string)
- createdAt (timestamp)

**analytics table**
- id (uuid, primary key)
- linkId (uuid, foreign key to links.id)
- visitorIp (string, nullable)
- userAgent (string, nullable)
- referer (string, nullable)
- timestamp (timestamp)
- country (string, nullable)
- city (string, nullable)
- device (string, nullable)

6. Run the development server
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) to see the application

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.io/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [nanoid](https://github.com/ai/nanoid) - URL-friendly unique string ID generator

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
