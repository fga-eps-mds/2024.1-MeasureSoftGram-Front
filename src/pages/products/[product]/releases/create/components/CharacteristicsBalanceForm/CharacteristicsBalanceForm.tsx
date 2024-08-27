import React, { } from 'react';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { FormControlLabel, Switch } from '@mui/material';
import { PreConfigData } from '@customTypes/preConfig';

interface CharacteristicsBalanceFormProps {
  register: any;
  errors: any;
  dinamicBalance: boolean;
  setDinamicBalance: any;
  configPageData: PreConfigData;
}

export default function CharacteristicsBalanceForm({ configPageData, register, errors, dinamicBalance, setDinamicBalance }: CharacteristicsBalanceFormProps) {
  return <>
    <SectionTooltip text='Balancear Meta de Qualidade' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
    <FormControlLabel
      sx={{
        marginLeft: 0
      }}
      value="start"
      control={<Switch color="primary" />}
      label="Permitir o balanceamento dinâmico"
      labelPlacement="start"
    />
  </>
}
