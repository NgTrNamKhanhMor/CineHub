// App.tsx - WITH API INTEGRATION
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

import MediaDetailScreen from './src/screens/MediaDetailScreen';
import { useMediaData } from './hooks/useMediaData';
import { SearchScreen } from './src/screens/SearchScreen';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { ErrorScreen } from './src/screens/ErrorScreen';

export default function App() {
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<'movie' | 'tv'>('movie');
  const [showSearch, setShowSearch] = useState(true);

  // Fetch media data using the custom hook
  const { data, loading, error, refetch } = useMediaData(selectedMediaId, selectedMediaType);

  const handleSelectMedia = (id: number, type: 'movie' | 'tv') => {
    setSelectedMediaId(id);
    setSelectedMediaType(type);
    setShowSearch(false);
  };

  const handleBackToSearch = () => {
    setShowSearch(true);
    setSelectedMediaId(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {showSearch ? (
        // Show search screen
        <SearchScreen onSelectMedia={handleSelectMedia} />
      ) : loading ? (
        // Show loading state
        <LoadingScreen />
      ) : error ? (
        // Show error state
        <ErrorScreen error={error} onRetry={refetch} />
      ) : data ? (
        // Show media detail screen with real data
        <MediaDetailScreen 
          mediaData={data} 
          onBack={handleBackToSearch}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});