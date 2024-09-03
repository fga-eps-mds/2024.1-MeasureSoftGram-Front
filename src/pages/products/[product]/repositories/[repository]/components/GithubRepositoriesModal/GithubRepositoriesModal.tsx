import { Box, Typography, Modal, TextField, IconButton, List, ListItemButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserRepos, Repo } from '@services/user';
import { useRouter } from 'next/router';
import { Search, GitHub } from '@mui/icons-material';

type GithubRepositoriesModalProps = {
  open: boolean
  handleCloseModal: () => void
}


const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 0,
};


export function GithubRepositoriesModal({ handleCloseModal, open }: GithubRepositoriesModalProps) {
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([])
  const [filteredRepositories, setFilteredRepositories] = useState<Repo[]>([]);
  const code = router?.query?.code as string;

  const fetchUserRepos = async () => {
    const result = await getUserRepos(code);
    if (result.type === 'success' && Array.isArray(result.value.items)) {
      setRepos(result.value.items);
      setFilteredRepositories(result.value.items);

    } else {
      console.error(result.type)
    }
  }

  useEffect(() => {
    if (code)
      fetchUserRepos()
  }, [code])

  function handleRepositoriesFilter(name: string) {
    console.log(name)
    if (!name) {
      setFilteredRepositories(repos);
      return;
    }
    const repositoriesWithName =
      repos?.filter((currentRepository) =>
        currentRepository.name.toLowerCase().includes(name.toLowerCase())
      ) ?? [];

    setFilteredRepositories(repositoriesWithName);
  }

  return <Modal
    open={open}
    onClose={handleCloseModal}
    aria-labelledby='modal-title'
  >
    <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column', justifyContent: 'between', alignItems: 'center' }} >
    <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 4, mt: 0, backgroundColor: '#2B4D6F', color: 'white', width:700, display: 'flex', justifyContent: 'center'}}>
        Escolha um repositório para importar
      </Typography>



      <div style={{ width: '500px', display: 'flex' }}>
        <TextField
          id="search-bar"
          className="text"
          onChange={(e) => handleRepositoriesFilter(e.target.value)}
          variant="outlined"
          placeholder={"Insira o nome do repositório"}
          size="small"
          fullWidth
          style={
            {
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px',
              border: '1px solid #2B4D6F'
            }
          }
        />
      </div>
      <List style={{ background: 'white', overflowY: 'scroll', width: '500px', height: '375px', margin: 0, padding: 0 }}>
        {filteredRepositories.map((repository) => <ListItemButton id="modal-modal-description" style={{ border: '1px solid #2B4D6F', borderTop: 0, height: 52.5, padding: 15, backgroundColor: "#F4F5F6", }} key={repository.id}>
          {repository.name}
        </ListItemButton>)}
      </List>
    </Box>
  </Modal>
}
