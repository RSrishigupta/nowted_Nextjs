"use client";
import { createNote } from "@/Api/api";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { useParams } from "next/navigation";

const StyledButton = styled(Button)({
  backgroundColor: "#2d2d2d",
  color: "white",
  fontSize: "1rem",
  borderRadius: "4px",
  transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s",
  "&:hover": {
    backgroundColor: "#1a1a1a", 
    transform: "translateY(-2px)",
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", 
  },
});

function CreateNote() {
  const { folderId } = useParams() as { folderId: string };
  const queryClient = useQueryClient(); 

  const mutation = useMutation({
    mutationFn: () => createNote(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });

  return (
    <Box px={1}>
      <StyledButton variant="contained" fullWidth onClick={() => mutation.mutate()}>
        + New Note
      </StyledButton>
    </Box>
  );
}

export default CreateNote;