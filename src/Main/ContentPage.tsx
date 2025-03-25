"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NoteDataCard from "./NoteDataCard";
import Restore from "./Restore";
import DefaultPage from "@/Middle/defaultPage";

interface DataTypes {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isArchived: boolean;
  isFavorite: boolean;
  namefolder: string;
  deletedAt: string | null; // Ensure deletedAt can be null
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
  const notesId = param.id as string; // Handle id as a string

  const { data: contentdata, isLoading, isError } = useQuery<DataTypes>({
    queryKey: ["noteData", notesId],
    queryFn: () => fetchNoteData(notesId),
    enabled: Boolean(notesId),
  });

  if (isLoading) return <p>Loading...</p>; // Optional loading state
  if (isError) return <p>Error loading the note.</p>; // Optional error handling

  return (
    <>
      {contentdata ? (
        contentdata.deletedAt ? ( // Handle the deletedAt field safely
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
