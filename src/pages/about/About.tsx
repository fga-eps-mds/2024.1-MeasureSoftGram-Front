import React from "react";

import { NextPageWithLayout } from "@pages/_app.next";

import getLayout from "@components/Layout";

import Head from "next/head";

import { InfoData } from "@customTypes/home";

import { Container, Box, Typography, Button } from "@mui/material";

import useRequireAuth from "@hooks/useRequireAuth";

import { useTranslation } from "react-i18next";
import Image from "next/image";
import CardInfo from "./components/CardInfo/CardInfo";

import ListNavCard from "./components/ListNavCard/ListNavCard";


const About: NextPageWithLayout = () => {
  useRequireAuth();
  const { t, i18n } = useTranslation('about');

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

  // eslint-disable-next-line no-shadow
  const changeLanguage = (i18n: any, language: string) => {
    window.localStorage.setItem('locale_lang', language)
    i18n.changeLanguage(language)
  }

  const languages = [
    { code: 'en', translateKey: 'en' },
    { code: 'pt', translateKey: 'pt' },
  ]

  function getImageSrc(key: string) {
    return `/images/png/${key}.png`
  }

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

                <div>
                  {languages.map((language) => (
                    <Button
                      type='button'
                      data-id={`${language.code}-button`}
                      className={i18n.language === language.code ? 'active' : undefined}
                      onClick={() => changeLanguage(i18n, language.code)}
                      key={language.code}
                    >
                      <Image src={getImageSrc(t(language.translateKey))} alt="flag" height={30} width={30} />
                    </Button>
                  ))}
                </div>
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

About.getLayout = getLayout;
About.disableBreadcrumb = true;

export default About;