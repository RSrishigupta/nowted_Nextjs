"use client";
import { Box, IconButton, List, ListItem, ListItemText, Typography, TextField } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import addfolder from "../assets/addfolder.svg";
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import delimg from "../assets/del.svg";
import { fetchFolders, addFolder, deleteFolder, Folder } from "../Api/api";
import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

function FolderList() {
  const queryClient = useQueryClient();
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>("");
  const pathname = usePathname();
  const currentFolderId = pathname.split("/")[2];

  const { data: folders = [], isLoading, isError, error } = useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  const addFolderMutation = useMutation({
    mutationFn: addFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });

  const editFolderNameMutation = useMutation({
    mutationFn: async ({ folderId, name }: { folderId: string; name: string }) => {
      return await axios.patch(`https://nowted-server.remotestate.com/folders/${folderId}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["folderName"] });
      setEditingFolderId(null);
    },
  });

  const handleDoubleClick = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setFolderName(folder.name);
  };

  const handleNameSubmit = (folderId: string) => {
    if (folderName.trim()) {
      editFolderNameMutation.mutate({ folderId, name: folderName.trim() });
    } else {
      setEditingFolderId(null);
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
        <IconButton onClick={() => addFolderMutation.mutate()}>
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
                backgroundColor: currentFolderId === folder.id ? "#3a3a3a" : "transparent",
                transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
                "&:hover": {
                  backgroundColor: "#2d2d2d",
                  borderRadius: "2px",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {editingFolderId === folder.id ? (
                <Box display="flex" alignItems="center" position="relative" width="100%">
                  <FolderOutlinedIcon />
                  <TextField
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={() => handleNameSubmit(folder.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleNameSubmit(folder.id)}
                    autoFocus
                    sx={{
                      input: {
                        color: "white",
                        width: "150px",
                        padding: "2px 8px",
                        backgroundColor: "#1E3A8A",
                        borderRadius: "4px",
                      },
                      "& .MuiInputBase-root": {
                        padding: 0,
                      },
                    }}
                  />
                </Box>
              ) : (
                <Link href={`/folder/${folder.id}`} style={{ textDecoration: "none", color: "white", width: "100%" }}>
                  <Box display="flex" alignItems="center" gap={1} onDoubleClick={() => handleDoubleClick(folder)}>
                    <FolderOutlinedIcon />
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