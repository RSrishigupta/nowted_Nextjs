import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Paper, List, ListItem, Typography } from '@mui/material';
import Link from 'next/link';

// Define the type for a note
interface Note {
  id: string;
  title: string;
  folder: {
    id: string;
  }
  // Add other fields if necessary, e.g., content, tags, etc.
}

const Search: React.FC = () => {
  // State to manage the search term
  const [searchTerm, setSearchTerm] = useState<string>('');
  // State to store the fetched notes
  const [notes, setNotes] = useState<Note[]>([]);
  // State to store filtered notes based on the search term
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  // Fetch notes when the component mounts
  useEffect(() => {
    searchedNotes();
  }, []);

  // Function to fetch notes from the API
  const searchedNotes = async () => {
    try {
      const response = await axios.get<{ notes: Note[] }>(
        'https://nowted-server.remotestate.com/notes?archived=false&deleted=false&limit=*'
      );
      setNotes(response.data.notes); // Set the fetched notes
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Function to handle input changes and filter notes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter notes based on the search term
    if (term.trim() === '') {
      setFilteredNotes([]); // Clear filtered notes if the search term is empty
    } else {
      const filtered = notes.filter((note) =>
        note.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredNotes(filtered); // Set filtered notes
    }
  };

  // Function to handle form submission (optional)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Search Term:', searchTerm); // You can replace this with your search logic
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          variant="outlined"
          autoFocus
          sx={{
            '& .MuiInputBase-input': {
              color: 'white',
              padding: '8px 14px', // Adjust padding to reduce height
              fontSize: '14px',    // Adjust font size if needed
            },
            '& .MuiOutlinedInput-root': {
              height: '40px', // Set a specific height for the TextField
            },
          }}
        />
      </form>

      {/* Display filtered notes */}
      {filteredNotes.length > 0 && (
        <Paper
          style={{
            position: 'absolute',
            top: '100%', // Position below the search input
            left: 0,
            background: "#2d2d2d",
            color: "white",
            right: 0,
            maxHeight: '30vh', // Fixed height
            overflowY: 'auto', // Enable scrolling if content exceeds height
            zIndex: 2, // Ensure it floats on top of other content
            marginTop: '8px', // Add some spacing
            
          }}
          sx={{
            
            overflow: "auto",
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
          }}
        >
          <List>
            {filteredNotes.map((note) => (
              <ListItem
                key={note.id}
                sx={{
                  transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.2s',
                  '&:hover': {
                    backgroundColor: '#1f1f1f',
                    borderRadius: '2px',
                    transform: 'translateY(-2px)', // Levitate the card
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)', // Add shadow for depth
                  },
                }}
              >
                <Link
                  href={`/folder/${note.folder.id}/Notes/${note.id}`}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  <Typography>{note.title}</Typography>
                </Link>

              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Display a message if no notes match the search term */}
      {searchTerm.trim() !== '' && filteredNotes.length === 0 && (
        <Typography variant="body1" color='white' style={{ marginTop: '8px' }}>
          No notes found for &quot;{searchTerm}&quot;.
        </Typography>
      )}
    </div>
  );
};

export default Search;