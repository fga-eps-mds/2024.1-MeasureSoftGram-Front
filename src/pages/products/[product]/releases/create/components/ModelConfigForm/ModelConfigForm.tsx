import React, { useState } from 'react';
import { Accordion, AccordionSummary, Box, Checkbox, FormControlLabel, Grid, hexToRgb, InputAdornment, Slider, Switch, TextField, Typography } from '@mui/material';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { ExpandMore } from '@mui/icons-material';
import CheckboxSliderInput from '../CheckboxSliderInput/CheckboxSliderInput';
import { ConfigPageData } from '../../ReleaseCreation';

interface ModelConfigFormProps {
  configPageData: ConfigPageData;
  register: any;
  errors: any;
}

export default function ModelConfigForm({ configPageData, register, errors }: ModelConfigFormProps) {
  const [test, setTest] = useState(0);
  const [testCheck, setTestCheck] = useState(false);

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTest(Number(event.target.value));
  }

  const handleCheckboxChange = (checkboxValue: boolean) => {
    setTestCheck(!checkboxValue);
  }

  return (
    <>
      <SectionTooltip text='Definir Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <Accordion
        key="CarAccordion"
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 1,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Caracteristicas</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristicData?.map((characteristic, index) => (
            <CheckboxSliderInput
              key={`characteristic-${index}`}
              label={characteristic.key}
              inputValue={test}
              setInputValue={handleFieldChange}
              checkboxValue={testCheck}
              setCheckboxValue={handleCheckboxChange}
            />
          ))
        }
      </Accordion>

      <SectionTooltip text='Definir Sub-Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <Accordion
        key="SubAccordion"
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 1,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Sub-Características</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristicData?.map((characteristic, index) => (
            <Accordion
              key={`SubCarAccordion-${index}`}
              sx={{
                boxShadow: 'inherit',
                border: 0.5,
                backgroundColor: "transparent",
                borderColor: "#00000040",
                borderRadius: 1,
                marginX: '1rem !important',
                marginBottom: '1rem !important',
              }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{characteristic.key}</Typography>
              </AccordionSummary>
              {
                characteristic.subcharacteristics?.map((subcharacteristic, indexSub) => (
                  <CheckboxSliderInput
                    key={`subcharacteristics-${index}-${indexSub}`}
                    label={subcharacteristic.key}
                    inputValue={test}
                    setInputValue={handleFieldChange}
                    checkboxValue={testCheck}
                    setCheckboxValue={handleCheckboxChange}
                  />
                ))
              }
            </Accordion>
          ))
        }
      </Accordion>

      <SectionTooltip text='Definir Medidas e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <FormControlLabel
        sx={{
          marginLeft: 0
        }}
        value="start"
        control={<Switch color="primary" />}
        label="Modificar valores de referência"
        labelPlacement="start"
      />
      <Accordion
        key="MedidasAccordion"
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 1,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Medidas</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristicData?.map((characteristic, index) => (
            <Accordion
              key={`SubCarAccordion-${index}`}
              sx={{
                boxShadow: 'inherit',
                border: 0.5,
                backgroundColor: "transparent",
                borderColor: "#00000040",
                borderRadius: 1,
                marginX: '1rem !important',
                marginBottom: '1rem !important',
              }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{characteristic.key}</Typography>
              </AccordionSummary>
              {
                characteristic.subcharacteristics?.map((subcharacteristic, indexSub) => (
                  <Accordion
                    key={`MetricSubCarAccordion-${index}-${indexSub}`}
                    sx={{
                      boxShadow: 'inherit',
                      border: 0.5,
                      backgroundColor: "transparent",
                      borderColor: "#00000040",
                      borderRadius: 1,
                      marginX: '1rem !important',
                      marginBottom: '1rem !important',
                    }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>{subcharacteristic.key}</Typography>
                    </AccordionSummary>
                    {
                      subcharacteristic.measures?.map((measure, indexMe) => (
                        <CheckboxSliderInput
                          key={`metric-${index}-${indexSub}-${indexMe}`}
                          label={measure.key}
                          inputValue={test}
                          setInputValue={handleFieldChange}
                          checkboxValue={testCheck}
                          setCheckboxValue={handleCheckboxChange}
                        />
                      ))
                    }
                  </Accordion>
                ))
              }
            </Accordion>
          ))
        }
      </Accordion>
    </>
  );
}
