import { Box, Button, Typography } from "@mui/material";
import restore from "../assets/restore.svg";
import axios from "axios";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DataTypes {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isArchived: boolean;
  isFavorite: boolean;
  namefolder: string;
  folder: {
    id: string;
    name: string;
  };
}
// agr mode trash h to redirect ho jae folder is par
function Restore() {
  const Mode = decodeURIComponent(usePathname().split("/").filter(Boolean)[0] || "");
  const notesId = usePathname().split('/').pop();
  const queryClient = useQueryClient();
  // Fetch note data using React Query
  const { data: contentdata } = useQuery<DataTypes>({
    queryKey: ['note', notesId],
    queryFn: async () => {
      if (!notesId) return null;
      const response = await axios.get(`https://nowted-server.remotestate.com/notes/${notesId}`);
      return response.data.note;
    },
    enabled: !!notesId,
  });
  const router = useRouter();
  const restoreMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`https://nowted-server.remotestate.com/notes/${notesId}/restore`);
    },
    onSuccess: () => {
      alert(`Note restored successfully: ${contentdata?.title}`);
      queryClient.invalidateQueries({ queryKey: ['noteData'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      if (Mode === "Trash") { router.push(`/folder/${contentdata?.folder.id}/Notes/${contentdata?.id}`) }
    },
    onError: (error) => {
      console.error('Error restoring note:', error);
    },
  });

  const handleRestore = () => {
    restoreMutation.mutate();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '48px',
        gap: '20px',
      }}
    >
      <Box>
        <Image src={restore} alt="Default View" />
      </Box>

      <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
        Restore &quot;{contentdata?.title}&quot;
      </Typography>

      <Typography variant="body1" sx={{ textAlign: 'center', px: '80px' }}>
        Don&apos;t want to lose this note? It&apos;s not too late! Just click the Restore button and it
        will be added back to your list. It&apos;s that simple.
      </Typography>
      <Box>
        <Button
          variant="contained"
          onClick={handleRestore}
          disabled={restoreMutation.isPending}
          sx={{
            border: '1px solid',
            py: '8px',
            px: '16px',
            borderRadius: '8px',
            backgroundColor: '#1f1f1f',
            transition: 'all 0.2s ease-in-out', 
            '&:hover': {
              backgroundColor: '#2d2d2d',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              filter: 'brightness(1.1)', 
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
        </Button>
      </Box>
    </Box>
  );
}

export default Restore;