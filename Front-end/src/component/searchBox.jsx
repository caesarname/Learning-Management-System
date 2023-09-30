
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { Box } from '@mui/system';

export const SearchBox = () => (
  <Box>
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search courses"
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
          </SvgIcon>
        </InputAdornment>
      )}
    />
  </Card>
  </Box>
);