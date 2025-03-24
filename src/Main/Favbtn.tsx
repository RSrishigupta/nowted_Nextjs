import React, { useState } from 'react';
import axios from 'axios';
// import Link from 'next/link';
import Image from 'next/image';
import { Button, Box } from '@mui/material';
import fav from '../../src/assets/fav.svg';
// import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface FavbtnProps {
  isFav: boolean;
  id: string;
  folderid: string;
  foldername: string;
  Mode:string;
}

const Favbtn: React.FC<FavbtnProps> = ({ isFav, id , Mode }) => {
  const [isfav, setIsfav] = useState(isFav);
  // const { folderId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateFavoriteMutation = useMutation({
    mutationFn: async (newFavState: boolean) => {
      await axios.patch(
        `https://nowted-server.remotestate.com/notes/${id}`,
        { isFavorite: newFavState }
      );
      return newFavState;
    },
    onMutate: (newFavState) => {
      setIsfav(newFavState);
    },
    onError: () => {
      setIsfav(!isfav);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['noteData', id] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (Mode==="Favorites") {
        router.push("/Favorites")
        
      }
    },
  });

  const isFavchange = async (): Promise<void> => {
    const newFavState = !isfav;
    updateFavoriteMutation.mutate(newFavState);
  };   
  // const href = Mode === "Archive" ? "/Archive" : Mode === "Favorites" ? "/Favorites" : `/${Mode}/${folderid}/Notes/${id}`;
  return (
    <Box>
      <Box
        // href={folderId ? `/folder/${folderid}/Notes/${id}` : `/${Mode}`}
      // href={href}
        // passHref
        // legacyBehavior
      >
        <Button
          onClick={isFavchange}
          sx={{
            display: 'flex',
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
          <Image src={fav} alt="Favorite Icon" />
          {isFav ? 'Remove from Fav' : 'Add to Favorite'}
        </Button>
      </Box>
    </Box>
  );
};

export default Favbtn;