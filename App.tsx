import * as React from 'react';
import { StatusBar } from 'expo-status-bar';

import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/state/auth';
import { AppStateProvider } from './src/state/appState';
import { setupLeapNotifications } from './src/services/notifications';

export default function App() {
  React.useEffect(() => {
    void setupLeapNotifications();
  }, []);

  return (
    <AuthProvider>
      <AppStateProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AppStateProvider>
    </AuthProvider>
  );
}
