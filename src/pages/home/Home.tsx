import React from "react";
import { NextPageWithLayout } from "@pages/_app.next";
import getLayout from "@components/Layout";
import Head from "next/head";
import { Container, Box, Typography } from "@mui/material";
import Image from "next/image";
import useRequireAuth from "@hooks/useRequireAuth";
import { useTranslation } from "react-i18next";
import MSGButton from "src/components/idv/buttons";

const IMAGE_SOURCE = '/images/svg/logo.svg';

const Home: NextPageWithLayout = () => {
  useRequireAuth();
  const { t } = useTranslation('home');

  return (
    <>
      <Head>
        <title>{t('title')} - MeasureSoftGram</title>
      </Head>
      <Container>
        <Box
          display="flex"
          flexDirection="column"
          padding="1rem"
          height="200rem"
          justifyItems="space-between"
        >
          <Box display="flex" flexDirection="row" alignItems="center">
            <Image src={IMAGE_SOURCE} alt="logo" height={250} width={250} />
            <Box display="flex" flexDirection="column" alignItems="center" paddingLeft="1rem">
              <Typography style={{ color: "#5E5E5E", fontWeight: "bold", fontSize: "90px", letterSpacing: "2px", fontFamily: "Quattrocento" }}>
                {t('home-title')}
              </Typography>
              <Typography style={{ color: "#5E5E5E", fontSize: "18px", fontWeight: "bold", fontFamily: "Quattrocento" }}>
                {t('description')}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <MSGButton variant="secondary" width="35%">
              {t('button.about')}
            </MSGButton>
            <MSGButton width="35%">
              {t('button.start')}
            </MSGButton>
          </Box>
        </Box>
      </Container>
    </>
  );
};

Home.getLayout = getLayout;
Home.disableBreadcrumb = true;

export default Home;
