import { Box } from "@mui/material";
import Header from "./header";
import Recent from "./Recent";
import Folderlist from "./Folderlist";
import More from "./More";
function Leftmenu() {

    return (
        <Box
           
            display="flex"
            flexDirection="column"
            height="100vh">
            {/* Box 1 - Top Section */}
            <Box>
                <Header />
                <Recent />
            </Box>

            {/* Box 2 - Middle Section (Expandable with Custom Scrollbar) */}
            <Box
                flexGrow={1}
                overflow="auto"
                minHeight="30vh"
                sx={{
                    "&::-webkit-scrollbar": {
                        width: "6px", // Thin width
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#555", // Slightly lighter gray thumb
                        borderRadius: "10px", // Rounded corners
                    },

                }}
            >
                <Folderlist />
            </Box>

            <Box>
                <More />
            </Box>
        </Box>


    );
}

export default Leftmenu;
