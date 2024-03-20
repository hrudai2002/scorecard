import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "./src/contexts/auth"
import { Router } from './src/routes/router';

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

