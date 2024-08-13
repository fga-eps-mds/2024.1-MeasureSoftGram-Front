import React from "react";

import { NextPageWithLayout } from "@pages/_app.next";

import getLayout from "@components/Layout";

import Head from "next/head";

import { InfoData } from "@customTypes/home";

import { Container, Box, Typography } from "@mui/material";

import useRequireAuth from "@hooks/useRequireAuth";

import { useTranslation } from "react-i18next";
import CardInfo from "./components/CardInfo/CardInfo";

import ListNavCard from "./components/ListNavCard/ListNavCard";


const Home: NextPageWithLayout = () => {
  useRequireAuth();
  const { t } = useTranslation('home');

  const cardsData: Array<InfoData> = [
    {
      id: t('organization.id'),
      elements: [
        {
          imageSrc: "/images/png/structure.png",
          title: t('organization.title'),
          description: t('organization.description'),
          routeTo: 'products'
        },
        {
          imageSrc: "/images/png/development.png",
          title: t('product.title'),
          description: t('product.description'),
          routeTo: 'products/create'
        }
      ]
    },
    {
      id: t('repository.id'),
      elements: [
        {
          imageSrc: "/images/png/folders.png",
          title: t('repository.title'),
          description: t('repository.description')
        },
        {
          imageSrc: "/images/png/new-offer.png",
          title: t('release.title'),
          description: t('release.description')
        }
      ]
    },
    // {
    //   id: "Visualização",
    //   title: "Visualização",
    //   elements: [
    //     {
    //       imageSrc: "/images/png/chart_behavior.png",
    //       title: "Gráfico Comportamento do Produto",
    //       description: `Gráfico de linha que apresenta no eixo X a linha do tempo e no eixo Y escala de valores de qualidade entre 0 e 1. Cada linha representa o desempenho de um repositório quanto ao indíce de qualidade gerado pelo modelo a cada release através do tempo.`
    //     },
    //     {
    //       imageSrc: "/images/png/chart_caracteristics.png",
    //       title: "Gráfico Características do Repositório",
    //       description: "Gráfico de linha que apresenta no eixo X a linha do tempo e no eixo Y escala de valores de qualidade entre 0 e 1. Cada linha representa o desempenho de uma característica quanto ao indíce de qualidade gerado pelo modelo a cada release através do tempo.",
    //     }
    //   ]
    // },
    {
      id: t('pre-config.id'),
      elements: [
        {
          imageSrc: "/images/png/setting.png",
          title: t('pre-config.title'),
          description: t('pre-config.description')
        }
      ]
    },
    {
      id: t('config.id'),
      elements: [
        {
          imageSrc: "/images/png/web-management.png",
          title: t('config.title'),
          description: t('config.description')
        }
      ]
    }
  ];

  const navListData: Array<string> = cardsData.map(cardData => cardData.id);


  return (
    <>
      <Head>
        <title>{t('title')} - MeasureSoftGram</title>
      </Head>

      <Container>
        <Box
          display="flex"
          flexDirection="row"
        >
          <Box
            display="flex"
            flexDirection="column"
            rowGap="1rem"
            alignItems="flex-start"
            width="26%"
            padding="1rem"
            position="sticky"
            top="0"
            maxHeight="72vh"
          >
            <Box display="flex">
              <Typography variant="h4" style={{ color: "#33568E", fontWeight: "bold" }}>
                {t('sub-title')}
              </Typography>
            </Box>
            <Box>
              <Typography style={{ fontSize: "16px" }}>
                {t('description')}
              </Typography>
            </Box>

            <Box
              display="flex"
              flex="1"
              flexDirection="column"
              minWidth="20%"
            >
              <ListNavCard navListData={navListData} />
            </Box>
          </Box>

          <Box
            display="flex"
            columnGap="1rem"
            justifyContent="space-between"
            width="74%"
            marginTop="5%"
            marginBottom="5%"
          >
            <Box
              display="flex"
              flex="1"
              minWidth="78%"
              flexDirection="column"
              gap="2rem"
              sx={{
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0, 0, 0, 0.87)",
                '::-webkit-scrollbar': {
                  width: "5px",
                },
                '::-webkit-scrollbar-track': {
                  background: "transparent",
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: "#C5C5C5",
                  borderRadius: "5px",
                }
              }}
            >
              {
                cardsData.map(cardData => (
                  <CardInfo
                    key={cardData?.id}
                    cardData={cardData}
                  />
                ))
              }
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

Home.getLayout = getLayout;
Home.disableBreadcrumb = true;

export default Home;
