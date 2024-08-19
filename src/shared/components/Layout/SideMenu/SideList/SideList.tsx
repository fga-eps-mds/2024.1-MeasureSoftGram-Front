import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
} from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import WarningIcon from '@mui/icons-material/Warning';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import LetterAvatar from '@components/LetterAvatar';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useProductQuery } from '@pages/products/hooks/useProductQuery';
import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import { useTranslation } from 'react-i18next';
import { useOrganizationQuery } from '../../../../../pages/organizations/hooks/useOrganizationQuery';

type ItemWithBasicProps = {
  id: number;
  name: string;
};

type Props<T extends ItemWithBasicProps> = {
  values: Array<T>;
  open: boolean;
  onClose: () => void;
  onClickItem?: (_value: T) => void;
  seeMorePath: string;
  showActions?: boolean;
  itemType?: "organization" | "product";
  organizationId?: string;
};

const SideList = <T extends ItemWithBasicProps>({
  values,
  open,
  onClose,
  onClickItem,
  seeMorePath,
  showActions = true,
  itemType,
  organizationId,
}: Props<T>) => {
  const filteredValues = Array.isArray(values) ? values.slice(0, 10) : [];
  const { deleteOrganization } = useOrganizationQuery();
  const { deleteProduct } = useProductQuery();
  const router = useRouter();

  const { isCollapsed, toggleCollapse } = useSideMenuContext();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [confirmationName, setConfirmationName] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleAddClick = async (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path);
    });
  };

  const handleActionButtonClick = async (action: () => Promise<void>) => {
    await action();
    toggleCollapse();
  };


  const handleConfirmationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setConfirmationName(newName);

    if (newName === itemToDelete?.name) {
      setIsButtonDisabled(false);
      setErrorText("");
    } else {
      setIsButtonDisabled(true);
      if (itemType === "organization") {
        setErrorText("O nome da organização está incorreto.");
      }
      else {
        setErrorText("O nome do produto está incorreto.");
      }
    }
  };

  const handleDelete = async () => {
    if (confirmationStep === 0) {
      setShowConfirmationModal(true);
    } else if (confirmationStep === 1) {
      if (itemToDelete && itemToDelete.name === confirmationName) {
        const result = await deleteOrganization(String(itemToDelete.id));
        if (result.type === "success") {
          toast.success('Organização excluída com sucesso!');
          setTimeout(() => {
            window.location.reload();
            window.location.href = '/home';
          }, 2000);
        }
        setItemToDelete(null);
        setShowConfirmationModal(false);
        setConfirmationStep(0);
        setConfirmationName("");
        setErrorText("");
        setIsButtonDisabled(true);
      } else {
        setErrorText("O nome da organização está incorreto.");
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (confirmationStep === 0) {
      setShowConfirmationModal(true);
    } else if (confirmationStep === 1) {
      if (itemToDelete && itemToDelete.name === confirmationName) {
        const result = await deleteProduct(String(itemToDelete.id), organizationId);
        if (result.type === "success") {
          toast.success('Produto excluído com sucesso!');
          setTimeout(() => {
            window.location.reload();
            window.location.href = '/home';
          }, 2000);
        }
        setItemToDelete(null);
        setShowConfirmationModal(false);
        setConfirmationStep(0);
        setConfirmationName("");
        setErrorText("");
        setIsButtonDisabled(true);
      } else {
        setErrorText("O nome do produto está incorreto.");
      }
    }
  };

  const { t } = useTranslation('sidebar');

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: '500px', bgcolor: 'background.paper' }}>
          <Box
            sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <IconButton onClick={onClose}>
              <FiArrowLeft fontSize={30} />
            </IconButton>
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => handleAddClick(itemType === "organization" ? `/organizations/` : `/products/create/?id_organization=${organizationId}`)}
            >
              {itemType === "organization" ? t('organization.add-organization') : t('product.add-product')}
            </Button>
          </Box>
          <List>
            {filteredValues.map((value) => (
              <Box key={value.id} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Divider sx={{ width: 'calc(100% - 10px)', border: '1px solid rgba(0, 0, 0, 0.20)' }} />
                <ListItem
                  disablePadding
                  key={value.id}
                  onClick={() => {
                    if (typeof onClickItem === 'function') {
                      onClickItem(value);
                    } else {
                      console.error('onClickItem is not a function', onClickItem);
                    }
                    onClose();
                  }}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <LetterAvatar name={value.name} />
                    </ListItemIcon>
                    <ListItemText primary={value.name} />
                    {showActions && (
                      <>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleActionButtonClick(async () => {
                            if (itemType === "organization") {
                              await router.push(`/organizations?edit=${value.id}`);
                            } else {
                              await router.push(`/products/create/?id_organization=${organizationId}&id_product=${value.id}`);
                            }
                          })}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleActionButtonClick(() => {
                            setItemToDelete(value);
                            setShowConfirmationModal(true);
                          })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
            <Button
              sx={{ marginTop: '5px', minHeight: '10vh', width: 'calc(100% - 10px)' }}
              onClick={() => handleActionButtonClick(async () => {
                await router.push(seeMorePath);
              })}
              variant="text"
            >
              {t('release.more')}
            </Button>
          </List>
        </Box>
      </Drawer>

      <Modal
        open={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setConfirmationStep(0);
        }}
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
          p: 4,
        }}>
          {confirmationStep === 0 ? (
            <>
              <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton onClick={() => setShowConfirmationModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <h3>{t('delete.title')}</h3>
              <Alert
                icon={<WarningIcon />}
                severity="warning"
                sx={{ margin: '10px 0' }}
              >
                {t('delete.alert')}
              </Alert>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                  {itemType === 'organization' ? `${t('delete.organization-text')} ${itemToDelete?.name}${t('delete.organization-text2')}` : `${t('delete.product-text')}${itemToDelete?.name}`}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setConfirmationStep(1)}
                  sx={{ width: '100%' }}
                >
                  {t('delete.button')}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                <IconButton onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationStep(0);
                }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <h3>Confirmação adicional</h3>
              <Alert
                icon={<WarningIcon />}
                severity="warning"
                sx={{ margin: '10px 0' }}
              >
                Para confirmar, digite '{itemToDelete?.name}' abaixo:
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
                <Button variant="contained" color="primary" onClick={itemType === 'organization' ? handleDelete : handleDeleteProduct} sx={{ width: '100%' }} disabled={isButtonDisabled} >
                  {itemType === 'organization' ? "Deletar esta organização" : "Deletar este produto"}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default SideList;
