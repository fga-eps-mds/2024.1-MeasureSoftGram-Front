import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getLayout from '@components/Layout';
import { toast } from 'react-toastify';
import { getAllUsers, User } from '@services/user';
import { TextField, Button, Typography, Box, List, ListItem, ListItemText, Modal, Backdrop, Fade, Grid, FormControl } from '@mui/material';
import MSGButton from '../../components/idv/buttons/MSGButton';
import { useOrganizationQuery } from './hooks/useOrganizationQuery';
import { Title, Container, Wrapper, Description, Form, Header } from './styles';

interface OrganizationsType extends React.FC {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
}

const Organizations: OrganizationsType = () => {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [chave, setChave] = useState('');
  const [descricao, setDescricao] = useState('');
  const [membros, setMembros] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { createOrganization, getOrganizationById, updateOrganization } = useOrganizationQuery();
  const [users, setUsers] = useState<User[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const carregarMembrosDaOrganizacao = async () => {
    const result = await getAllUsers();

    if (result.type === 'success' && Array.isArray(result.value.results)) {
      setUsers(result.value.results);
    } else {
      toast.error('Erro ao carregar os usuários.');
    }
  };

  useEffect(() => {
    carregarMembrosDaOrganizacao();

    const editMode = router.query.edit;
    if (editMode) {
      setIsEditMode(true);
      const fetchOrganizationData = async () => {
        const result = await getOrganizationById(editMode as string);
        if (result.type === 'success') {
          setNome(result.value.name);
          setChave(result.value.key || '');
          setDescricao(result.value.description || '');
          setMembros(result.value.members || []);
        }
      };
      fetchOrganizationData();
    }
  }, [router.query.edit]);


  const handleToggleUser = (username: string) => {
    const currentIndex = membros.indexOf(username);
    const newMembros = [...membros];

    if (currentIndex === -1) {
      newMembros.push(username);
    } else {
      newMembros.splice(currentIndex, 1);
    }

    setMembros(newMembros);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const novaOrganizacao = {
      name: nome,
      key: chave,
      description: descricao,
      members: membros,
    };

    let result;
    const nameExist = "Já existe uma organização com este nome."
    const keyExist = "Já existe uma organização com esta chave."
    if (isEditMode && router.query.edit) {
      result = await updateOrganization(router.query.edit as string, novaOrganizacao);
      if (result.type === 'success') {
        toast.success('Organização atualizada com sucesso!');
        setTimeout(() => {
          window.location.reload();
          window.location.href = '/home';
        }, 2000);
      } else if (result.error.message === nameExist) {
        toast.error(nameExist);
      } else if (result.error.message === keyExist) {
        toast.error(keyExist);
      } else {
        toast.error('Erro ao atualizar a organização!');
      }
    } else {
      result = await createOrganization(novaOrganizacao);
      if (result.type === 'success') {
        toast.success('Organização criada com sucesso!');
        setTimeout(() => {
          window.location.reload();
          window.location.href = '/home';
        }, 2000);
      } else if (result.error.message === nameExist) {
        toast.error(nameExist);
      } else if (result.error.message === keyExist) {
        toast.error(keyExist);
      } else {
        toast.error('Erro ao criar a organização!');
      }
    }
  };

  return (
    <Container>
      <Header data-testid="organization-title">{isEditMode ? 'EDITAR ORGANIZAÇÃO' : 'ADICIONAR ORGANIZAÇÃO'}</Header>
      <Wrapper>
        <Description>
          Uma organização representa uma entidade de alto nível que mantém múltiplos repositórios de código-fonte. Cada repositório pode ter seu próprio objetivo, mas todos devem estar alinhados com os interesses da organização.
        </Description>
        <form onSubmit={handleSubmit}>
          <Form>
            <TextField
              fullWidth
              label="Nome da organização"
              variant="outlined"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              sx={{ mb: 2 }}
              data-testid="input-nome"
            />

            <TextField
              fullWidth
              label="Descrição da organização"
              variant="outlined"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              multiline
              sx={{ mb: 2 }}
              data-testid="input-descricao"
            />
            <MSGButton variant='secondary' onClick={handleOpenModal}  >ADICIONAR MEMBROS</MSGButton>

            <MSGButton type='submit' >{isEditMode ? 'SALVAR' : 'CRIAR'}</MSGButton>
          </Form>
        </form>

      </Wrapper>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Box sx={{ width: 400, p: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, borderRadius: 1 }}>
            <Title>
              ADICIONAR MEMBROS
            </Title>
            <hr />
            <FormControl fullWidth variant="outlined">
              <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user) => {
                    const isMember = membros.indexOf(user.username) > -1;
                    return (
                      <ListItem key={user.id}>
                        <ListItemText>
                          {user.first_name} {user.last_name} ({user.username})
                        </ListItemText>
                        <Button
                          variant={isMember ? "outlined" : "contained"}
                          color="primary"
                          onClick={() => handleToggleUser(user.username)}
                          sx={{ opacity: isMember ? 0.5 : 1 }}
                        >
                          {isMember ? 'Adicionado' : 'Adicionar'}
                        </Button>
                      </ListItem>
                    );
                  })
                ) : (
                  <Typography>Nenhum usuário disponível</Typography>
                )}
              </List>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="primary" onClick={handleCloseModal}>
                Fechar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container >


    // <Container maxWidth="md" sx={{ mt: 4 }}>
    //   <Head>
    //     <title>{isEditMode ? 'Editar Organização' : 'Cadastro de Organização'}</title>
    //   </Head>
    //   <Typography variant="h4" data-testid="organization-title" gutterBottom>
    //     {isEditMode ? 'Editar Organização' : 'Cadastro de Organização'}
    //   </Typography>
    //   <form onSubmit={handleSubmit} sx={{ mt: 2 }}>
    //     <Grid container spacing={3}>
    //       <Grid item xs={6}>
    //         <TextField
    //           fullWidth
    //           label="Nome"
    //           variant="outlined"
    //           value={nome}
    //           onChange={(e) => setNome(e.target.value)}
    //           required
    //           sx={{ mb: 2 }}
    //           data-testid="input-nome"
    //         />
    //         <TextField
    //           fullWidth
    //           label="Descrição"
    //           variant="outlined"
    //           value={descricao}
    //           onChange={(e) => setDescricao(e.target.value)}
    //           multiline
    //           rows={4}
    //           sx={{ mb: 2 }}
    //           data-testid="input-descricao"
    //         />
    //       </Grid>
    //       <Grid item xs={6}>
    //         <Typography variant="h6" gutterBottom sx={{ mb: 2 }} data-testid="membros-title">
    //           Membros
    //         </Typography>
    //         <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mb: 2 }} data-testid="button-adicionar-membros">
    //           Adicionar Membros
    //         </Button>
    //       </Grid>
    //       <Grid item xs={12}>
    //         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    //           <Button
    //             type="submit"
    //             variant="contained"
    //             color="primary"
    //           >
    //             {isEditMode ? 'Salvar' : 'Criar'}
    //           </Button>
    //         </Box>
    //       </Grid>
    //     </Grid>
    //   </form>


    // </Container>
  );
};

Organizations.getLayout = getLayout;

export default Organizations;
