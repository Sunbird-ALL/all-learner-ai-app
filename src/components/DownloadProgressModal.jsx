import React from 'react';
import { Box, Typography, LinearProgress, Modal } from '@mui/material';

const DownloadProgressModal = ({ open, progress }) => {
  return (
    <Modal open={open} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Downloading Model...
        </Typography>
        <LinearProgress variant="determinate" value={Number(progress)} sx={{ mt: 2, mb: 2 }} />
        <Typography variant="body1">
          {progress}% downloaded
        </Typography>
      </Box>
    </Modal>
  );
};

export default DownloadProgressModal;
