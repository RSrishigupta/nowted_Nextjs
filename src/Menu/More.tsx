import archive from "../assets/archive.svg"
import fav from "../assets/fav.svg"
import del from "../assets/del.svg"
import { Box, Typography } from "@mui/material"
import Link from "next/link"
import Image from "next/image"
function More() {

    return (
        <Box display="flex" flexDirection="column" gap={1.5}>
            <Typography variant="body1" pt={1} pl={1} color="white">More</Typography>
            <Link
                href="/Favorites"
                style={{ textDecoration: "none", color: "white", display: "block" }}>
                <Box display="flex" alignItems="center" gap={2} px={2}
                    sx={{
                        "&:hover": { backgroundColor: "#2d2d2d",borderRadius:"2px" },
                        width: "100%",
                        py:0.5
                    }}>
                    <Image src={fav} alt="fav" />
                    <Typography>Favorites</Typography>
                </Box>
            </Link>

            <Link
                href="/Archive"
                style={{ textDecoration: "none", color: "white", display: "block" }}>
                <Box display="flex" alignItems="center" gap={2} px={2}
                    sx={{
                        "&:hover": { backgroundColor: "#2d2d2d",borderRadius:"2px" },
                        width: "100%",
                        py:0.5
                    }}>
                    <Image src={archive} alt="fav" />
                    <Typography>Archive</Typography>
                </Box>
            </Link>
            <Link
                href="/Trash"
                style={{ textDecoration: "none", color: "white", display: "block" }}>
                <Box display="flex" alignItems="center" gap={2} px={2}
                    sx={{
                     
                        "&:hover": { backgroundColor: "red" },
                        width: "100%",
                        py:0.5
                    }}>
                    <Image src={del} alt="fav" />
                    <Typography>Trash</Typography>
                </Box>
            </Link>
        </Box>

    )
}

export default More
