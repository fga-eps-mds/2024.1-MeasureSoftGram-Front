import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getLayout from '@components/Layout';
import { toast } from 'react-toastify';
import { TextField, MenuItem } from '@mui/material';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { Botoes, Container, Description, Form, Header, Wrapper } from '@pages/organizations/styles';
import MSGButton from '../../../components/idv/buttons/MSGButton';
import { useProductQuery } from '../hooks/useProductQuery';

interface OrganizationsType extends React.FC {
  getLayout?: () => React.ReactNode;
}

const ProductsCreation: OrganizationsType = () => {
  const router = useRouter();
  const [nome, setName] = useState('');
  const [descricao, setDescription] = useState('');
  const [organizationId, setOrganizationId] = useState<number>();
  const { organizationList } = useOrganizationContext();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { createProduct, getProductById, updateProduct } = useProductQuery();
  const currentOrganizationId = router.query.id_organization;
  const currentProductId = router.query.id_product;

  useEffect(() => {
    const editMode = router.query.id_product;
    console.log(router);

    if (editMode) {
      setIsEditMode(true);
      const fetchProductData = async () => {
        try {
          const result = await getProductById(currentOrganizationId as string, currentProductId as string);

          if (result.type === 'success') {
            setName(result.value.name);
            setDescription(result.value.description || '');
            setOrganizationId(result.value.organizationId || 0);
          }
        }
        catch (e) {
          console.log(e)
        }
      };
      fetchProductData();
    }
  }, [router.query.id_product]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const novoProduto = {
      name: nome,
      description: descricao,
      organizationId,
    }

    let result;

    if (!novoProduto.organizationId && currentOrganizationId) {
      novoProduto.organizationId = parseInt(currentOrganizationId[0], 10);
    }

    const nameExist = "Já existe um Produto com este nome."

    if (isEditMode) {
      result = await updateProduct(currentProductId as string, novoProduto);
      if (result.type === 'success') {
        toast.success('Produto atualizado com sucesso!');
        window.location.reload();
        window.location.href = '/home';
      } else if (result.error.message === nameExist) {
        toast.error(nameExist);
      } else {
        toast.error('Erro ao atualizar o Produto!');
      }
    } else {

      try {
        result = await createProduct(novoProduto);
        if (result.type === 'success') {
          toast.success('Produto criado com sucesso!');
          window.location.reload();
          window.location.href = '/home';
        } else if (result.error.message === nameExist) {
          toast.error(nameExist);
        } else {
          toast.error('Erro ao criar o Produto!');
        }
      }
      catch (e) {
        console.log(e)
      }
    }
  };

  return (
    <Container>
      <Header>{isEditMode ? 'Editar Produto' : 'Cadastro de Produto'}</Header>
      <Wrapper>
        <Description>
          Os produtos são softwares que pertencem à alguma organização e que possuem algum cliente. Por conta de sua natureza, um mesmo produto pode possuir vários repositórios associados à ele, o que permite uma implementação continua em mais de uma frente de trabalho.
        </Description>

        <form onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Form>
            <TextField
              select
              required
              fullWidth
              label="Organizações"
              variant="outlined"
              value={organizationId || currentOrganizationId}
              onChange={(e) => setOrganizationId(+e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              data-testid="org-input"
            >
              {
                organizationList?.map((organization) => (
                  <MenuItem key={organization.id} value={organization.id}>{organization.name}</MenuItem>
                ))
              }
            </TextField>

            <TextField
              fullWidth
              label="Nome"
              variant="outlined"
              value={nome}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
              data-testid="name-input"
            />

            <TextField
              fullWidth
              label="Descrição"
              variant="outlined"
              value={descricao}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              data-testid="description-input"
            />
            <Botoes>
              <MSGButton width="200px" variant='secondary' onClick={() => router.push('/home')}  >VOLTAR</MSGButton>

              <MSGButton width="200px" type='submit' >{isEditMode ? 'SALVAR' : 'CRIAR'}</MSGButton>
            </Botoes>

          </Form>
        </form>
      </Wrapper>
    </Container >
  );
};

ProductsCreation.getLayout = getLayout;

export default ProductsCreation;
