"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAllFavorites, fetchAllArchivedNotes, fetchAllTrashNotes, fetchAllNotes, fetchFolderById } from "../Api/api";
import Card from "./card";
import { usePathname } from "next/navigation";
import { Box, Button, styled, Typography } from "@mui/material";

function Middletest() {
  const Mode = decodeURIComponent(usePathname().split("/").filter(Boolean)[0] || "");
  const folderId = decodeURIComponent(usePathname().split("/").filter(Boolean)[1] || "");

  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notes", Mode, folderId],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        let response;
        switch (Mode) {
          case "Favorites":
            response = await fetchAllFavorites(pageParam);
            break;
          case "Archive":
            response = await fetchAllArchivedNotes(pageParam);
            break;
          case "Trash":
            response = await fetchAllTrashNotes(pageParam);
            break;
          case "folder":
            response = await fetchAllNotes(folderId, pageParam);
            break;
          default:
            response = [];
        }
        const data = Array.isArray(response) ? response : response?.data || [];
        return {
          data,
          nextPage: data.length >= 10 ? pageParam + 1 : null
        };
      } catch (error) {
        console.error("Error fetching notes:", error);
        return { data: [], nextPage: null };
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    enabled: !!Mode,
  });

  const allNotes = notes?.pages.flatMap(page => 
    Array.isArray(page?.data) ? page.data : []
  ) || [];

  console.log("All notes:", allNotes);
  console.log("Has next page:", hasNextPage); 

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
        ) : allNotes.length > 0 ? (
          <>
            {allNotes.map((note) => (
              <Card
                key={note.id || Math.random().toString(36).substring(2, 9)}
                id={note.id || ""}
                title={note.title || "Untitled Note"}
                text={note.preview || ""}
                lastdate={note.updatedAt || ""}
                folderId={note.folder?.id || ""}
                folderName={note.folder?.name || ""}
                Mode={Mode}
              />
            ))}
            {hasNextPage && (
              <StyledButton 
                variant="contained" 
                fullWidth
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </StyledButton>
            )}
          </>
        ) : (
          <Typography variant="body1" color="gray">
            No Note Available
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Middletest;
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
  "&:disabled": {
    backgroundColor: "#1a1a1a",
    color: "#555",
  },
});