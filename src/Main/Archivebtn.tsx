import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Box } from '@mui/material';
import archive from '../assets/archive.svg';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ArchivebtnProps {
  isArc: boolean;
  id: string;
  folderid: string;
  Mode: string;
}

const Archivebtn = ({ isArc, id, folderid, Mode }:ArchivebtnProps) => {
  const [isarc, setIsarc] = useState(isArc);
  const queryClient = useQueryClient();

  const archiveMutation = useMutation({
    mutationFn: async (newArchiveState: boolean) => {
      await axios.patch(
        `https://nowted-server.remotestate.com/notes/${id}`,
        { isArchived: newArchiveState },
      );
      return newArchiveState;
    },
    onMutate: (newArchiveState) => {
      setIsarc(newArchiveState);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      alert('Notes Archived Successfully');
    },
    onError: () => {
      setIsarc(!isarc);
      console.error('Error archiving note');
    },
  });

  const handleArchive = async (): Promise<void> => {
    const newArchiveState = !isarc;
    archiveMutation.mutate(newArchiveState);
  };

  const href = Mode === "Archive" ? "/Archive" : Mode === "Favorites" ? "/Favorites" : `/${Mode}/${folderid}`;

  return (
    <Box>
      <Link
        href={href}
        passHref
        legacyBehavior
      >
        <Button
          onClick={handleArchive}
          fullWidth
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '12px',
            '&:hover': {
              backgroundColor: '#6b7280',
            },
            borderRadius: '4px',
            cursor: 'pointer',
            textTransform: 'none',
            color: 'inherit',
          }}
        >
          <Image src={archive} alt="Archive Icon" width={20} height={20} />
          <Box width="100px">{isarc ? 'Unarchive' : 'Archive'}</Box>
        </Button>
      </Link>
    </Box>
  );
};

export default Archivebtn;