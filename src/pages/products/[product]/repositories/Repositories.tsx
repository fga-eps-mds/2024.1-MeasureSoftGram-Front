import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Box, Container, Typography, IconButton, Popover, Button , Modal} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FaGithub, FaCodeBranch } from 'react-icons/fa';

import { NextPageWithLayout } from '@pages/_app.next';
import getLayout from '@components/Layout';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useProductContext } from '@contexts/ProductProvider';
import RepositoriesTable from '../components/RepositoriesList/RepositoriesTable';


const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const Repositories: NextPageWithLayout = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const router = useRouter();
  const { currentOrganization } = useOrganizationContext();
  const { currentProduct } = useProductContext();

  const handleAddIconClick = () => {
    if (currentOrganization?.id && currentProduct?.id) {

      router.push(`/products/${currentOrganization.id}-${currentProduct.id}/repositories/manage-repository?mode=create`);
    } else {
      router.push('/home').catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Head>
        <title>Repositórios</title>
      </Head>

      <Container>
        <Box display="flex" flexDirection="column">
          <Box display="flex" alignItems="center" marginTop="40px" marginBottom="36px">
            <Typography variant="h4" color="#33568E" fontWeight="500">
              Repositórios
            </Typography>
            <IconButton
              aria-describedby={id}
              color="primary"
              aria-label="add repository"
              style={{
                backgroundColor: '#33568E',
                marginLeft: 'auto',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
              }}
              onClick={handleClick}
            >
              <AddIcon style={{ color: 'white' }} />
            </IconButton>
            <Popover
              open={open}
              id={id}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyItems: 'center'
                }}>
                <Button onClick={handleOpenModal} style={{ width: '150px', justifyContent: 'space-around' }}><FaGithub size="1.5em" /> Github</Button>
                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                >
                  <Box sx={styleModal}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      Escolha um repostório para importar
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Repositório 1
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      Repositório n
                    </Typography>
                  </Box>
                </Modal>
                <Button style={{ width: '150px', justifyContent: 'space-around' }} onClick={handleAddIconClick}> <FaCodeBranch size="1.5em" /> Criar</Button>
              </div>

            </Popover>
          </Box>
        </Box >
        <Box
          display="flex"
          flexDirection="column"
          padding="20px"
          style={{ backgroundColor: 'white', border: '1px solid #113d4c80', borderRadius: '10px' }}
        >
          <RepositoriesTable />
        </Box>
      </Container >
    </>
  );
};

Repositories.getLayout = getLayout;

export default Repositories;
