import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { useState } from 'react';

export const CompaniesSearch = ({ setSearchQuery }) => {
  const [searchQuery, setSearchQueryInternal] = useState('');

  const handleSearchInputChange = (event) => {
    setSearchQueryInternal(event.target.value);
    setSearchQuery(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search class"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        onChange={handleSearchInputChange}
        sx={{ maxWidth: 500 }}
      />
    </Card>
  );
};
