import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const DOCUMENT_ID = 1; // Exemplo de ID fixo para o seu texto
const API_URL = `http://localhost:3000/document/${DOCUMENT_ID}`; // Ajuste a porta se necessário

export const EditableText = () => {
  const [text, setText] = useState<string>('');
  const [tempText, setTempText] = useState<string>(''); // Guarda a edição antes de salvar
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Busca o texto inicial do Back-end
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        if (res.data) {
          setText(res.data.content);
          setTempText(res.data.content);
        }
      })
      .catch((err) => console.error("Erro ao buscar texto:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Função para salvar o texto (Disparada no clique do botão)
const handleSave = async () => {
  setLoading(true);
  try {
    // Garantimos que estamos enviando o objeto com a propriedade 'content'
    const response = await axios.post(API_URL, { content: tempText });
    
    // Forçamos o React a atualizar a tela com o que o banco gravou
    if (response.data) {
      setText(response.data.content || '');
      setTempText(response.data.content || '');
    }
    setIsEditing(false);
  } catch (error) {
    console.error("Erro ao salvar o texto:", error);
    alert("Não foi possível salvar o texto.");
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setTempText(text); // Reverte as alterações não salvas
    setIsEditing(false);
  };

  if (loading && text === '') {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', border: '1px solid #ccc', borderRadius: 2, mt: 4 }}>
      {isEditing ? (
        // MODO DE EDIÇÃO
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Editar Texto"
            value={tempText}
            onChange={(e) => setTempText(e.target.value)}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<CancelIcon />} 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Atualizar'}
            </Button>
          </Box>
        </Box>
      ) : (
        // MODO DE VISUALIZAÇÃO
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'between', gap: 2 }}>
          <Typography variant="body1" sx={{ flexGrow: 1, whiteSpace: 'pre-line' }}>
            {text || <i>Nenhum texto cadastrado. Clique no lápis para adicionar.</i>}
          </Typography>
          <IconButton color="primary" onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};