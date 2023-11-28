import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { IconButton, Box, Typography, Container, Button, Modal, Table, TableBody, TableRow, TableCell } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRepositoryContext } from '@contexts/RepositoryProvider';
import { useProductContext } from '@contexts/ProductProvider';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import RepositoriesTable from './RepositoriesTable';
import Skeleton from './Skeleton';
import * as Styles from './styles';

function RepositoriesList() {
  const { repositoryList } = useRepositoryContext();
  const { currentProduct } = useProductContext();
  const { currentOrganization } = useOrganizationContext();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [repositoryToDelete, setRepositoryToDelete] = useState<any>(null);

  const pushToRepositoriesPath = () => {
    const repositoriesPath = `/products/${currentOrganization?.id}-${currentProduct?.id}-${currentProduct?.name}/repositories`;
    void router.push(repositoriesPath).catch((error: any) => toast.error(error));
  };

  const handleDelete = async () => {
    if (repositoryToDelete) {
      // Lógica para deletar o repositório
      // ...

      // Fechar o modal depois de deletar
      setShowDeleteModal(false);
    }
  };

  const openDeleteModal = (repository: any) => {
    setRepositoryToDelete(repository);
    setShowDeleteModal(true);
  };

  if (!repositoryList) {
    return <Skeleton />;
  }

  return (
    <Box display="flex" flexDirection="column" mt="42px">
      <Styles.Wrapper>
        <Container>
          <Typography variant="h5" marginRight="10px" mb="16px" color="#538BA3" fontWeight="500">
            Repositórios
            <IconButton
              color="primary"
              aria-label="add repository"
              style={{
                backgroundColor: '#538BA3',
                marginLeft: '12px',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
              }}
              onClick={() => pushToRepositoriesPath()}
            >
              <AddIcon style={{ color: 'white' }} />
            </IconButton>
          </Typography>

          {/* Lista de repositórios */}
          <RepositoriesTable maxCount={10}>
            <Table>
              <TableBody>
                {repositoryList.map((repository: any) => (
                  <TableRow key={repository.id}>
                    <TableCell>{repository.name}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() => openDeleteModal(repository)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </RepositoriesTable>

          {/* Modal */}
          <Modal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ /* Estilos para o modal */ }}>
              <Typography variant="h6">Tem certeza que deseja excluir este repositório?</Typography>
              <Button onClick={handleDelete}>Confirmar Exclusão</Button>
            </Box>
          </Modal>

          {/* Botão "Ver Mais" */}
          <Box display="flex" flexDirection="column" mt="10px" alignItems="center">
            <Button onClick={() => pushToRepositoriesPath()} variant="text">
              VER MAIS...
            </Button>
          </Box>
        </Container>
      </Styles.Wrapper>
    </Box>
  );
}

export default RepositoriesList;
