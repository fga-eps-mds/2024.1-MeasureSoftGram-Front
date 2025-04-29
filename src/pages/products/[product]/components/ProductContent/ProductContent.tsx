import React, { useState } from 'react';

import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Box, Button, Typography, Container, Modal, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { RepositoriesTsqmiHistory } from '@customTypes/product';
import WarningIcon from '@mui/icons-material/Warning';
import { toast } from 'react-toastify';

import GraphicRepositoriesTsqmiHistory from '@components/GraphicRepositoriesTsqmiHistory';

import { useProductContext } from '@contexts/ProductProvider';

import { getPathId } from '@utils/pathDestructer';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useProductQuery } from '@pages/products/hooks/useProductQuery';
import MSGButton from '../../../../../components/idv/buttons/MSGButton';
import Skeleton from './Skeleton';

interface Props {
  repositoriesTsqmiHistory?: RepositoriesTsqmiHistory;
}
interface IProduct {
  name: string,
  id: string
}

const ProductContent: React.FC<Props> = ({ repositoriesTsqmiHistory }) => {
  const { currentProduct } = useProductContext();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pathId, setPathId] = useState({} as { productId: string; organizationId: string });
  const [confirmationName, setConfirmationName] = useState("");
  const { deleteProduct, } = useProductQuery();
  const router = useRouter();

  let errorText = '';

  const itemToDelete: IProduct = {
    name: currentProduct?.name ?? '',
    id: currentProduct?.id ?? ''
  }

  const { query } = useRouter();
  const { t } = useTranslation('overview');

  if (!Object.keys(pathId).length && currentProduct) {
    const [organizationId, productId] = getPathId(query?.product as string);
    setPathId({ organizationId, productId });
  }

  const lastUpdateDate =
    currentProduct &&
    formatRelative(new Date(), new Date(), {
      locale: ptBR
    });

  if (!currentProduct || !repositoriesTsqmiHistory) {
    return (
      <Container>
        <Skeleton />
      </Container>
    );
  }

  const handleDeleteProduct = async () => {

    if (itemToDelete && itemToDelete.name === confirmationName) {
      try {

        const result = await deleteProduct(String(itemToDelete.id), pathId.organizationId);
        if (result.type === "success") {
          toast.success('Produto excluído com sucesso!');
        }
        setShowConfirmationModal(false);
        setConfirmationName("");
        errorText = "";
        router.push('/home');
      }
      catch (e) {
        toast.error('Erro ao deletar produto!');
        window.location.reload()
      }
    }
  };

  const handleConfirmationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setConfirmationName(newName);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" alignItems="center" marginTop="40px" marginBottom="24px" width="100%">
          <Box width="100%">
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">

                <Typography variant="h4" marginRight="10px">
                  {t('confirm')}
                </Typography>
                <Typography variant="h4" fontWeight="500" color="#33568E">
                  {currentProduct?.name}
                </Typography>
              </Box>

              <MSGButton variant="secondary" onClick={() => setShowConfirmationModal(true)}>
                <DeleteIcon />
                {t('delete')}

              </MSGButton>
            </Box>
            <Typography variant="caption" color="gray">
              {t('last-update')} : {lastUpdateDate}
            </Typography>
          </Box>
        </Box>
      </Box>
      <GraphicRepositoriesTsqmiHistory history={repositoriesTsqmiHistory} />

      <Modal
        open={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
        }}
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
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <IconButton onClick={() => setShowConfirmationModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <h3>
            {t('confirm')}
          </h3>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ textAlign: 'justify' }}>
              {`${t('confirm-subtitle')} ${itemToDelete?.name}`}
            </Typography>
          </Box>

          <Alert
            icon={<WarningIcon />}
            severity="warning"
            sx={{ margin: '10px 0' }}
          >
            {`${t('confirm-warning')} '${itemToDelete?.name}'`}
          </Alert>
          <input
            type="text"
            value={confirmationName}
            onChange={handleConfirmationNameChange}
            className="input-style"
            style={{ width: '100%' }}
          />
          <Typography variant="body2" sx={{ color: 'error.main', mt: 2 }}>
            {errorText}
          </Typography>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button variant="contained" color="primary" onClick={handleDeleteProduct} sx={{ width: '100%' }}>
              {t('button')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container >
  );
};

export default ProductContent;
