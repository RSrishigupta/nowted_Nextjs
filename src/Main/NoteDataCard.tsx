"use client";

import { Box, MenuItem, Select, TextareaAutosize, TextField, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
import Options from "./Options";
import date from "../assets/date.svg";
import folderimage from "../assets/folder.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CardProps {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isArchived: boolean;
  isFavorite: boolean;
  namefolder: string;
  folderid: string;
}

interface FolderData {
  id: string;
  name: string;
}

const fetchFolders = async (): Promise<FolderData[]> => {
  const response = await axios.get("https://nowted-server.remotestate.com/folders");
  return response.data.folders;
};

function NoteDataCard({
  id,
  title,
  content,
  createdAt,
  isArchived,
  isFavorite,
  namefolder,
  folderid,
}: CardProps) {
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  const { data: folders = [] } = useQuery<FolderData[]>({
    queryKey: ["folders"],
    queryFn: fetchFolders,
  });

  const updateNote = useMutation({
    mutationFn: async (updatedData: Partial<{ title: string; content: string; folderId: string }>) => {
      return await axios.patch(`https://nowted-server.remotestate.com/notes/${id}`, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleTitleChange = () => {
    setIsEditingTitle(false);
    if (localTitle !== title) updateNote.mutate({ title: localTitle });
  };

  const handleContentChange = () => {
    setIsEditingContent(false);
    if (localContent !== content) updateNote.mutate({ content: localContent });
  };
  const router = useRouter();
  const handleFolderChange = (e: SelectChangeEvent<string>) => {
    const selectedFolderName = e.target.value;
    const selectedFolder = folders.find((folder) => folder.name === selectedFolderName);
    if (selectedFolder && selectedFolder.id !== folderid) {
      updateNote.mutate({ folderId: selectedFolder.id });
      router.push(`/folder/${selectedFolder.id}/Notes/${id}`)
    }
  };

  return (
    <Box p={3} display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="space-between" width="100%">
        {isEditingTitle ? (
          <TextField
            variant="standard"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleTitleChange}
            autoFocus
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                color: 'white', 
                fontSize: '2.125rem',
                fontWeight: 500, 
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
                padding: 0, 
              },
              '& .MuiInputBase-root': {
                padding: 0, 
              },
            }}
          />
        ) : (
          <Typography variant="h4" onDoubleClick={() => setIsEditingTitle(true)}>
            {localTitle || "Enter title..."}
          </Typography>
        )}
      </Box>

      <Options id={id} isFavorite={isFavorite} isArchived={isArchived} folderid={folderid} title={title} foldername={namefolder} />

      <Box display="flex" alignItems="center" gap={2}>
        <Image src={date} alt="Date Icon" priority style={{ paddingBottom: "4px" }} />
        <Typography variant="body2">Date :</Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ textDecoration: "underline" }}>
          {new Date(createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2}>
        <Image src={folderimage} alt="Folder Icon" priority style={{ paddingBottom: "4px" }} />
        <Typography variant="body2">Folder :</Typography>
        <Select
          value={namefolder}
          onChange={handleFolderChange}
          variant="outlined"
          size="small"
          sx={{
             

            backgroundColor: 'transparent', 
            color: 'white', 
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                
                height:"40vh",
                backgroundColor: '#2d2d2d', 
                color: 'white',
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "darkgrey",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "#2C2C2C",
                },
              },
            },
          }}
        >
          {folders.map((folder) => (
            <MenuItem key={folder.id} value={folder.name} sx={{ color: 'white' ,
              "&:hover": {
                backgroundColor: "#1f1f1f",
                borderRadius: "2px",
                transform: "translateY(-2px)", 
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", 
              },
            }}>
              {folder.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box width="100%" sx={{ borderBottom: "1px solid darkgrey" }} />

      <Box sx={{
        overflow: "auto",
        maxHeight: "68vh",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "darkgrey",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#2C2C2C",
        },
      }}>
        {isEditingContent ? (
          <TextareaAutosize
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={handleContentChange}
            autoFocus
            style={{
              minHeight: "63vh",
              backgroundColor: "#1A1A1A",
              border: "none",
              outline: "none",
              color: "white",
              width: "100%",
              padding: "8px",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
              fontSize: "1rem", 
              fontWeight: 400, 
              lineHeight: "1.5",
              resize: "none", 
            }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              width: "100%",
              minHeight: "68vh",
              backgroundColor: "black",
              padding: "8px",
              color: "white",
              whiteSpace: "pre-wrap",
              cursor: "pointer",
            }}
            onDoubleClick={() => setIsEditingContent(true)}
          >
            {localContent || "Enter content..."}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default NoteDataCard;