import { Box, Typography } from '@mui/material';
import def from "../assets/default.svg"
import Image from 'next/image';

function DefaultPage() {
 return (
  <Box
   display="flex"
   flexDirection="column"
   justifyContent="center"
   alignItems="center"
   height="100vh"
   p={3}
   gap={2} 
  >
   
  <Image src={def} alt='select note'/>
   <Typography variant="h4" fontWeight="bold" textAlign="center" color='white'>
    Select a Note to View
   </Typography>
   <Typography variant="body1" textAlign="center" color='white'>
    Choose a note from the list on the left to view its contents,
    or create a new note to add to your collection.
   </Typography>
  </Box>
 );
}

export default DefaultPage;
