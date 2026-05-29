import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    Asset.loadAsync([
      require('./assets/icon.png'),
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SoloSafiri</Text>
      </View>
      <WebView
        source={{ uri: 'https://abhibiradar746-byte.github.io/solosafari/' }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#0055d4" />
            <Text style={styles.loadingText}>Loading SoloSafiri...</Text>
          </View>
        )}
        style={styles.webview}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6fbff',
  },
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d4d9b',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#444444',
  },
});
