import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCcw, Pencil } from 'lucide-react';
import { Box, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import styles from './texto.module.css';

const DOCUMENT_ID = 1; 
const API_URL = `http://localhost:3000/document/${DOCUMENT_ID}`; 

export const EditableText = () => {
  const [newText, setNewText] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const queryClient = useQueryClient();

  const { data: documentData, isLoading, refetch } = useQuery({
    queryKey: ['document', DOCUMENT_ID], 
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data; 
    }
  });

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await axios.post(API_URL, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', DOCUMENT_ID] });
      setIsEditing(false); 
    },
    onError: (error) => {
      console.error(error);
      alert("Não foi possível salvar o texto.");
    }
  });

  const handleEditClick = () => {
    setNewText('Estrutura: React - Nest - Postgres (docker)'); 
    setIsEditing(true);       
  };

  const handleSave = () => {
    mutation.mutate(newText); 
  };

  if (isLoading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box className={styles.fullscreenContainer}>
      
      {!isEditing ? (
        <Box className={styles.viewWrapper}>
          <IconButton 
            onClick={() => refetch({ cancelRefetch: false })} 
            title="Recarregar dados"
            className={styles.reloadButton}
          >
            <RefreshCcw size={40} />
          </IconButton> 

          <Box className={styles.textGroup}>
            <Typography variant="h4" className={styles.savedText}>
              {documentData?.content || 'Nenhum texto cadastrado.'}
            </Typography> 
            <IconButton onClick={handleEditClick} className={styles.editIcon}>
              <Pencil size={36} />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box className={styles.formGroup}>
          <input
            type="text"
            className={styles.customInput}
            value={newText}
            onChange={(e: any) => setNewText(e.target.value)}
            autoFocus
          />
          <Button 
            variant="contained"
            onClick={handleSave}
            disabled={mutation.isPending}
            className={styles.saveButton}
          >
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </Box>
      )}

    </Box>
  );
};