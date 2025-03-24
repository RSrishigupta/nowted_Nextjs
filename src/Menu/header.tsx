import { useState } from "react";
import { Stack, Button } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.svg";
import searchicon from "../assets/search.svg";
import close from "../assets/close.svg";
import CreateNote from "./CreateNote";
import Search from "./search";

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

        <Button onClick={handleSearchClick}>
        {showSearch ?  
        <Image src={close} alt="close icon" width="20"  /> 
        :  
        <Image src={searchicon} alt="search icon" width="20"  />}
        </Button>
      </Stack>

      {showSearch ? <Search /> : <CreateNote />}
    </>
  );
}