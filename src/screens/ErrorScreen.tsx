// components/ErrorScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.container}>
      <AlertCircle size={64} color="#DC2626" />
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.error}>{error}</Text>
      
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
        <RefreshCw size={20} color="#FFFFFF" />
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Common Issues:</Text>
        <Text style={styles.tipText}>• Check your internet connection</Text>
        <Text style={styles.tipText}>• Verify API keys are set correctly</Text>
        <Text style={styles.tipText}>• Check API rate limits</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  error: {
    color: '#DC2626',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D400',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    marginTop: 48,
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
});