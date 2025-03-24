"use client";

import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import Link from "next/link";

interface CardProps {
  id: string;
  title: string;
  text: string;
  lastdate: string;
  folderId: string;
  folderName: string;
  Mode: string;
}

function Card({ title, text, lastdate, id, folderId, Mode }: CardProps) {
  const path = Mode === "folder" ? `/folder/${folderId}/Notes/${id}` : `/${Mode}/${id}`;

  return (
    <Link href={path} passHref style={{ textDecoration: "none" }}>
      <MuiCard
        sx={{
          backgroundColor: "#2d2d2d",
          color: "white",
          borderRadius: 1,
          cursor: "pointer",
          padding: "0",
          marginRight: "5px",
          textAlign: "left",
          transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s", // Smooth transition for hover effects
          "&:hover": {
            backgroundColor: "#1a1a1a", // Change to blackish-grey on hover
            transform: "translateY(-2px)", // Levitate the card
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)", // Add shadow for depth
          },
        }}
      >
        <CardContent
          sx={{
            padding: "8px",
          }}
        >
          <Typography variant="body1">{title}</Typography>
          <Typography variant="body2">
            {new Date(lastdate).toLocaleDateString("en-GB")}
            &nbsp; &nbsp; {text.slice(0, 50) + "..."}
          </Typography>
        </CardContent>
      </MuiCard>
    </Link>
  );
}

export default Card;