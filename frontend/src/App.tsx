// src/App.tsx
import { Container, CssBaseline, Typography } from '@mui/material';
import { EditableText } from './components/texto.tsx'; // Importa o componente que você criou
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient(); 

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Reseta os estilos padrões do navegador para o Material UI funcionar bem */}
      <CssBaseline /> 
      
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Meu Bloco de Notas Integrado
        </Typography>
        
        {/* Renderiza o seu componente de texto modificável na tela */}
        <EditableText />
      </Container>
    </QueryClientProvider>
  );
}

export default App;