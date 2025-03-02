# Mobile Web App - Next.js 13

## Project Setup

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn
- Next.js 13 with App Router
- Tailwind CSS

### Installation

```bash
cd frontend

# Install dependencies
npm install  # or yarn install
```

## Configuration

### Environment Variables
Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://techtest.youapp.ai
NEXT_PUBLIC_API_TIMEOUT=10000
```

## Running the Development Server

```bash
npm run dev  # or yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Project Structure

```plaintext
/mobile-webapp
├── app/                  # Next.js 13 App Router components
│   ├── layout.tsx        # Layout file
│   ├── page.tsx          # Home page
│   ├── profile/          # Profile pages
├── components/           # Reusable UI components
├── styles/               # Tailwind CSS configurations
├── utils/                # Helper functions
├── lib/                  # API service handlers
├── public/               # Static assets
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind configuration
```

## API Integration

### Authentication

#### Login
```typescript
import api from "@/lib/api";
import { AuthResponse, LoginRequest } from "@/types/auth";

export const login = async (data: LoginRequest) => {
  const response = await api.post<AuthResponse>("/api/login", data);
  return response.data;
};
```

#### Register
```typescript
import api from "@/lib/api";
import { AuthResponse, RegisterRequest } from "@/types/auth";

export const register = async (data: RegisterRequest) => {
  const response = await api.post<AuthResponse>("/api/register", data);
  return response.data;
};
```

### Profile Management

#### Get Profile
```typescript
import api from "@/lib/api";
import { Profile } from "@/types/auth";

export const getProfile = async () => {
  const response = await api.get<{ data: Profile }>("/api/getProfile");
  return response.data.data;
};
```

#### Update Profile
```typescript
import api from "@/lib/api";
import { ApiResponse, Profile } from "@/types/auth";

export const updateProfile = async (data: Partial<Profile>) => {
  const response = await api.put<ApiResponse<Profile>>("/api/updateProfile", data);
  return response.data;
};
```

## Tailwind CSS Customization

### Custom Configuration
Update `tailwind.config.js`:
```javascript
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF5733',
        secondary: '#333FFF'
      }
    }
  },
  plugins: []
};
```

## Deployment

### Build for Production
```bash
npm run build  # or yarn build
```

### Start Production Server
```bash
npm start  # or yarn start
```

## Notes
- If the API is offline, you can mock responses using tools like `msw` or `json-server`.
- Zodiac/Horoscope calculations can refer to the provided Google Sheet for reference.

## License
This project is licensed under MIT.

