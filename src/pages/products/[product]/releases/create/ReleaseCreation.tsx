import React, { useEffect, useState } from 'react';

import { Box, Breadcrumbs, Button, Link } from '@mui/material';
import * as Styles from './styles';
import { Changes, PreConfigEntitiesRelationship } from '@customTypes/product';
import { useForm } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/router';
import getLayout from '@components/Layout';
import { useProductCurrentPreConfig } from '@hooks/useProductCurrentPreConfig';
import BasicInfoForm from './components/BasicInfoForm/BasicInfoForm';
import ModelConfigForm from './components/ModelConfigForm/ModelConfigForm';
import { Characteristic } from '@customTypes/preConfig';
import ReferenceValuesForm from './components/ReferenceValuesForm/ReferenceValuesForm';
import CharacteristicsBalanceForm from './components/CharacteristicsBalanceForm/CharacteristicsBalanceForm';
import api from '@services/api';
import { productQuery } from '@services/product';

interface ReleaseInfoForm {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  characteristics: string[];
  changes: Changes[];
}

export interface ConfigPageData {
  characteristicCheckbox: string[];
  setCharacteristicCheckbox: (characteristicCheckbox: string[]) => void;
  subcharacterCheckbox: string[];
  setSubcharacterCheckbox: (subcharacterCheckbox: string[]) => void;
  measureCheckbox: string[];
  setMeasureCheckbox: (measureCheckbox: string[]) => void;
  characteristicData: Characteristic[];
  setCharacteristicValuesValid: (value: boolean) => void;
}

function ReleaseInfo() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [changeRefValue, setChangeRefValue] = useState<boolean>(true);
  const [followLastConfig, setFollowLastConfig] = useState<boolean>(false);
  const [configPageData, setConfigPageData] = useState<ConfigPageData>(() => ({
    characteristicCheckbox: [],
    setCharacteristicCheckbox: (checkboxes: string[]) => { },
    subcharacterCheckbox: [],
    setSubcharacterCheckbox: (checkboxes: string[]) => { },
    measureCheckbox: [],
    setMeasureCheckbox: (checkboxes: string[]) => { },
    characteristicData: [],
    setCharacteristicValuesValid: (value: boolean) => { },
  }));

  const router = useRouter();
  const routerParams: any = router.query;

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch, trigger } = useForm<ReleaseInfoForm>({
    mode: "all",
    defaultValues: {
      endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      startDate: format(new Date(), 'yyyy-MM-dd'),
      changes: [],
      characteristics: [],
      name: '',
      description: '',
    }
  });

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const organization = routerParams.product.split('-')[0];
      const product = routerParams.product.split('-')[1];

      setOrganizationId(organization);
      setProductId(product);

      const getPreConfig = async () => {
        try {
          const preConfigResult = await productQuery.getProductCurrentPreConfig(organization, product);
          console.log(preConfigResult.data)
        } catch (error) {

        }
      }

      getPreConfig();
    };
  }, [router.isReady]);

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
        return <BasicInfoForm configPageData={configPageData} trigger={trigger} register={register} errors={errors} watch={watch} followLastConfig={followLastConfig} setFollowLastConfig={setFollowLastConfig} />
      case 1:
        return <ModelConfigForm configPageData={configPageData} register={register} errors={errors}></ModelConfigForm>
      case 2:
        return <ReferenceValuesForm configPageData={configPageData} register={register} errors={errors}></ReferenceValuesForm>
      case 3:
        return <CharacteristicsBalanceForm configPageData={configPageData} register={register} errors={errors} dinamicBalance={followLastConfig} setDinamicBalance={setFollowLastConfig}></CharacteristicsBalanceForm>
    }
  }

  function previousButtonClick(): void {
    if (activeStep == 3 && !changeRefValue)
      setActiveStep(activeStep - 2);
    else if (activeStep > 0)
      setActiveStep(activeStep - 1);
  }

  async function nextButtonClick(data: any): Promise<void> {
    if (activeStep == 0) {
      await checkBasicValues();
    }
    else if (activeStep == 1 && !changeRefValue)
      setActiveStep(activeStep + 2);
    else if (activeStep < 3)
      setActiveStep(activeStep + 1);
    else
      handleSubmit(checkBasicValues)
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
