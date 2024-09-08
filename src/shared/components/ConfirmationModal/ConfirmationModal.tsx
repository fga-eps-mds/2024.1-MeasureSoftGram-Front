import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from 'react-i18next';

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  itemName: string;
  onConfirm: () => void;
  confirmationName: string;
  setConfirmationName: (name: string) => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  itemName,
  onConfirm,
  confirmationName,
  setConfirmationName,
}) => {
  const [errorText, setErrorText] = useState('');
  const { t } = useTranslation('repositories');
  const isButtonDisabled = confirmationName !== itemName;

  const handleConfirmationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationName(e.target.value);
    if (e.target.value !== itemName) {
      setErrorText(`O nome '${itemName}' está incorreto.`);
    } else {
      setErrorText('');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6"> {`${t('delete.title')} ${itemName}.`}</Typography>
        <Alert
          icon={<WarningIcon />}
          severity="warning"
          sx={{ mt: 2, mb: 3 }}
        >
          {`${t('delete.title')} ${itemName}`}
        </Alert>
        {/* Restante do componente */}
        <input
          type="text"
          value={confirmationName}
          onChange={handleConfirmationNameChange}
          className="input-style"
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <Typography variant="body2" color="error">
          {errorText}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={isButtonDisabled}
          sx={{ width: '100%', marginTop: '10px' }}
        >
          {t('delete.button')}
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
