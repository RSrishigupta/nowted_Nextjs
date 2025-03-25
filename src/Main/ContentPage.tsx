"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NoteDataCard from "./NoteDataCard";
import Restore from "./Restore";
import DefaultPage from "@/Middle/defaultPage";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface DataTypes {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isArchived: boolean;
  isFavorite: boolean;
  namefolder: string;
  deletedAt: string | null;
  folder: {
    id: string;
    name: string;
  };
}

async function fetchNoteData(notesId: string): Promise<DataTypes> {
  const response = await axios.get(`https://nowted-server.remotestate.com/notes/${notesId}`);
  return response.data.note;
}

function ContentPage() {
  const param = useParams();
  const notesId = param.id as string;

  const { data: contentdata, isLoading, isError } = useQuery<DataTypes>({
    queryKey: ["noteData", notesId],
    queryFn: () => fetchNoteData(notesId),
    enabled: Boolean(notesId),
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", 
        }}
      >

        <CircularProgress
          size={100} 
          thickness={5} 
          color="primary"
          sx={{
            '&.MuiCircularProgress-root': {
              width: '50px !important', 
              height: '50px !important',
              color: "white",
            }
          }}
        />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "error.main",
        }}
      >
        Error loading the note.
      </Box>
    );
  }

  return (
    <>
      {contentdata ? (
        contentdata.deletedAt ? (
          <Restore />
        ) : (
          <div>
            <NoteDataCard
              id={contentdata.id}
              namefolder={contentdata.folder.name}
              folderid={contentdata.folder.id}
              title={contentdata.title}
              content={contentdata.content}
              createdAt={contentdata.createdAt}
              isFavorite={contentdata.isFavorite}
              isArchived={contentdata.isArchived}
            />
          </div>
        )
      ) : (
        <DefaultPage />
      )}
    </>
  );
}

export default ContentPage;