import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NextPageWithLayout } from '@pages/_app.next';
import { useProductContext } from '@contexts/ProductProvider';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import getLayout from '@components/Layout';
import CardNavigation from '@components/CardNavigation';
import { Product } from '@customTypes/product';
import useRequireAuth from '@hooks/useRequireAuth';
import SearchButton from '@components/SearchButton';
import Skeleton from './components/Skeleton';
import { useQuery } from './hooks/useQuery';
import ScrollableList from './components/ScrollableList/index';
import { Organization } from '@customTypes/organization';


const Products: NextPageWithLayout = () => {
  useQuery();
  useRequireAuth();

  let {
    organizationList,
    currentOrganization,
    setCurrentOrganizations,
    fetchOrganizations,
    isLoading: isLoadingOrganizations
  } = useOrganizationContext();
  const { productsList } = useProductContext();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(
    productsList ?? []
  );

  useEffect(() => {
  }, [currentOrganization]);

  useEffect(() => {
    if (productsList !== undefined) setFilteredProducts(productsList);
  }, [productsList]);


  useEffect(() => {
    fetchOrganizations(true)
  }, []);

  const handleSelectedOrganization = (organization: Organization) => {
    const organizationId = organization.id
    if (currentOrganization?.id === organizationId) {
      setCurrentOrganizations([]);
    } else if (organizationList?.length) {
      const selectedOrganization = organizationList.find(
        (organization) => organization.id === organizationId
      );
      if (selectedOrganization) {
        setCurrentOrganizations([selectedOrganization]);
      }
    }
  };

  const handleProductFilter = (name: string) => {
    if (name == null || name === '') {
      setFilteredProducts(productsList!);
      return;
    }
    const filtered =
      productsList?.filter((product) =>
        product.name.toLowerCase().includes(name.toLowerCase())
      ) ?? [];
    setFilteredProducts(filtered);
  };

  if (!productsList) {
    return (
      <Container>
        <Skeleton />
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Site do MeasureSoftGram</title>
      </Head>

      <Container maxWidth="lg" style={{ width: '100%' }}>
        <Box display="flex" flexDirection="column">

          <Box
            data-testid="organization-box"
            sx={{
              marginTop: '40px',
              padding: '20px 36px',
              overflowX: 'auto',
              overflowY: 'hidden',
              position: 'relative',
            }}
            style={{
              maxHeight: '120px',
            }}
          >
            <Box
              display="flex"
              flexDirection="row"
              style={{
                gap: '1rem',
                padding: '0',
                marginLeft: '-36px',
                boxSizing: 'border-box',
              }}
              sx={{
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f0f0f0',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#b0b0b0',
                  borderRadius: '4px',
                },
                scrollbarColor: '#b0b0b0 #f0f0f0',
                scrollbarWidth: 'thin',
              }}
            >

            </Box>
          </Box>



          {isLoadingOrganizations ? <Box
            style={{
              border: '1px solid #113d4c',
              borderRadius: '10px',
              boxSizing: 'border-box',
            }}> <Skeleton /> </Box> :

            <Box
              display="flex"
              flexDirection="row"
              marginTop="20px"
              style={{
                border: '1px solid #113d4c',
                borderRadius: '10px',
                boxSizing: 'border-box',
              }}
            >

              <Box
                style={{
                  padding: "36px",
                  backgroundColor: '#F4F5F6',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                }}>
                <Link href="/organizations">
                  <Button
                    style={{
                      minWidth: '40px',
                      height: '45px',

                    }}
                    size="medium"
                    variant={
                      'contained'
                    }
                  >
                    Adicionar Organização
                  </Button>
                </Link>


                <ScrollableList organizationList={organizationList} onSelect={handleSelectedOrganization}></ScrollableList>

              </Box>


              <Box>
                <Link href="/products/create">
                  <Button
                    style={{
                      minWidth: '40px',
                      height: '45px',

                    }}
                    size="medium"
                    variant={
                      'contained'
                    }
                  >
                    Adicionar Produto
                  </Button>
                </Link>

                <TextField
                  fullWidth
                  label="Buscar Produto"
                  variant="outlined"
                  onChange={(e) => handleProductFilter(e.target.value)}
                  sx={{ mb: 2 }}
                  data-testid="search-input"
                />

                <Box
                  display="flex"
                  flexDirection="column"
                  flexWrap="wrap"
                  marginTop="20px"
                  justifyContent="space-around"
                >
                  {filteredProducts?.map((product) => (
                    <CardNavigation
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      url={`/products/${currentOrganization?.id}-${product?.id}-${product?.name}`}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

          }
        </Box>
      </Container>
    </>
  );
};

Products.getLayout = getLayout;

export default Products;
