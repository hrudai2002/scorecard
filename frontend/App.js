import { AuthProvider } from "./src/contexts/auth"
import { Router } from './src/routes/router';
import Toast  from "react-native-toast-message";

export default function App() {
  return (
      <AuthProvider>
          <Router />
          <Toast 
            position='bottom'
            visibilityTime={3000}
            bottomOffset={40}
          />
      </AuthProvider>
  );
}

