# r2dliu.com - Personal Website

A personal website showcasing projects, articles, and interactive experiences, built with modern web technologies and deployed on Google Cloud infrastructure.

## Architecture Overview

This project has evolved quite a lot over the years. The progression looked something like this:

- **Raw HTML/CSS/JS** → **Create React App** → **Remix** → **TanStack Start**

The current stack represents a fully type-safe, server-side rendered, React application with scalable full-stack capabilities. It's nearly completely free to host, too; I only pay pennies a month to keep this thing afloat.

## Tech Stack

### Frontend (React)
- **[TanStack Start](https://tanstack.com/start)**: Full-stack React framework with SSR, file-based routing, and built-in data loading
- **React Three Fiber**: 3D graphics and interactive experiences using Three.js
- **TypeScript**: Full type safety across the entire application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first styling

### Backend (Python)
- **uv**: Blows everything else out of the water
- **Django**: A tried and true classic
- **Supabase**: The only "free" db hosting
- **GraphQL**: Powered by Graphene

### Infrastructure
- **Google Cloud Run**: Serverless container deployment for both frontend and backend
- **Google Cloud Build**: CI/CD pipeline for automatic deployments
- **AWS Route53 / Cloudflare**: DNS and route management
- **Docker**: Containerization for consistent deployments

## Features

- **Interactive 3D Experiences**: Wanted to learn Three.js so built a 3D game
- **Articles & Blog**: Rolled my own CMS based off Markdown
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Analytics**: Google Analytics integration (GA4)
- **SEO Optimized**: Server-side rendering with TanStack Start. Probably my favorite framework of a framework thus far.