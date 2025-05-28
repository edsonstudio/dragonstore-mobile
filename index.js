import 'react-native-gesture-handler';
import {View, Text} from 'react-native';
import { registerRootComponent } from 'expo';
import { ErrorBoundary } from 'react-error-boundary';
import App from './src/App';

function ErrorFallback({ error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
    </View>
  );
}

function Root() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  );
}

registerRootComponent(Root);