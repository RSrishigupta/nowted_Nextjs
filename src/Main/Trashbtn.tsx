import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import {Button} from '@mui/material';
import del from '../assets/del.svg';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TrashProps {
  id: string;
  title: string;
  foldername: string;
  folderid: string;
}

const Trash: React.FC<TrashProps> = ({ id}) => {
  const delApi = `https://nowted-server.remotestate.com/notes/${id}`;

  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(delApi);
    },
    onSuccess: () => {
      alert('Note deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['noteData'] });

    },
    onError: () => {
      console.error('Problem with the delete request');
      alert('Failed to delete note');
    },
  });

  const deleteNote = async () => {
    deleteNoteMutation.mutate();
  };

  return (
   
    <Button
    fullWidth
    onClick={deleteNote}
    sx={{
      display: 'flex',
      justifyContent: 'flex-start', 
      gap: '12px',
      '&:hover': {
        backgroundColor: 'red',
      },
      borderRadius: '4px',
      cursor: 'pointer',
      textTransform: 'none',
      color: 'inherit',
    }}
  >
    <Image src={del} alt="Trash Icon" />
   Trash
  </Button>
     
  );
};

export default Trash;