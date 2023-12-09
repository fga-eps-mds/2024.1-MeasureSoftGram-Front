import React from 'react';
import Head from 'next/head';
import { NextPageWithLayout } from '@pages/_app.next';
import getLayout from '@components/Layout';
import { GetServerSideProps } from 'next';
import { productQuery } from '@services/product';
import { IReleases, ReleaseGoal } from '@customTypes/product';
import { Box } from '@mui/system';
import { Container, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useRequest } from '@hooks/useRequest';
import { formatDate } from '@utils/formatDate';
import SimpleLineChart from './components/CurveGraph/CurveGraph';
import * as Styles from './styles';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const product = context?.params?.product as string;
    const releaseId = context?.params?.release as string;
    const organizationId = product.split('-')[0];
    const productId = product.split('-')[1];

    return {
      props: {
        organizationId,
        productId,
        releaseId
      }
    };
  } catch (err) {
    console.log(err);
  }
};

interface ReleaseProps {
  // release: IReleases;
  organizationId: string;
  productId: string;
  releaseId: string;
}
const Release: NextPageWithLayout = ({ organizationId, productId, releaseId }: ReleaseProps) => {
  const router = useRouter();

  const { data: release } = useRequest<IReleases>(
    productQuery.getReleasesByID(organizationId, productId, releaseId)
  );
  const { data: releaseResponse } = useRequest<any>(
    productQuery.getReleaseList(organizationId, productId as string)
  );

  const planejado = [0.4, 0.3,];
  const realizado = [0.2400, 0.1398,];
  const xLabels = [
    'Reliability',
    'Maintainability',
  ];

  planejado.unshift(0);
  xLabels.unshift('');
  if (realizado) {
    realizado.unshift(0);
  }

  const releaseList: ReleaseGoal[] = releaseResponse?.results || [];
  return (
    <>
      <Head>
        <title>{release?.release_name || 'release'}</title>
      </Head>
      <Container>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <Typography fontSize="32px" fontWeight="400">
                Release
              </Typography>
              <Typography fontSize="32px" fontWeight="500" color="#33568E">
                {release?.release_name}
              </Typography>
            </Box>
            Duração da release
            <Typography fontSize="14px" fontWeight="300">
              {formatDate(release?.start_at)} - {formatDate(release?.end_at)}
            </Typography>
          </Box>

          <Box>
            <InputLabel id="demo-simple-select-label">Selecione a release</InputLabel>
            <Select
              variant="standard"
              value={release?.id}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Selecione a release"
              fullWidth
              onChange={(e) => router.push(`/products/${router?.query?.product}/releases/${e.target.value}`)}
            >
              {releaseList?.map((item) => (
                <MenuItem value={item?.id} key={item.id}>
                  {item?.release_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Styles.ContainerGraph>
          <SimpleLineChart planejado={planejado} realizado={realizado} labels={xLabels} />
        </Styles.ContainerGraph>
      </Container>
    </>
  );
};

Release.getLayout = getLayout;

export default Release;
