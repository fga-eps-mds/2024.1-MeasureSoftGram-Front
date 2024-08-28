import { Box, Typography, Modal } from '@mui/material';
import { useState } from 'react';
import SearchButton from '@components/SearchButton';
import { Repository } from '@customTypes/repository';
import {useRouter} from 'next/router'
import { getUserGitHubToken } from '@services/user';

type GithubRepositoriesModalProps = {
  open: boolean
  handleCloseModal: () => void
}

const repositories = [{ name: 'Repositorio 1', id: 1 }, { name: 'Repositorio 3', id: 2 }, { name: 'Repositorio 4', id: 3 }, { name: 'Repositorio 234', id: 56 }]

const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export function GithubRepositoriesModal({ handleCloseModal, open }: GithubRepositoriesModalProps) {
  const router = useRouter();

  const [filteredRepositories, setFilteredRepositories] = useState(repositories);

  const code = router?.query?.code as string;

  const accessTokenResult = getUserGitHubToken(code);

  console.log(accessTokenResult)
  function handleRepositoriesFilter(name: string) {
    if (!name) {
      setFilteredRepositories(repositories);
      return;
    }
    const repositoriesWithName =
      repositories?.filter((currentRepository) =>
        currentRepository.name.toLowerCase().includes(name.toLowerCase())
      ) ?? [];

    setFilteredRepositories(repositoriesWithName);
  }

  return <Modal
    open={open}
    onClose={handleCloseModal}
  >
    <Box sx={{ ...styleModal, display: 'flex', flexDirection: 'column', justifyContent: 'between', alignItems: 'center' }} >
      <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 4 }}>
        Escolha um repostório para importar
      </Typography>


      <SearchButton
        onInput={(e) => handleRepositoriesFilter(e.target.value)}
        label="Insira o nome do repositório"
      />
      <ul style={{background: 'grey', overflow: 'scroll',}}>
        {filteredRepositories.map((repository) => {
          return <Typography id="modal-modal-description" style={{ borderWidth: 2, borderColor: 'black', width: 500 , height: 100}} key={repository.id} sx={{ mt: 2 }}>
            {repository.name}
          </Typography>
        })}
      </ul>
    </Box>
  </Modal>
}
