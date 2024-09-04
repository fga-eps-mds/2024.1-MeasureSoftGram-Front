import { TextField, Grid, Box, Typography, Tooltip, Alert, Button, IconButton, Modal } from "@mui/material";
import { useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

interface WarningModalProps {
  text: string;
  btnText: string;
  isModalOpen: boolean;
  setIsModalOpen: any;
  handleBtnClick: any;
}

export default function WarningModal({ isModalOpen, btnText, text, handleBtnClick, setIsModalOpen }: WarningModalProps) {
  return <Modal
    open={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 2,
      paddingTop: 1
    }}>
      <>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3>Atenção</h3>
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Alert
          icon={<WarningIcon />}
          severity="warning"
          sx={{ margin: '10px 0' }}
        >
          {text}
        </Alert>
        <Box sx={{ width: '100%' }}>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBtnClick()}
            sx={{ width: '100%' }}
          >
            {btnText}
          </Button>
        </Box>
      </>

    </Box>
  </Modal>
}
