import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography ,Button,Grid} from '@mui/material';
import {ClassPage} from "../classPage";
import Link from 'next/link';
import { useParams } from 'react-router-dom';
export const TeacherCard = ({company, index}) => {
    let {id:courseid} = useParams();


    let newlink='https://www.google.com'
    if (company.link === "null") {
        newlink= `http://localhost:3000/UploadUrl/${courseid}/${company.classid}`
    }
    else{
        newlink= `https://studio.youtube.com/channel/${company.link}/livestreaming`
    }
  
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >

          <Avatar
            src={company.logo}
            variant="square"
          />
          
        </Box>

        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {company.location}
        </Typography>


<Grid container spacing={2} justifyContent="center" alignItems="center">
  <Grid item>
    <Typography align="center" variant="body1" color="textPrimary">
      {company.teacher_name}
    </Typography>
  </Grid>
  <Grid item xs={12} />
  <Grid item>
    

<Button variant="contained" href={newlink} sx={{
    color: 'white !important',
  }}>
  Join the course
</Button>


  </Grid>
</Grid>
        
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            {company.class_time} 
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
        </Stack>
      </Stack>
    </Card>
  );
};

TeacherCard.propTypes = {
  company: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};