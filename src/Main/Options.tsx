import React, { useState } from 'react';
import { Button, Menu, MenuItem, styled } from '@mui/material';
import Favbtn from './Favbtn';
import Archivebtn from './Archivebtn';
import Trash from './Trashbtn';
import { usePathname } from 'next/navigation';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
interface OptionProps {
  id: string;
  title: string;
  folderid: string;
  isArchived: boolean;
  isFavorite: boolean;
  foldername: string;
}

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#2d2d2d',
    color: theme.palette.common.white,
    marginTop: '30px',

  },
}));
const Options = ({ id, isFavorite, isArchived, folderid, foldername, title }: OptionProps) => {
  const Mode = decodeURIComponent(usePathname().split("/").filter(Boolean)[0] || "");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} style={{ position: 'absolute', top: '15px', right: '10px', color: "white" }}>
        {anchorEl ?
          <CloseOutlinedIcon />
          :
          <MenuOutlinedIcon />
        }</Button>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Favbtn id={id} isFav={isFavorite} folderid={folderid} foldername={foldername} Mode={Mode} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Archivebtn id={id} isArc={isArchived} folderid={folderid} Mode={Mode} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Trash id={id} title={title} folderid={folderid} foldername={foldername} />
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default Options;
