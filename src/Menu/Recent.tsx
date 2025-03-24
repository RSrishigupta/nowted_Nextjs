"use client"; // Ensures this is a Client Component in Next.js
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import doc from "../assets/doc.svg";
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
    const [recentNotes, setRecentNotes] = useState<DataType[]>([]);

    const fetchRecentData = async () => {
        try {
            const response = await axios.get(RecentApi);
            setRecentNotes(response.data.recentNotes);
        } catch (error) {
            console.error("Error fetching recent notes:", error);
        }
    };
    useEffect(() => {
        fetchRecentData();
    }, []);

    return (
        <Box>
            <Typography variant="body1" color="white" pl={1} pt={1}>
                Recents
            </Typography>
            <List>
                {recentNotes.map((note) => (
                    <ListItem
                        key={note.id}
                        component={Link}
                        href={`/folder/${note.folder.id}/Notes/${note.id}`}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "white",
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
                        <Image src={doc} alt="document icon" />
                        <ListItemText primary={note.title} />
                    </ListItem>
                ))}
            </List>

        </Box>
    );
}

export default Recent;
