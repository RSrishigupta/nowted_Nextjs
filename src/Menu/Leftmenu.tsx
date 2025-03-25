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
            <Box>
                <Header />
                <Recent />
            </Box>

            <Box
                flexGrow={1}
                overflow="auto"
                minHeight="30vh"
                sx={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },

                    "&::-webkit-scrollbar-thumb": {
                        background: "#555",
                        borderRadius: "10px",
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
