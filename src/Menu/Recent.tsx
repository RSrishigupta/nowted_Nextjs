"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import doc from "../assets/doc.svg";
import { useQuery } from "@tanstack/react-query";

interface DataType {
    id: string;
    folderId: string;
    title: string;
    folder: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
}

function Recent() {
    const RecentApi = "https://nowted-server.remotestate.com/notes/recent";
    const pathname = usePathname();

    const { data: recentNotes, isLoading, isError } = useQuery<DataType[]>({
        queryKey: ['recentNotes'],
        queryFn: async () => {
            const response = await axios.get(RecentApi);
            return response.data.recentNotes;
        },
    });

    const isActive = (noteId: string, folderId: string) => {
        return pathname === `/folder/${folderId}/Notes/${noteId}`;
    };

    if (isLoading) {
        return <Typography color="white">Loading...</Typography>;
    }

    if (isError) {
        return <Typography color="white">Error loading recent notes</Typography>;
    }

    return (
        <Box>
            <Typography variant="body1" color="white" pl={1} pt={1}>
                Recents
            </Typography>
            <List>
                {recentNotes?.map((note) => {
                    const active = isActive(note.id, note.folder.id);
                    return (
                        <ListItem
                            key={note.id}
                            component={Link}
                            href={`/folder/${note.folder.id}/Notes/${note.id}`}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                color:"white",
                                py: 0.5,
                                px: 2,
                                backgroundColor: active ? "#2d2d2d" : "transparent",
                                borderRadius: active ? "2px" : "0",
                                transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
                                "&:hover": {
                                    backgroundColor: "#2d2d2d",
                                    borderRadius: "2px",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                                },
                            }}
                        >
                            <Image src={doc} alt="document icon" />
                            <ListItemText 
                                primary={note.title} 
                               
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

export default Recent;