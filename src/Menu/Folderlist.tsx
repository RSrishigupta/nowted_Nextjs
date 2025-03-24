"use client";
import { Box, IconButton, List, ListItem, ListItemText, Typography, TextField } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import addfolder from "../assets/addfolder.svg";
import folderimg from "../assets/folder.svg";
import delimg from "../assets/del.svg";
import { fetchFolders, addFolder, deleteFolder, Folder } from "../Api/api";
import { useState } from "react";
import axios from "axios";

function FolderList() {
  const queryClient = useQueryClient(); // Access the cache
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");

  // Use the API call in React Query hooks
  const { data: folders = [], isLoading, isError, error } = useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  // Mutation for adding a folder
  const addFolderMutation = useMutation({
    mutationFn: addFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] }); // Refetch folders after adding
    },
  });

  // Mutation for deleting a folder
  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  // Mutation for editing a folder's name (PATCH request)
  const editFolderNameMutation = useMutation({
    mutationFn: async ({ folderId, name }: { folderId: string; name: string }) => {
      return await axios.patch(`https://nowted-server.remotestate.com/folders/${folderId}`, { name });
    },
    onSuccess: () => {
      // Invalidate both "folders" and "folderName" queries
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderName"] }); // Invalidate folderName query
      setEditingFolderId(null); // Stop editing mode after success
    },
  });

  // Handle entering edit mode on double-click
  const handleDoubleClick = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setFolderName(folder.name); // Set initial value for editing
  };

  // Handle submitting the new folder name (on pressing Enter or losing focus)
  const handleNameSubmit = (folderId: string) => {
    if (folderName.trim()) {
      editFolderNameMutation.mutate({ folderId, name: folderName.trim() });
    } else {
      setEditingFolderId(null); // Exit edit mode if input is empty
    }
  };

  if (isLoading) return <div>Loading folders...</div>;
  if (isError) return <div>Error: {error instanceof Error ? error.message : "An error occurred"}</div>;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" pr={2} pl={1} alignItems="center">
        <Typography variant="body1" color="white">
          Folders
        </Typography>
        <IconButton onClick={() => addFolderMutation.mutate()} color="primary">
          <Image src={addfolder} alt="add folder" />
        </IconButton>
      </Box>

      <List>
        {folders.map((folder) => (
          <Box key={folder.id} display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                py: 0.5,
                px: 2,
                transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
                "&:hover": {
                  backgroundColor: "#2d2d2d",
                  borderRadius: "2px",
                  transform: "translateY(-2px)", // Levitate the card
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Add shadow for depth
                },
              }}
            >
              {/* Editable Folder Name */}
              {editingFolderId === folder.id ? (
                <Box display="flex" alignItems="center" position="relative" width="100%">
                  <Image src={folderimg} alt="folder logo" style={{ marginRight: 8 }} /> {/* Folder logo remains visible */}

                  <TextField
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={() => handleNameSubmit(folder.id)} // Submit on losing focus
                    onKeyDown={(e) => e.key === "Enter" && handleNameSubmit(folder.id)} // Submit on Enter key
                    autoFocus
                    sx={{
                      input: {
                        color: "white", // Set white text color for input
                        width: "150px", // Adjust the input width to prevent it from taking too much space
                        padding: "2px 8px", // Compact padding for better fit
                        backgroundColor: "#1E3A8A", // Optional: Add background to make it visually distinct
                        borderRadius: "4px", // Rounded corners for smooth appearance
                      },
                      "& .MuiInputBase-root": {
                        padding: 0, // Remove unnecessary padding around the input
                      },
                    }}
                  />
                </Box>
              ) : (
                <Link href={`/folder/${folder.id}`} style={{ textDecoration: "none", color: "white", width: "100%" }}>
                  <Box display="flex" alignItems="center" gap={1} onDoubleClick={() => handleDoubleClick(folder)}>
                    <Image src={folderimg} alt="folder logo" />
                    <ListItemText primary={folder.name} />
                  </Box>
                </Link>
              )}

              <IconButton onClick={() => deleteFolderMutation.mutate(folder.id)}>
                <Image src={delimg} alt="delete" />
              </IconButton>
            </ListItem>
          </Box>
        ))}
      </List>
    </Box>
  );
}

export default FolderList;