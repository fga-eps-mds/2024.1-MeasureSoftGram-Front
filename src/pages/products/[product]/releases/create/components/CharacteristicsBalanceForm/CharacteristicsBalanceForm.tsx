import React, { useState } from 'react';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { Box, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { Characteristic, PreConfigData } from '@customTypes/preConfig';
import { StyledSlider } from '@components/Equalizer/EqualizerSlider/styles';
import { t } from 'i18next';
import { border } from '@mui/system';

interface CharacteristicsBalanceFormProps {
  dinamicBalance: boolean;
  setDinamicBalance: any;
  configPageData: PreConfigData;
  setConfigPageData: any;
  characteristicRelations: any;
}

export default function CharacteristicsBalanceForm({ configPageData, setConfigPageData, dinamicBalance, setDinamicBalance, characteristicRelations }: CharacteristicsBalanceFormProps) {
  function handleCharacteristicChange(event: any, characteristicKey: string) {
    const { value } = event.target;
    const newGoal = Number(value);

    setConfigPageData((prevData: { characteristics: Characteristic[] }) => {
      var relatedCharacteristics: string[] = [];

      if (!dinamicBalance)
        relatedCharacteristics = characteristicRelations[characteristicKey]?.["+"] || [];

      return {
        ...prevData,
        characteristics: prevData.characteristics.map((characteristic: Characteristic) => {
          if (characteristic.key === characteristicKey || relatedCharacteristics.includes(characteristic.key)) {
            return {
              ...characteristic,
              goal: newGoal,
            };
          }
          return characteristic;
        }),
      };
    });
  }

  return <>
    <SectionTooltip text='Balancear Meta de Qualidade' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
    <FormControlLabel
      sx={{
        marginLeft: 0
      }}
      control={<Switch
        checked={dinamicBalance}
        onChange={() => setDinamicBalance(!dinamicBalance)}
        color="primary" />}
      label="Permitir o balanceamento dinâmico"
      labelPlacement="start"
    />
    <Box sx={{ border: 1, borderRadius: 3, padding: 8 }} display='flex' justifyContent='center' alignItems='center' mb={2} height={"20rem"}>
      {
        configPageData?.characteristics?.filter(characteristic => characteristic.active === true)
          .map((characteristic, index) => (
            <Grid container key={`GridCharacteristicsBalance-${index}`} gap={2} direction="column" width={120}>
              <Grid item key={`GridStyledSlider-${index}`} xs={9} display='flex' justifyContent='center'>
                <StyledSlider
                  sx={{ minHeight: "15rem" }}
                  key={`characteristic-${index}`}
                  value={characteristic.goal}
                  onChange={(event: any) => handleCharacteristicChange(event, characteristic.key)}
                  orientation="vertical"
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item key={`GridTypography-${index}`} xs={2} display='flex' alignItems="center" justifyContent='center'>
                <Typography
                  key={`characteristicTypography-${index}`}
                  fontSize="14px"
                  align="center">
                  {characteristic.key}
                </Typography>
              </Grid>
            </Grid>
          ))}
      {/* <CustomLineChart planned={char} accomplised={char} /> */}
    </Box>

  </>
}
