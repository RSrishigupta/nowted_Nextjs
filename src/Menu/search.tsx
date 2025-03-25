import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Paper, List, ListItem, Typography } from '@mui/material';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  folder: {
    id: string;
  }
}

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    searchedNotes();
  }, []);

  const searchedNotes = async () => {
    try {
      const response = await axios.get<{ notes: Note[] }>(
        'https://nowted-server.remotestate.com/notes?archived=false&deleted=false&limit=*'
      );
      setNotes(response.data.notes); 
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredNotes([]); 
    } else {
      const filtered = notes.filter((note) =>
        note.title.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Search Term:', searchTerm);
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
              padding: '8px 14px', 
              fontSize: '14px',  
            },
            '& .MuiOutlinedInput-root': {
              height: '40px', 
            },
          }}
        />
      </form>

      {filteredNotes.length > 0 && (
        <Paper
          style={{
            position: 'absolute',
            top: '100%', 
            left: 0,
            background: "#2d2d2d",
            color: "white",
            right: 0,
            maxHeight: '30vh', 
            overflowY: 'auto', 
            zIndex: 2, 
            marginTop: '8px', 
            
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
                    transform: 'translateY(-2px)', 
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)', 
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

      {searchTerm.trim() !== '' && filteredNotes.length === 0 && (
        <Typography variant="body1" color='white' style={{ marginTop: '8px' }}>
          No notes found for &quot;{searchTerm}&quot;.
        </Typography>
      )}
    </div>
  );
};

export default Search;