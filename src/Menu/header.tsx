import { useState } from "react";
import { Stack, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.svg";
import CreateNote from "./CreateNote";
import Search from "./search";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        pt={1}
        pl={1}
      >
        <Link href="/">
          <Image src={logo} alt="logo" />
        </Link>

        <Button onClick={handleSearchClick} color="inherit">
        {showSearch ?  
       <CloseOutlinedIcon/>
        :  
        <SearchOutlinedIcon/>
        }
        </Button>
      </Stack>

      {showSearch ? <Search /> : <CreateNote />}
    </>
  );
}