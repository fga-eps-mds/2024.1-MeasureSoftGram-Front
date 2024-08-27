import React, { useEffect, useState } from 'react';

import { Box, Breadcrumbs, Button, Link } from '@mui/material';
import * as Styles from './styles';
import { Changes } from '@customTypes/product';
import { useForm } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/router';
import getLayout from '@components/Layout';
import BasicInfoForm from './components/BasicInfoForm/BasicInfoForm';
import ModelConfigForm from './components/ModelConfigForm/ModelConfigForm';
import { PreConfigData } from '@customTypes/preConfig';
import ReferenceValuesForm from './components/ReferenceValuesForm/ReferenceValuesForm';
import CharacteristicsBalanceForm from './components/CharacteristicsBalanceForm/CharacteristicsBalanceForm';
import api from '@services/api';
import { productQuery } from '@services/product';

interface ReleaseInfoForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: number;
  changes: Changes[];
}

function ReleaseInfo() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [changeRefValue, setChangeRefValue] = useState<boolean>(false);
  const [followLastConfig, setFollowLastConfig] = useState<boolean>(false);
  const [defaultPageData, setConfigDefaultPageData] = useState<PreConfigData>();
  const [configPageData, setConfigPageData] = useState<PreConfigData>();
  const [lastConfigPageData, setLastConfigPageData] = useState<PreConfigData>();

  const router = useRouter();
  const routerParams: any = router.query;

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch, trigger } = useForm<ReleaseInfoForm>({
    mode: "all",
    defaultValues: {
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      changes: [],
      goal: 0,
      name: '',
      description: '',
    }
  });

  useEffect(() => {
    if (router.isReady) {
      const organization = routerParams.product.split('-')[0];
      const product = routerParams.product.split('-')[1];

      setOrganizationId(organization);
      setProductId(product);

      const getPreConfig = async () => {
        try {
          const currentPreConfigResult = await productQuery.getProductCurrentPreConfig(organization, product);
          const defaultPreConfigResult = await productQuery.getProductDefaultPreConfig(organization, product);
          const entitiesRelationship = await productQuery.getPreConfigEntitiesRelationship(organization, product);
          const currentReleaseGoal = await productQuery.getCurrentReleaseGoal(organization, product);

          setLastConfigPageData(formatConfig(updateWithDefault(currentPreConfigResult.data.data, defaultPreConfigResult.data)));
          setConfigPageData(formatConfig(defaultPreConfigResult.data));
          setConfigDefaultPageData(formatConfig(defaultPreConfigResult.data));
        } catch (error) {

        }
      }

      getPreConfig();
    };
  }, [router.isReady]);

  function updateWithDefault(current: PreConfigData, defaultData: PreConfigData): PreConfigData {
    const findOrCreate = <T extends { key: string }>(array: T[], key: string, defaultEntry: T): T => {
      const entry = array.find(item => item.key === key);
      return entry ? entry : { ...defaultEntry, key, weight: 0 };
    };

    const updatedCharacteristics = defaultData.characteristics.map(defaultChar => {
      const currentChar = findOrCreate(current.characteristics, defaultChar.key, defaultChar);

      const updatedSubcharacteristics = defaultChar.subcharacteristics.map(defaultSub => {
        const currentSub = findOrCreate(currentChar.subcharacteristics, defaultSub.key, defaultSub);

        const updatedMeasures = defaultSub.measures.map(defaultMeasure => {
          return findOrCreate(currentSub.measures, defaultMeasure.key, defaultMeasure);
        });

        return {
          ...currentSub,
          measures: updatedMeasures
        };
      });

      return {
        ...currentChar,
        subcharacteristics: updatedSubcharacteristics
      };
    });

    return {
      ...current,
      characteristics: updatedCharacteristics
    };
  };

  function formatConfig(data: PreConfigData): PreConfigData {
    data.characteristics.forEach(characteristic => {
      if (characteristic.weight > 0) {
        characteristic.active = true;
      }
      characteristic.subcharacteristics.forEach(subcharacteristic => {
        if (subcharacteristic.weight > 0 && characteristic.active) {
          subcharacteristic.active = true;
        }
        subcharacteristic.measures.forEach(measure => {
          if (measure.weight > 0 && subcharacteristic.active) {
            measure.active = true;
          }
        });
      });
    });

    return data;
  }

  function handleSetFollowLastConfig(value: boolean) {
    if (value)
      setConfigPageData(lastConfigPageData!);
    else
      setConfigPageData(defaultPageData!);

    setFollowLastConfig(value)
  }

  async function checkBasicValues() {
    if (Object.keys(errors).length != 0)
      return;

    try {
      await api.get(`/organizations/${organizationId}/products/${productId}/create/release/is-valid/?nome=${getValues("name")}&dt-inicial=${getValues("startDate")}&dt-final=${getValues("endDate")}`)
      setActiveStep(activeStep + 1);
    } catch (error) {

    }
  };

  function renderStep(): React.ReactNode {
    switch (activeStep) {
      case 0:
        return <BasicInfoForm configPageData={configPageData!} trigger={trigger} register={register} errors={errors} watch={watch} followLastConfig={followLastConfig} setFollowLastConfig={handleSetFollowLastConfig} />
      case 1:
        return <ModelConfigForm changeRefValue={changeRefValue} setChangeRefValue={setChangeRefValue} configPageData={configPageData!} setConfigPageData={setConfigPageData}></ModelConfigForm>
      case 2:
        return <ReferenceValuesForm configPageData={configPageData!} setConfigPageData={setConfigPageData}></ReferenceValuesForm>
      case 3:
        return <CharacteristicsBalanceForm configPageData={configPageData!} register={register} errors={errors} dinamicBalance={followLastConfig} setDinamicBalance={setFollowLastConfig}></CharacteristicsBalanceForm>
    }
  }

  function previousButtonClick(): void {
    if (activeStep == 3 && !changeRefValue)
      setActiveStep(activeStep - 2);
    else if (activeStep > 0)
      setActiveStep(activeStep - 1);
  }

  const isSumEqualTo100 = (items: { weight: number; active?: boolean }[]) => {
    return items
      .filter(item => item.active)
      .reduce((sum, item) => sum + item.weight, 0) === 100;
  };

  function isConfigDataWeightValid(): boolean {
    const isCharacteristicsValid = isSumEqualTo100(configPageData!.characteristics);

    if (!isCharacteristicsValid) {
      //showModalError();
      return false;
    }

    const isSubcharacteristicsValid = configPageData!.characteristics
      .filter(characteristic => characteristic.active)
      .every(characteristic => isSumEqualTo100(characteristic.subcharacteristics));

    if (!isSubcharacteristicsValid) {
      //showModalError();
      return false;
    }

    const isMeasuresValid = configPageData!.characteristics
      .filter(characteristic => characteristic.active)
      .every(characteristic =>
        characteristic.subcharacteristics
          .filter(subcharacteristic => subcharacteristic.active)
          .every(subcharacteristic => isSumEqualTo100(subcharacteristic.measures))
      );

    if (!isMeasuresValid) {
      //showModalError();
      return false;
    }

    return true;
  }

  async function nextButtonClick(data: any): Promise<void> {
    switch (activeStep) {
      case 0:
        await checkBasicValues();
        break;
      case 1:
        if (!isConfigDataWeightValid()) break;

        if (!changeRefValue) setActiveStep(activeStep + 2);
        else setActiveStep(activeStep + 1);
        break;
      case 2:
        setActiveStep(activeStep + 1);
        break;
      case 3:
        handleSubmit(checkBasicValues)
    }
  }

  function renderBreadcrumb(label: string, step: number): any {
    if (step == 2 && !changeRefValue) return

    return <Link
      key={step}
      sx={{
        cursor: 'pointer',
        textDecoration: 'none',
        color: activeStep === step ? "text.primary" : "text.secondary",
        fontWeight: activeStep === step ? '800' : 'normal',
      }}
      onClick={() => setActiveStep(step)}
    >
      {label}
    </Link>
  }

  return (
    <>
      <Styles.Header>
        <h1 style={{ color: '#33568E', fontWeight: '500' }}>Planejamento de Release</h1>
        <Breadcrumbs
          separator={<Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />}
          sx={{ fontSize: '14px' }}
        >
          {[
            { label: 'Criar Release', step: 0 },
            { label: 'Definir configuração do modelo', step: 1 },
            { label: 'Alterar valores de referência', step: 2 },
            { label: 'Balancear características', step: 3 },
          ].map(({ label, step }) => renderBreadcrumb(label, step))}
        </Breadcrumbs>
      </Styles.Header>
      <Styles.Body>
        <Box>
          <form onSubmit={handleSubmit(nextButtonClick)}>
            {renderStep()}

            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                gridTemplateColumns: activeStep != 0 ? 'repeat(2, 1fr)' : "none",
                marginTop: 2
              }}
            >
              {activeStep != 0 &&
                <Button onClick={() => previousButtonClick()} variant="outlined">
                  Voltar
                </Button>
              }
              <Button type="submit" variant="contained">
                {activeStep < 3 ? "Avançar" : "Finalizar"}
              </Button>
            </Box>
          </form>
        </Box>
      </Styles.Body >
    </>
  );
}

ReleaseInfo.getLayout = getLayout;

export default ReleaseInfo;
