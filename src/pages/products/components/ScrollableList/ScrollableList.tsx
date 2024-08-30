import React, { useRef, useState } from 'react';
import { List, ListItem, IconButton, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Organization } from '@customTypes/organization';


interface ScrollableListProps {
  organizationList: Organization[];
  onSelect: (organization: Organization) => void;
}

const ScrollableList: React.FC<ScrollableListProps> = ({ organizationList, onSelect }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleScrollUp = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: -50, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: 50, behavior: 'smooth' });
    }
  };

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    onSelect(organizationList[index]);
  };

  console.log({ organizationList })

  return (
    <Box sx={{ width: 200, maxHeight: 350, overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton onClick={handleScrollUp}>
          <ArrowUpwardIcon />
        </IconButton>
      </Box>

      <Box ref={listRef} sx={{ maxHeight: 250, overflowY: 'auto', mt: 1, mb: 1 }}>
        <List>
          {organizationList.map((organization, index) => (
            <ListItem
              key={organization.id}
              onClick={() => handleItemClick(index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: selectedIndex === index ? '#2B4D6F' : 'inherit',
                '&:hover': { backgroundColor: '#F4F5F6' }
              }}
            >
              {organization.name}
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <IconButton onClick={handleScrollDown}>
          <ArrowDownwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ScrollableList;
