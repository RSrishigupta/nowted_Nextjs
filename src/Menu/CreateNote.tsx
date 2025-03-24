"use client";
import { createNote } from "@/Api/api";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { useParams } from "next/navigation";

const StyledButton = styled(Button)({
  backgroundColor: "#2d2d2d",
  color: "white",
  fontSize: "1rem",
  borderRadius: "4px",
  transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s", // Smooth transition for hover effects
  "&:hover": {
    backgroundColor: "#1a1a1a", // Change background color to blue on hover
    transform: "translateY(-2px)", // Move the button upward to create levitation
    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Add a stronger shadow for depth
  },
});

function CreateNote() {
  const { folderId } = useParams() as { folderId: string };
  const queryClient = useQueryClient(); // Initialize queryClient

  const mutation = useMutation({
    mutationFn: () => createNote(folderId),
    onSuccess: () => {
      // Invalidate the "notes" query to trigger a refetch
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