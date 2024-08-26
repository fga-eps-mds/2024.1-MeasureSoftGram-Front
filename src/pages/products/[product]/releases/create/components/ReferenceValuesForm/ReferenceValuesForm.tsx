import React, { useState } from 'react';
import { Accordion, AccordionSummary, Box, Checkbox, FormControlLabel, Grid, hexToRgb, InputAdornment, Slider, Switch, TextField, Typography } from '@mui/material';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { ExpandMore } from '@mui/icons-material';
import CheckboxSliderInput from '../CheckboxSliderInput/CheckboxSliderInput';
import { ConfigPageData } from '../../ReleaseCreation';
import MinMaxInput from '../MinMaxInput/MinMaxInput';

interface ReferenceValuesFormProps {
  configPageData: ConfigPageData;
  register: any;
  errors: any;
}

export default function ReferenceValuesForm({ configPageData, register, errors }: ReferenceValuesFormProps) {
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
      <SectionTooltip text='Definir Valores de Referência' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
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
          <Typography>Valores de Referência</Typography>
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
                        <MinMaxInput
                          key={`metric-${index}-${indexSub}-${indexMe}`}
                          label={measure.key}
                          minInputValue={test}
                          maxInputValue={test}
                          setMinInputValue={handleFieldChange}
                          setMaxInputValue={handleFieldChange}
                          minThreshold={measure.min_threshold!}
                          maxThreshold={measure.max_threshold!}
                          tooltip="Teste"
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
