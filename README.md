# CineSync - Media Detail Screen

A comprehensive React Native component for displaying detailed movie and TV show information, merging features from Letterboxd and IMDb.

## Features

### 🎬 Unified Header
- Movie poster display
- Dual scoring system (IMDb & Letterboxd)
- Clean, dark-themed design
- Watchlist toggle with visual feedback

### 📊 Letterboxd Score Distribution (Movies Only)
- Horizontal histogram showing rating distribution
- Color-coded bars (red to green gradient)
- Displays fan count and percentage breakdown
- Exact replica of Letterboxd's "fans" section

### 📈 TV Series Graph (TV Shows Only)
- Interactive line chart showing episode ratings
- Color-coded data points by rating quality
- Season markers on X-axis
- Statistics showing highest, average, and lowest ratings
- Built with `react-native-svg` for smooth performance

### 💬 Review Switcher
- Segmented control to toggle between IMDb and Letterboxd reviews
- Automatically hides Letterboxd option for TV shows
- Smooth transitions and clear active state

### 📌 Smart Watchlist
- Toggle button with bookmark icon
- Visual feedback (color change + icon swap)
- Ready for integration with your backend

## Installation

### 1. Install Dependencies

```bash
# Using npm
npm install lucide-react-native react-native-svg

# Using yarn
yarn add lucide-react-native react-native-svg

# Using Expo
npx expo install lucide-react-native react-native-svg
```

### 2. Add Files to Your Project

```
your-project/
├── components/
│   ├── LetterboxdScoreDistribution.tsx
│   └── TVSeriesGraph.tsx
├── screens/
│   └── MediaDetailScreen.tsx
└── App.tsx (or your navigation setup)
```

## Usage

### Basic Implementation

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import MediaDetailScreen from './screens/MediaDetailScreen';

const movieData = {
  title: 'Inception',
  summary: 'A thief who steals corporate secrets...',
  releaseDate: '2010',
  runtime: 148,
  type: 'movie',
  posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  scores: {
    imdb: 8.8,
    letterboxd: 4.2,
  },
  letterboxdWeights: [120, 450, 800, 1200, 2000, 3500, 5000, 4200, 2100, 800],
};

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <MediaDetailScreen mediaData={movieData} />
    </SafeAreaView>
  );
}
```

### TV Show Example

```tsx
const tvData = {
  title: 'Breaking Bad',
  summary: 'A chemistry teacher diagnosed with inoperable lung cancer...',
  releaseDate: '2008',
  runtime: 47,
  type: 'tv',
  posterUrl: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  scores: {
    imdb: 9.5,
    letterboxd: 0, // Not displayed for TV
  },
  letterboxdWeights: [], // Not used for TV
  tvSeriesData: [
    {
      seasonNumber: 1,
      episodeNumber: 1,
      title: 'Pilot',
      rating: 8.9,
    },
    // ... more episodes
  ],
};
```

## Data Structure

### MediaData Interface

```typescript
interface MediaData {
  title: string;                    // Movie/show title
  summary: string;                  // Synopsis/description
  releaseDate: string;              // Release year
  runtime: number;                  // Runtime in minutes
  type: 'movie' | 'tv';            // Media type
  posterUrl: string;                // URL to poster image
  scores: {
    imdb: number;                   // IMDb rating (0-10)
    letterboxd: number;             // Letterboxd rating (0-5)
  };
  letterboxdWeights: number[];      // Rating distribution array
  tvSeriesData?: Episode[];         // Optional: TV episode data
}

interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  rating: number;                   // Episode rating (0-10)
}
```

### Letterboxd Weights Explained

The `letterboxdWeights` array represents the distribution of ratings from 0.5★ to 5★:

```typescript
// Index:  0    1    2     3     4     5      6      7      8      9
// Rating: 0.5★ 1★  1.5★  2★   2.5★  3★    3.5★   4★    4.5★   5★
letterboxdWeights: [120, 450, 800, 1200, 2000, 3500, 5000, 4200, 2100, 800]
```

Each value represents the number of users who gave that rating.

## Component Architecture

### Main Component: MediaDetailScreen
- Handles overall layout and state management
- Conditional rendering based on media type
- Watchlist toggle functionality
- Review tab switching

### Sub-Component: LetterboxdScoreDistribution
- Renders horizontal bar chart
- Auto-scales based on maximum weight
- Color gradient from red (low) to green (high)
- Responsive bar widths

### Sub-Component: TVSeriesGraph
- SVG-based line chart
- Season grouping and labeling
- Color-coded episode ratings
- Statistical summary (min/max/avg)

## Customization

### Color Scheme

The app uses a dark OLED theme. You can customize colors in the StyleSheet:

```typescript
// Primary colors
const COLORS = {
  background: '#000000',      // Pure black
  surface: '#0A0A0A',         // Near black
  card: '#1F1F1F',            // Dark grey
  border: '#374151',          // Border grey
  text: '#FFFFFF',            // White
  textSecondary: '#9CA3AF',   // Light grey
  textTertiary: '#6B7280',    // Medium grey
  accent: '#00D400',          // Letterboxd green
  imdb: '#F5C518',            // IMDb yellow
};
```

### Typography

```typescript
// Font sizes used
title: 24,           // Screen title
sectionTitle: 20,    // Section headers
body: 15,            // Body text
metadata: 14,        // Secondary info
small: 12,           // Labels and stats
```

## Features Roadmap

### Ready for Integration
- [ ] API integration for fetching movie/TV data
- [ ] Watchlist persistence (backend/local storage)
- [ ] Actual review content loading
- [ ] Pull-to-refresh functionality
- [ ] Share functionality
- [ ] Deep linking to IMDb/Letterboxd

### Potential Enhancements
- [ ] Skeleton loading states
- [ ] Image caching
- [ ] Swipe gestures for navigation
- [ ] Cast & crew section
- [ ] Similar titles recommendations
- [ ] Trailer integration
- [ ] User ratings and personal reviews

## Performance Considerations

1. **SVG Optimization**: The TV graph uses `useMemo` to prevent unnecessary recalculations
2. **Image Lazy Loading**: Consider implementing FastImage for better image performance
3. **Virtualization**: For very long TV series, consider virtualizing the episode list
4. **Debouncing**: Add debounce to the watchlist toggle to prevent rapid API calls

## Troubleshooting

### SVG Not Rendering
```bash
# Make sure react-native-svg is properly linked
npx expo install react-native-svg

# For bare React Native
npx react-native link react-native-svg
```

### Icons Not Showing
```bash
# Ensure lucide-react-native is installed
npm install lucide-react-native

# Clear cache if needed
npx expo start -c
```

### TypeScript Errors
Make sure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Contributing

This component is designed to be modular and extensible. Feel free to:
- Extract styles to a theme provider
- Add animation libraries (react-native-reanimated)
- Implement gesture handlers
- Create variants for different layouts

## License

MIT License - feel free to use this in your projects!

## Credits

Inspired by:
- Letterboxd's beautiful rating distribution UI
- IMDb's comprehensive movie database
- SeriesGraph's episode rating visualizations

---

Built with ❤️ for the CineSync project
