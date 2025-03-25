"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAllFavorites, fetchAllArchivedNotes, fetchAllTrashNotes, fetchAllNotes, fetchFolderById } from "../Api/api";
import Card from "./card";
import { usePathname } from "next/navigation";
import { Box, Button, styled, Typography } from "@mui/material";

interface DataTypes {
  id: string;
  folderId: string;
  title: string;
  preview: string;
  updatedAt: string;
  folder: {
    id: string;
    name: string;
  };
}

function Middlecomponent() {
  const Mode = decodeURIComponent(usePathname().split("/").filter(Boolean)[0] || "");
  const folderId = decodeURIComponent(usePathname().split("/").filter(Boolean)[1] || "");

  const { data: notes = [], isLoading: notesLoading, error: notesError } = useQuery({
    queryKey: ["notes", Mode, folderId],
    queryFn: async () => {
      switch (Mode) {
        case "Favorites":
          return await fetchAllFavorites();
        case "Archive":
          return await fetchAllArchivedNotes();
        case "Trash":
          return await fetchAllTrashNotes();
        case "folder":
          return await fetchAllNotes(folderId);
        default:
          return [];
      }
    },
    enabled: !!Mode, 
  });

  const { data: folderName } = useQuery({
    queryKey: ["folderName", folderId],
    queryFn: () => fetchFolderById(folderId),
    enabled: !!folderId && Mode === "folder", 
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      bgcolor="#1C1C1C"
      minWidth="25vh"
      p={1}
      position="relative"
      height="100vh"
    >
      <Typography variant="h5" color="white">
        {Mode === "folder" ? folderName : Mode}
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        height="90vh"
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#2C2C2C",
          },
        }}
      >
        {notesLoading ? (
          <Typography variant="body1" color="gray">
            Loading notes...
          </Typography>
        ) : notesError ? (
          <Typography variant="body1" color="red">
            Error fetching notes.
          </Typography>
        ) : notes.length > 0 ? (
          notes.map((note: DataTypes) => (
            <Card
              key={note.id}
              id={note.id}
              title={note.title}
              text={note.preview}
              lastdate={note.updatedAt}
              folderId={note.folder?.id ?? ""}
              folderName={note.folder?.name ?? ""}
              Mode={Mode}
            />
          ))
        ) : (
          <Typography variant="body1" color="gray">
            No Note Available
          </Typography>
        )}
        <StyledButton variant="contained" fullWidth>
          Load More
        </StyledButton>
      </Box>
    </Box>
  );
}

export default Middlecomponent;
const StyledButton = styled(Button)({
  backgroundColor: "#1f1f1f",
  color: "white",
  fontSize: "1rem",
  borderRadius: "4px",
  transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s", 
  "&:hover": {
    backgroundColor: "#2d2d2d", 
    transform: "translateY(-2px)", 
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", 
  },
});