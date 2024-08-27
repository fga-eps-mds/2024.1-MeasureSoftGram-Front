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
  setChangeRefValue: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModelConfigForm({ configPageData, setConfigPageData, changeRefValue, setChangeRefValue }: ModelConfigFormProps) {
  function handleCharacteristicChange(event: React.ChangeEvent<HTMLInputElement>, characteristicKey: string) {
    const { name, value, checked, type } = event.target;
    const newWeight = type === 'checkbox' ? 0 : Number(value);

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
      const currentWeightSum = prevData.characteristics.reduce((sum: any, characteristic: { key: string; weight: any; }) => {
        if (characteristic.key === characteristicKey) {
          return sum;
        }
        return sum + characteristic.weight;
      }, 0);

      if (currentWeightSum + newWeight > 100) {
        return prevData;
      }

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

  function handleSubcharacteristicChange(event: React.ChangeEvent<HTMLInputElement>,
    characteristicKey: string, subcharacteristicKey: string) {
    const { name, value, checked, type } = event.target;
    const newWeight = type === 'checkbox' ? 0 : Number(value);

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
      const currentWeightSum = prevData.characteristics
        .find((characteristic: Characteristic) => characteristic.key === characteristicKey)
        ?.subcharacteristics.reduce((sum: any, subcharacteristic: Subcharacteristic) => {
          if (subcharacteristic.key === subcharacteristicKey) {
            return sum;
          }
          return sum + subcharacteristic.weight;
        }, 0) || 0;

      if (currentWeightSum + newWeight > 100) {
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

  function handleMeasureChange(event: React.ChangeEvent<HTMLInputElement>,
    characteristicKey: string, subcharacteristicKey: string, measureKey: string) {
    const { name, value, checked, type } = event.target;
    const newWeight = type === 'checkbox' ? 0 : Number(value);

    setConfigPageData((prevData: { characteristics: Characteristic[]; }) => {
      const currentWeightSum = prevData.characteristics
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
      <SectionTooltip text='Definir Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
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
              setInputValue={(event: React.ChangeEvent<HTMLInputElement>) => handleCharacteristicChange(event, characteristic.key)}
              checkboxValue={characteristic.active}
              setCheckboxValue={(event: React.ChangeEvent<HTMLInputElement>) => handleCharacteristicChange(event, characteristic.key)}
            />
          ))
        }
      </Accordion>

      <SectionTooltip text='Definir Sub-Características e Pesos Utilizados' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
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
                      inputValue={subcharacteristic.weight}
                      setInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleSubcharacteristicChange(event, characteristic.key, subcharacteristic.key)}
                      checkboxValue={subcharacteristic.active}
                      setCheckboxValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                        handleSubcharacteristicChange(event, characteristic.key, subcharacteristic.key)}
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
                        key={`MetricSubCarAccordion-${index}-${indexSub}`}
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
                              inputValue={measure.weight}
                              setInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key)}
                              checkboxValue={measure.active}
                              setCheckboxValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key)}
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
