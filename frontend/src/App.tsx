// src/App.tsx
import { Container, CssBaseline, Typography } from '@mui/material';
import { EditableText } from './components/texto.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient(); 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline /> 
      <Container maxWidth="xl" sx={{ maxHeight: '100vh', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <EditableText />
      </Container>
    </QueryClientProvider>
  );
}

export default App;