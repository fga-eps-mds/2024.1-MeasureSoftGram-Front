import React, { useEffect, useState } from 'react';
import getLayout from '@components/Layout';
import { productQuery } from '@services/product';
import { AccomplishedRepository, Characteristic, IReleases } from '@customTypes/product';
import { Box } from '@mui/system';
import { Card, Container, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { formatDate } from '@utils/formatDate';
import ReleaseChart from '../../../../../shared/components/ReleaseChart';
import messages from './messages';
import Head from 'next/head';

const Release: any = () => {
  const router = useRouter();
  const routerParams: any = router.query;

  const [accomplisedResults, setAccomplisedResults] = useState<AccomplishedRepository[]>([]);
  const [planned, setPlanned] = useState<Characteristic[]>([]);
  const [release, setRelease] = useState<IReleases>();
  const [selectedValue, setSelectedValue] = useState(0);
  const [selectedRepository, setSelectedRepository] = useState<AccomplishedRepository>();

  useEffect(() => {
    if (router.isReady) {
      const organizationId = routerParams.product.split('-')[0];
      const productId = routerParams.product.split('-')[1];
      const releaseId = routerParams.release;

      productQuery.getReleaseAnalysisDataByReleaseId(
        organizationId, productId, releaseId
      ).then((res) => {

        setAccomplisedResults(accomplised_mock);
        setPlanned(planned_mock);

        // setAccomplisedResults(res.data.accomplished);
        // setPlanned(res.data.planned);
        setRelease(res.data.release);
      });
    }
  }, [router.isReady, routerParams.product, routerParams.release]);

  useEffect(() => {
    setSelectedRepository(accomplisedResults[selectedValue])
  }, [selectedValue, accomplisedResults])

  const handleSelectionChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedValue(newValue);
  };

  return (
    <>
      <Head>
        <title>{release?.release_name || 'release'}</title>
      </Head>
      <Container>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {release && <Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <Typography fontSize="32px" fontWeight="400">
                {messages.release}
              </Typography>
              <Typography data-testid='release-name' fontSize="32px" fontWeight="500" color="#33568E">
                {release?.release_name}
              </Typography>
            </Box>
            {messages.releaseInterval}
            <Typography data-testid='data-release' fontSize="14px" fontWeight="300">
              {formatDate(release.start_at)} - {formatDate(release.end_at)}
            </Typography>
          </Box>}
        </Box>
        {
          accomplisedResults &&
          <Container>
            <Grid container mt={0.1} spacing={4}>
              <Grid item xs={2} height={520} >
                <Card sx={{ height: "inherit" }} >
                  <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={selectedValue}
                    onChange={handleSelectionChange}
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                  >
                    {accomplisedResults.map((repository: AccomplishedRepository) => (
                      <Tab label={repository.repository_name} />
                    ))}

                  </Tabs>
                </Card>
              </Grid>

              <Grid item xs={10}>
                {selectedRepository && <ReleaseChart repository={selectedRepository} planned={planned} accomplised={selectedRepository.characteristics} normDiff={selectedRepository.norm_diff} />}
              </Grid>
            </Grid>
          </Container>
        }
      </Container>
    </>
  );
};

Release.getLayout = getLayout;

export default Release;

const planned_mock = [
  {
    name: 'Adequação Funcional',
    value: 0.5,
    diff: 0.1
  },
  {
    name: 'Eficiência de desempenho',
    value: 0.4,
    diff: 0.1
  },
  {
    name: 'Compatibilidade',
    value: 0.7,
    diff: 0.1
  },
  {
    name: 'Usabilidade',
    value: 0.9,
    diff: 0.1
  },
  {
    name: 'Confiabilidade',
    value: 0.2,
    diff: 0.1
  },
  {
    name: 'Segurança',
    value: 1,
    diff: 0.1
  },
  {
    name: 'Manutenibilidade',
    value: 0.5,
    diff: 0.1
  },
  {
    name: 'Portabilidade',
    value: 0.2,
    diff: 0.1
  }
]

const characteristics_mock = [
  {
    name: 'Adequação Funcional',
    value: 0.6,
    diff: 0.1
  },
  {
    name: 'Eficiência de desempenho',
    value: 0.5,
    diff: 0.1
  },
  {
    name: 'Compatibilidade',
    value: 0.9,
    diff: 0.1
  },
  {
    name: 'Usabilidade',
    value: 0.1,
    diff: 0.1
  },
  {
    name: 'Confiabilidade',
    value: 0.5,
    diff: 0.1
  },
  {
    name: 'Segurança',
    value: 0.6,
    diff: 0.1
  },
  {
    name: 'Manutenibilidade',
    value: 0.8,
    diff: 0.1
  },
  {
    name: 'Portabilidade',
    value: 0.6,
    diff: 0.1
  }
]

const characteristics_mock_2 = [
  {
    name: 'Adequação Funcional',
    value: 0.8,
    diff: 0.2
  },
  {
    name: 'Eficiência de desempenho',
    value: 0.2,
    diff: 0.1
  },
  {
    name: 'Compatibilidade',
    value: 0.6,
    diff: 0.3
  },
  {
    name: 'Usabilidade',
    value: 0.9,
    diff: 0.0
  },
  {
    name: 'Confiabilidade',
    value: 0.4,
    diff: 0.3
  },
  {
    name: 'Segurança',
    value: 0.8,
    diff: 0.5
  },
  {
    name: 'Manutenibilidade',
    value: 0.5,
    diff: 0.1
  },
  {
    name: 'Portabilidade',
    value: 0.2,
    diff: 0.0
  }
]

const accomplised_mock = [{
  repository_name: 'Repositorio 1',
  characteristics: planned_mock,
  norm_diff: 0.21
},
{
  repository_name: 'Repositorio 2',
  characteristics: characteristics_mock_2,
  norm_diff: 0.67
}]
