import React, { } from 'react';
import { Accordion, AccordionSummary, Typography } from '@mui/material';
import SectionTooltip from '../SectionTooltip/SectionTooltip';
import { ExpandMore } from '@mui/icons-material';
import MinMaxInput from '../MinMaxInput/MinMaxInput';
import { Characteristic, Measure, PreConfigData, Subcharacteristic } from '@customTypes/preConfig';
import { useTranslation } from 'react-i18next';


interface ReferenceValuesFormProps {
  configPageData: PreConfigData;
  defaultPageData: PreConfigData;
  setConfigPageData: any;
}

export default function ReferenceValuesForm({ configPageData, defaultPageData, setConfigPageData }: ReferenceValuesFormProps) {
  const { t } = useTranslation('plan_release');

  function handleMeasureChange(event: React.ChangeEvent<HTMLInputElement>,
    characteristicKey: string, subcharacteristicKey: string, measureKey: string, threshold: string) {
    const { name, value, checked } = event.target;
    const newValue = Number(value);

    setConfigPageData((prevData: { characteristics: any[]; }) => {
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
      <SectionTooltip text={t("defineRefValues")} tooltip={t("defineRefValuesTooltip")} ></SectionTooltip>
      <Accordion
        defaultExpanded
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
          <Typography>{t("refValues")}</Typography>
        </AccordionSummary>
        {
          configPageData?.characteristics?.filter(characteristics => characteristics.active === true).map((characteristic, index) => (
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
                <Typography>{t("characteristics." + characteristic.key)}</Typography>
              </AccordionSummary>
              {
                characteristic.subcharacteristics?.filter(subcharacteristics => subcharacteristics.active === true).map((subcharacteristic, indexSub) => (
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
                      <Typography>{t("subCharacteristics." + subcharacteristic.key)}</Typography>
                    </AccordionSummary>
                    {
                      subcharacteristic.measures?.filter(measures => measures.active === true).map((measure, indexMe) => (
                        <MinMaxInput
                          key={`metric-${index}-${indexSub}-${indexMe}`}
                          label={t("measures." + measure.key)}
                          minInputValue={measure.min_threshold}
                          maxInputValue={measure.max_threshold}
                          setMinInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key, "min")}
                          setMaxInputValue={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleMeasureChange(event, characteristic.key, subcharacteristic.key, measure.key, "max")}
                          minThreshold={defaultPageData.characteristics
                            .find(c => c.key === characteristic.key)
                            ?.subcharacteristics
                            .find(sc => sc.key === subcharacteristic.key)
                            ?.measures
                            .find(m => m.key === measure.key)
                            ?.min_threshold!}
                          maxThreshold={defaultPageData.characteristics
                            .find(c => c.key === characteristic.key)
                            ?.subcharacteristics
                            .find(sc => sc.key === subcharacteristic.key)
                            ?.measures
                            .find(m => m.key === measure.key)
                            ?.max_threshold!}
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
