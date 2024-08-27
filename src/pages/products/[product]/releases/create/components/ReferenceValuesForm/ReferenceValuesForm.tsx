import React, { useState } from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { ExpandMore } from '@mui/icons-material';
import MinMaxInput from '../MinMaxInput/MinMaxInput';
import { Characteristic, Measure, PreConfigData, Subcharacteristic } from '@customTypes/preConfig';

interface ReferenceValuesFormProps {
  configPageData: PreConfigData;
  setConfigPageData: any;
}

export default function ReferenceValuesForm({ configPageData, setConfigPageData }: ReferenceValuesFormProps) {
  function handleMeasureChange(event: React.ChangeEvent<HTMLInputElement>,
    characteristicKey: string, subcharacteristicKey: string, measureKey: string, threshold: string) {
    const { name, value, checked } = event.target;
    const newValue = Number(value);

    setConfigPageData((prevData: { characteristics: any[]; }) => {
      const currentWeightSum = prevData.characteristics
        .find((characteristic: { key: string; }) => characteristic.key === characteristicKey)
        ?.subcharacteristics
        .find((subcharacteristic: { key: string; }) => subcharacteristic.key === subcharacteristicKey)
        ?.measures.reduce((sum: any, measure: { key: string; weight: any; }) => {
          if (measure.key === measureKey) {
            return sum;
          }
          return sum + measure.weight;
        }, 0) || 0;

      if (currentWeightSum + newValue > 100) {
        return prevData;
      }

      return {
        ...prevData,
        characteristics: prevData.characteristics.map((characteristic: Characteristic) =>
          characteristic.key === characteristicKey
            ? {
              ...characteristic,
              subcharacteristics: characteristic.subcharacteristics.map((subcharacteristic: Subcharacteristic) =>
                subcharacteristic.key === subcharacteristicKey
                  ? {
                    ...subcharacteristic,
                    measures: subcharacteristic.measures.map((measure: Measure) =>
                      measure.key === measureKey
                        ? {
                          ...measure,
                          min_threshold: threshold === "min" ? newValue : measure.min_threshold,
                          max_threshold: threshold === "max" ? newValue : measure.max_threshold,
                        }
                        : measure
                    ),
                  }
                  : subcharacteristic
              ),
            }
            : characteristic
        ),
      };
    });
  };

  return (
    <>
      <SectionTooltip text='Definir Valores de Referência' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <Accordion
        defaultExpanded
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
          configPageData?.characteristics?.filter(characteristics => characteristics.active === true).map((characteristic, index) => (
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
                characteristic.subcharacteristics?.filter(subcharacteristics => subcharacteristics.active === true).map((subcharacteristic, indexSub) => (
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
                      subcharacteristic.measures?.filter(measures => measures.active === true).map((measure, indexMe) => (
                        <MinMaxInput
                          key={`metric-${index}-${indexSub}-${indexMe}`}
                          label={measure.key}
                          minInputValue={measure.min_threshold}
                          maxInputValue={measure.max_threshold}
                          setMinInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key, "min")}
                          setMaxInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key, "max")}
                          minThreshold={measure.min_threshold!}
                          maxThreshold={measure.max_threshold!}
                          tooltip=""
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
