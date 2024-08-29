import React from 'react';
import { Accordion, AccordionSummary, FormControlLabel, Switch, Typography } from '@mui/material';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { ExpandMore } from '@mui/icons-material';
import CheckboxSliderInput from '../CheckboxSliderInput/CheckboxSliderInput';
import { Characteristic, Measure, PreConfigData, Subcharacteristic } from '@customTypes/preConfig';

interface ModelConfigFormProps {
  configPageData: PreConfigData;
  setConfigPageData: any;
  changeRefValue: boolean;
  setChangeRefValue: any;
}

export default function ModelConfigForm({ configPageData, setConfigPageData, changeRefValue, setChangeRefValue }: ModelConfigFormProps) {
  function handleCharacteristicChange(event: React.ChangeEvent<HTMLInputElement>, inputValue: number, characteristicKey: string) {
    const { checked, type } = event.target;
    var newWeight = type === 'checkbox' ?
      0 : type === 'number'
        ? Number(event.target.value) : Number(inputValue);

    const currentWeightSum = configPageData.characteristics.reduce((sum: any, characteristic: { key: string; weight: any; }) => {
      if (characteristic.key === characteristicKey) {
        return sum;
      }
      return sum + characteristic.weight;
    }, 0);

    if (currentWeightSum + newWeight > 100) {
      newWeight = 100 - currentWeightSum;
    }

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
      return {
        ...prevData,
        characteristics: prevData.characteristics.map((characteristic: Characteristic) =>
          characteristic.key === characteristicKey
            ? {
              ...characteristic,
              weight: newWeight,
              active: type === 'checkbox' ? checked : characteristic.active,
            }
            : characteristic
        ),
      };
    });
  };

  function handleSubcharacteristicChange(event: React.ChangeEvent<HTMLInputElement>, inputValue: number,
    characteristicKey: string, subcharacteristicKey: string) {
    const { checked, type } = event.target;
    var newWeight = type === 'checkbox' ?
      0 : type === 'number'
        ? Number(event.target.value) : Number(inputValue);

    const currentWeightSum = configPageData.characteristics
      .find((characteristic: Characteristic) => characteristic.key === characteristicKey)
      ?.subcharacteristics.reduce((sum: any, subcharacteristic: Subcharacteristic) => {
        if (subcharacteristic.key === subcharacteristicKey) {
          return sum;
        }
        return sum + subcharacteristic.weight;
      }, 0) || 0;

    if (currentWeightSum + newWeight > 100) {
      newWeight = 100 - currentWeightSum;
    }

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
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
                    weight: newWeight,
                    active: type === 'checkbox' ? checked : subcharacteristic.active,
                  }
                  : subcharacteristic
              ),
            }
            : characteristic
        ),
      };
    });
  };

  function handleMeasureChange(event: React.ChangeEvent<HTMLInputElement>, inputValue: number,
    characteristicKey: string, subcharacteristicKey: string, measureKey: string) {
    const { checked, type } = event.target;
    var newWeight = type === 'checkbox' ?
      0 : type === 'number'
        ? Number(event.target.value) : Number(inputValue);

    const currentWeightSum = configPageData.characteristics
      .find((characteristic: Characteristic) => characteristic.key === characteristicKey)
      ?.subcharacteristics
      .find((subcharacteristic: Subcharacteristic) => subcharacteristic.key === subcharacteristicKey)
      ?.measures.reduce((sum: any, measure: Measure) => {
        if (measure.key === measureKey) {
          return sum;
        }
        return sum + measure.weight;
      }, 0) || 0;

    if (currentWeightSum + newWeight > 100) {
      newWeight = 100 - currentWeightSum;
    }

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
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
                          weight: newWeight,
                          active: type === 'checkbox' ? checked : measure.active,
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
      <SectionTooltip id='characteristicSection' text='Definir Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <Accordion
        key="CarAccordion"
        square={true}
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 3,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Caracteristicas</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristics?.map((characteristic, index) => (
            <CheckboxSliderInput
              key={`characteristic-${index}`}
              label={characteristic.key}
              inputValue={characteristic.weight}
              setInputValue={handleCharacteristicChange}
              checkboxValue={characteristic.active}
            />
          ))
        }
      </Accordion>

      <SectionTooltip id='subcharacteristicSection' text='Definir Sub-Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <Accordion
        key="SubAccordion"
        square={true}
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 3,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Sub-Características</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristics?.filter(characteristic => characteristic.active === true)
            .map((characteristic, index) => (
              <Accordion
                id={`SubCarAccordion-${characteristic.key}`}
                key={`SubCarAccordion-${index}`}
                square={true}
                sx={{
                  boxShadow: 'inherit',
                  border: 0.5,
                  backgroundColor: "transparent",
                  borderColor: "#00000040",
                  borderRadius: 3,
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
                      secLabel={characteristic.key}
                      inputValue={subcharacteristic.weight}
                      setInputValue={handleSubcharacteristicChange}
                      checkboxValue={subcharacteristic.active}
                    />
                  ))
                }
              </Accordion>
            ))
        }
      </Accordion>

      <SectionTooltip id='medidasSection' text='Definir Medidas e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
      <FormControlLabel
        sx={{
          marginLeft: 0
        }}
        control={<Switch
          checked={changeRefValue}
          onChange={() => setChangeRefValue(!changeRefValue)}
          color="primary" />}
        label="Modificar valores de referência"
        labelPlacement="start"
      />
      <Accordion
        key="MedidasAccordion"
        square={true}
        sx={{
          boxShadow: 'inherit',
          border: 0.5,
          backgroundColor: "transparent",
          borderColor: "#00000040",
          borderRadius: 3,
          marginTop: 2
        }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Medidas</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristics?.filter(characteristic => characteristic.active === true)
            .map((characteristic, index) => (
              <Accordion
                key={`SubCarAccordion-${index}`}
                square={true}
                sx={{
                  boxShadow: 'inherit',
                  border: 0.5,
                  backgroundColor: "transparent",
                  borderColor: "#00000040",
                  borderRadius: 3,
                  marginX: '1rem !important',
                  marginBottom: '1rem !important',
                }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>{characteristic.key}</Typography>
                </AccordionSummary>
                {
                  characteristic.subcharacteristics?.filter(subcharacteristics => subcharacteristics.active === true)
                    .map((subcharacteristic, indexSub) => (
                      <Accordion
                        id={`MetricSubCarAccordion-${subcharacteristic.key}`}
                        key={`MetricSubCarAccordion-${subcharacteristic.key}`}
                        square={true}
                        sx={{
                          boxShadow: 'inherit',
                          border: 0.5,
                          backgroundColor: "transparent",
                          borderColor: "#00000040",
                          borderRadius: 3,
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
                              secLabel={subcharacteristic.key}
                              terLabel={characteristic.key}
                              inputValue={measure.weight}
                              setInputValue={handleMeasureChange}
                              checkboxValue={measure.active}
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
