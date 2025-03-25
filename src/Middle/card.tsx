"use client";

import { Card as MuiCard, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const path = Mode === "folder" ? `/folder/${folderId}/Notes/${id}` : `/${Mode}/${id}`;
  const isActive = pathname === path;

  return (
    <Link href={path} passHref style={{ textDecoration: "none" }}>
      <MuiCard
        sx={{
          backgroundColor: isActive ? "#1a1a1a" : "#2d2d2d",
          color: "white",
          borderRadius: 1,
          cursor: "pointer",
          padding: "0",
          marginRight: "5px",
          textAlign: "left",
          borderLeft: isActive ? "4px solid #2d2d2d" : "4px solid transparent",
          transition: "transform 0.3s, box-shadow 0.3s, background-color 0.3s, border-left 0.3s",
          "&:hover": {
            backgroundColor: isActive ? "black" : "#1a1a1a",
            transform: "translateY(-2px)",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <CardContent
          sx={{
            padding: "8px",
          }}
        >
          <Typography variant="body1" fontWeight={isActive ? "bold" : "normal"}>
            {title}
          </Typography>
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