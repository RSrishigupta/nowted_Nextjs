import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Box, Button } from '@mui/material';
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
      // Invalidate the notes query to refetch the updated list
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
    <>
      <Box>
        <Button
          onClick={deleteNote}
          sx={{
            display: 'flex',
            gap: '12px', // Equivalent to gap-3
            '&:hover': {
              backgroundColor: 'red', // Equivalent to hover:bg-gray-500
            },
            borderRadius: '4px', // Equivalent to rounded-md
            cursor: 'pointer',
            textTransform: 'none', // Prevents uppercase transformation
            color: 'inherit', // Inherits text color
          }}
        >
          <Image src={del} alt="del Icon" /> {/* Adjust width and height as needed */}
          <Box width="100px">Trash</Box>
        </Button>
      </Box>
    </>
  );
};

export default Trash;