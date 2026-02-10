// src/screens/MediaDetailWrapper.tsx
import React from 'react';
import { useMediaData } from '../hooks/useMediaData';
import { LoadingScreen } from '../src/screens/LoadingScreen';
import { ErrorScreen } from '../src/screens/ErrorScreen';
import MediaDetailScreen from '../src/screens/MediaDetailScreen';

export default function MediaDetailWrapper({ route, navigation }: any) {
  const { mediaId, mediaType } = route.params;
  const { data, loading, error, refetch } = useMediaData(mediaId, mediaType);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <MediaDetailScreen 
      mediaData={data} 
      onBack={() => navigation.goBack()} 
    />
  );
}