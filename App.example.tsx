import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import MediaDetailScreen from './MediaDetailScreen';

// Example Movie Data
const movieData = {
  title: 'Inception',
  summary:
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
  releaseDate: '2010',
  runtime: 148,
  type: 'movie' as const,
  posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
  scores: {
    imdb: 8.8,
    letterboxd: 4.2,
  },
  letterboxdWeights: [120, 450, 800, 1200, 2000, 3500, 5000, 4200, 2100, 800],
};

// Example TV Series Data
const tvData = {
  title: 'Breaking Bad',
  summary:
    'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
  releaseDate: '2008',
  runtime: 47,
  type: 'tv' as const,
  posterUrl: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  scores: {
    imdb: 9.5,
    letterboxd: 0, // Not shown for TV
  },
  letterboxdWeights: [], // Not used for TV
  tvSeriesData: [
    // Season 1
    { seasonNumber: 1, episodeNumber: 1, title: 'Pilot', rating: 8.9 },
    { seasonNumber: 1, episodeNumber: 2, title: 'Cat\'s in the Bag...', rating: 8.6 },
    { seasonNumber: 1, episodeNumber: 3, title: '...And the Bag\'s in the River', rating: 8.7 },
    { seasonNumber: 1, episodeNumber: 4, title: 'Cancer Man', rating: 8.4 },
    { seasonNumber: 1, episodeNumber: 5, title: 'Gray Matter', rating: 8.5 },
    { seasonNumber: 1, episodeNumber: 6, title: 'Crazy Handful of Nothin\'', rating: 9.0 },
    { seasonNumber: 1, episodeNumber: 7, title: 'A No-Rough-Stuff-Type Deal', rating: 8.6 },
    
    // Season 2
    { seasonNumber: 2, episodeNumber: 1, title: 'Seven Thirty-Seven', rating: 8.6 },
    { seasonNumber: 2, episodeNumber: 2, title: 'Grilled', rating: 8.9 },
    { seasonNumber: 2, episodeNumber: 3, title: 'Bit by a Dead Bee', rating: 8.3 },
    { seasonNumber: 2, episodeNumber: 4, title: 'Down', rating: 8.2 },
    { seasonNumber: 2, episodeNumber: 5, title: 'Breakage', rating: 8.4 },
    { seasonNumber: 2, episodeNumber: 6, title: 'Peekaboo', rating: 9.0 },
    { seasonNumber: 2, episodeNumber: 7, title: 'Negro y Azul', rating: 8.3 },
    { seasonNumber: 2, episodeNumber: 8, title: 'Better Call Saul', rating: 8.9 },
    { seasonNumber: 2, episodeNumber: 9, title: '4 Days Out', rating: 9.4 },
    { seasonNumber: 2, episodeNumber: 10, title: 'Over', rating: 8.5 },
    { seasonNumber: 2, episodeNumber: 11, title: 'Mandala', rating: 8.7 },
    { seasonNumber: 2, episodeNumber: 12, title: 'Phoenix', rating: 9.0 },
    { seasonNumber: 2, episodeNumber: 13, title: 'ABQ', rating: 9.1 },
    
    // Season 3
    { seasonNumber: 3, episodeNumber: 1, title: 'No Más', rating: 8.4 },
    { seasonNumber: 3, episodeNumber: 2, title: 'Caballo sin Nombre', rating: 8.3 },
    { seasonNumber: 3, episodeNumber: 3, title: 'I.F.T.', rating: 8.5 },
    { seasonNumber: 3, episodeNumber: 4, title: 'Green Light', rating: 8.4 },
    { seasonNumber: 3, episodeNumber: 5, title: 'Mas', rating: 8.6 },
    { seasonNumber: 3, episodeNumber: 6, title: 'Sunset', rating: 8.8 },
    { seasonNumber: 3, episodeNumber: 7, title: 'One Minute', rating: 9.5 },
    { seasonNumber: 3, episodeNumber: 8, title: 'I See You', rating: 8.7 },
    { seasonNumber: 3, episodeNumber: 9, title: 'Kafkaesque', rating: 8.7 },
    { seasonNumber: 3, episodeNumber: 10, title: 'Fly', rating: 7.8 },
    { seasonNumber: 3, episodeNumber: 11, title: 'Abiquiu', rating: 8.5 },
    { seasonNumber: 3, episodeNumber: 12, title: 'Half Measures', rating: 9.3 },
    { seasonNumber: 3, episodeNumber: 13, title: 'Full Measure', rating: 9.6 },
    
    // Season 4
    { seasonNumber: 4, episodeNumber: 1, title: 'Box Cutter', rating: 9.3 },
    { seasonNumber: 4, episodeNumber: 2, title: 'Thirty-Eight Snub', rating: 8.5 },
    { seasonNumber: 4, episodeNumber: 3, title: 'Open House', rating: 8.3 },
    { seasonNumber: 4, episodeNumber: 4, title: 'Bullet Points', rating: 8.5 },
    { seasonNumber: 4, episodeNumber: 5, title: 'Shotgun', rating: 8.7 },
    { seasonNumber: 4, episodeNumber: 6, title: 'Cornered', rating: 8.8 },
    { seasonNumber: 4, episodeNumber: 7, title: 'Problem Dog', rating: 9.0 },
    { seasonNumber: 4, episodeNumber: 8, title: 'Hermanos', rating: 9.1 },
    { seasonNumber: 4, episodeNumber: 9, title: 'Bug', rating: 8.9 },
    { seasonNumber: 4, episodeNumber: 10, title: 'Salud', rating: 9.3 },
    { seasonNumber: 4, episodeNumber: 11, title: 'Crawl Space', rating: 9.7 },
    { seasonNumber: 4, episodeNumber: 12, title: 'End Times', rating: 9.4 },
    { seasonNumber: 4, episodeNumber: 13, title: 'Face Off', rating: 9.9 },
    
    // Season 5
    { seasonNumber: 5, episodeNumber: 1, title: 'Live Free or Die', rating: 9.0 },
    { seasonNumber: 5, episodeNumber: 2, title: 'Madrigal', rating: 8.6 },
    { seasonNumber: 5, episodeNumber: 3, title: 'Hazard Pay', rating: 8.7 },
    { seasonNumber: 5, episodeNumber: 4, title: 'Fifty-One', rating: 8.9 },
    { seasonNumber: 5, episodeNumber: 5, title: 'Dead Freight', rating: 9.5 },
    { seasonNumber: 5, episodeNumber: 6, title: 'Buyout', rating: 8.8 },
    { seasonNumber: 5, episodeNumber: 7, title: 'Say My Name', rating: 9.7 },
    { seasonNumber: 5, episodeNumber: 8, title: 'Gliding Over All', rating: 9.4 },
    { seasonNumber: 5, episodeNumber: 9, title: 'Blood Money', rating: 9.1 },
    { seasonNumber: 5, episodeNumber: 10, title: 'Buried', rating: 9.1 },
    { seasonNumber: 5, episodeNumber: 11, title: 'Confessions', rating: 9.4 },
    { seasonNumber: 5, episodeNumber: 12, title: 'Rabid Dog', rating: 9.1 },
    { seasonNumber: 5, episodeNumber: 13, title: 'To\'hajiilee', rating: 9.6 },
    { seasonNumber: 5, episodeNumber: 14, title: 'Ozymandias', rating: 10.0 },
    { seasonNumber: 5, episodeNumber: 15, title: 'Granite State', rating: 9.4 },
    { seasonNumber: 5, episodeNumber: 16, title: 'Felina', rating: 9.9 },
  ],
};

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Switch between movieData and tvData to test both types */}
      <MediaDetailScreen mediaData={tvData} />
      
      {/* <MediaDetailScreen mediaData={movieData} /> */}
    </SafeAreaView>
  );
}
