import React, { useEffect, useState } from 'react';

import { Box, Breadcrumbs, Button, Link } from '@mui/material';
import * as Styles from './styles';
import { Change, PreConfigEntitiesRelationship, ReleaseGoal } from '@customTypes/product';
import { useForm } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { useRouter } from 'next/router';
import getLayout from '@components/Layout';
import BasicInfoForm from './components/BasicInfoForm/BasicInfoForm';
import ModelConfigForm from './components/ModelConfigForm/ModelConfigForm';
import { Characteristic, Measure, PreConfigData, Subcharacteristic } from '@customTypes/preConfig';
import ReferenceValuesForm from './components/ReferenceValuesForm/ReferenceValuesForm';
import CharacteristicsBalanceForm from './components/CharacteristicsBalanceForm/CharacteristicsBalanceForm';
import api from '@services/api';
import { productQuery } from '@services/product';
import { balanceMatrixService } from '@services/balanceMatrix';
import { enqueueSnackbar, SnackbarProvider } from '@components/snackbar';
import WarningModal from '@components/WarningModal/WarningModal';

export interface ReleaseInfoForm {
  release_name: string;
  description: string;
  start_at: string;
  end_at: string;
  goal: number;
}

function ReleaseInfo() {
  const [organizationId, setOrganizationId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [activeStep, setActiveStep] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [changeRefValue, setChangeRefValue] = useState<boolean>(false);
  const [followLastConfig, setFollowLastConfig] = useState<boolean>(false);
  const [dinamicBalance, setDinamicBalance] = useState<boolean>(false);
  const [defaultPageData, setConfigDefaultPageData] = useState<PreConfigData>();
  const [lastConfigPageData, setLastConfigPageData] = useState<PreConfigData>();
  const [configPageData, setConfigPageData] = useState<PreConfigData>();
  const [characteristicRelations, setCharacteristicRelations] = useState<any>();
  const [preConfigEntitiesRelationship, setPreConfigEntitiesRelationship] = useState<PreConfigEntitiesRelationship[]>();
  const [releaseGoal, setReleaseGoal] = useState<any>();

  const router = useRouter();
  const routerParams: any = router.query;

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch, trigger } = useForm<ReleaseInfoForm>({
    mode: "all",
    defaultValues: {
      end_at: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      start_at: format(new Date(), 'yyyy-MM-dd'),
      goal: 0,
      release_name: '',
      description: '',
    }
  });

  useEffect(() => {
    if (router.isReady) {
      const organization = routerParams.product.split('-')[0];
      const productIdentifier = routerParams.product.split('-')[1];
      const productTitle = routerParams.product.split('-')[2];

      setOrganizationId(organization);
      setProductId(productIdentifier);
      setProductName(productTitle);

      const getPreConfig = async () => {
        try {
          const currentReleaseGoal = await productQuery.getCurrentReleaseGoal(organization, productIdentifier);
          setReleaseGoal(currentReleaseGoal.data);

          const entitiesRelationship = await productQuery.getPreConfigEntitiesRelationship(organization, productIdentifier);
          setPreConfigEntitiesRelationship(entitiesRelationship.data);

          const defaultPreConfigResult = await productQuery.getProductDefaultPreConfig(organization, productIdentifier);
          setConfigPageData(formatConfig(defaultPreConfigResult.data, currentReleaseGoal));
          setConfigDefaultPageData(formatConfig(defaultPreConfigResult.data, currentReleaseGoal));

          const currentPreConfigResult = await productQuery.getProductCurrentPreConfig(organization, productIdentifier);
          setLastConfigPageData(formatConfig(mergeWithDefault(currentPreConfigResult.data.data, defaultPreConfigResult.data), currentReleaseGoal));

          const balance = await balanceMatrixService.getBalanceMatrix();
          setCharacteristicRelations(balance.data.result);
        } catch (error) {
          enqueueSnackbar(`Não foi possível acessar os dados de planejamento de release`, { autoHideDuration: 10000, variant: 'error' })
        }
      }

      getPreConfig();
    };
  }, [router.isReady, routerParams.product]);

  function mergeWithDefault(current: PreConfigData, defaultData: PreConfigData): PreConfigData {
    const findOrCreate = <T extends { key: string }>(array: T[], key: string, defaultEntry: T): T => {
      const entry = array.find(item => item.key === key);
      return entry ? entry : { ...defaultEntry, key, weight: 0, active: false };
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

  function formatConfig(data: PreConfigData, currentReleaseGoal: any): PreConfigData {
    data.characteristics.forEach(characteristic => {
      characteristic.goal = currentReleaseGoal.data.data[characteristic.key] ?? 0;
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
      await api.get(`/organizations/${organizationId}/products/${productId}/create/release/is-valid/?nome=${getValues("release_name")}&dt-inicial=${getValues("start_at")}&dt-final=${getValues("end_at")}`)
      setActiveStep(activeStep + 1);
    } catch (error: any) {
      enqueueSnackbar(`${error.response.data.detail}`, { autoHideDuration: 10000, variant: 'error' })
    }
  };

  function handleChangeRefValue(value: boolean) {
    if (value)
      setShowConfirmationModal(value);
    else


      setChangeRefValue(value)
  }

  function handleChangeDinamicBalance(value: boolean) {
    if (value)
      setShowConfirmationModal(value);

    setDinamicBalance(value)
  }

  function renderStep(): React.ReactNode {
    switch (activeStep) {
      case 0:
        return <BasicInfoForm configPageData={configPageData!} trigger={trigger} register={register} errors={errors} watch={watch} followLastConfig={followLastConfig} setFollowLastConfig={handleSetFollowLastConfig} />
      case 1:
        return <ModelConfigForm changeRefValue={changeRefValue} setChangeRefValue={handleChangeRefValue} configPageData={configPageData!} setConfigPageData={setConfigPageData}></ModelConfigForm>
      case 2:
        return <ReferenceValuesForm configPageData={configPageData!} defaultPageData={defaultPageData!} setConfigPageData={setConfigPageData}></ReferenceValuesForm>
      case 3:
        return <CharacteristicsBalanceForm characteristicRelations={characteristicRelations} configPageData={configPageData!} setConfigPageData={setConfigPageData} dinamicBalance={dinamicBalance} setDinamicBalance={handleChangeDinamicBalance}></CharacteristicsBalanceForm>
    }
  }

  function handlePreviousButtonClick(): void {
    if (activeStep == 3 && !changeRefValue)
      setActiveStep(activeStep - 2);
    else if (activeStep > 0)
      setActiveStep(activeStep - 1);
  }

  function findItemWithSumNotEqualTo100(items: { key: string; weight: number; active?: boolean }[]) {
    return items.filter(item => item.active).reduce((sum, item) => {
      return sum + item.weight;
    }, 0) !== 100
      ? items.find(item => item.active)?.key
      : null;
  }

  function isConfigDataWeightValid(): boolean {
    const invalidCharacteristics = findItemWithSumNotEqualTo100(configPageData!.characteristics);

    if (invalidCharacteristics && invalidCharacteristics?.length > 0) {
      enqueueSnackbar(`A soma dos pesos das características deve ser igual a 100`, { autoHideDuration: 10000, variant: 'error' })
      document.getElementById("characteristicSection")?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    const invalidSubcharacteristics = configPageData!.characteristics
      .filter(characteristic => characteristic.active)
      .map(characteristic => {
        const invalidKey = findItemWithSumNotEqualTo100(characteristic.subcharacteristics);
        return invalidKey ? characteristic.key : null; // Retorna o nome da característica se inválido
      })
      .filter(key => key !== null);


    if (invalidSubcharacteristics && invalidSubcharacteristics?.length > 0) {
      console.log(invalidSubcharacteristics[0])
      enqueueSnackbar(`A soma dos pesos das sub-características deve ser igual a 100`, { autoHideDuration: 10000, variant: 'error' })
      document.getElementById(`SubCarAccordion-${invalidSubcharacteristics[0]}`)?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    const invalidMeasures = configPageData!.characteristics
      .filter(characteristic => characteristic.active)
      .flatMap(characteristic =>
        characteristic.subcharacteristics
          .filter(subcharacteristic => subcharacteristic.active)
          .map(subcharacteristic => {
            const invalidMeasureKey = findItemWithSumNotEqualTo100(subcharacteristic.measures);
            return invalidMeasureKey ? subcharacteristic.key : null; // Retorna o nome da subcaracterística se inválido
          })
      )
      .filter(key => key !== null);

    if (invalidMeasures && invalidMeasures?.length > 0) {
      enqueueSnackbar(`A soma dos pesos das medidas deve ser igual a 100`, { autoHideDuration: 10000, variant: 'error' })
      document.getElementById(`MetricSubCarAccordion-${invalidMeasures[0]}`)?.scrollIntoView({ behavior: "smooth" });
      return false;
    }

    return true;
  }

  async function handleNextButtonClick(): Promise<void> {
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
        submitRelease();
    }
  }

  async function submitRelease() {
    const goalChanges = generateChanges();
    const release = getValues();
    const finalConfig = cleanConfigData();

    try {
      await productQuery.postPreConfig(organizationId, productId, { name: productName, data: finalConfig });
      const productGoalResult = await productQuery.createProductGoal(organizationId, productId, goalChanges);

      release.goal = productGoalResult.data.id;

      await productQuery.createProductRelease(organizationId, productId, release);

      router.push(`/products/${router.query.product}/releases/`);
      enqueueSnackbar(`Release Criada`, { autoHideDuration: 10000, variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(`${error.response.data.message}`, { autoHideDuration: 10000, variant: 'error' });
    }

  }

  function generateChanges(): ReleaseGoal {
    const changes: Change[] = [];

    configPageData!.characteristics.forEach((characteristic: Characteristic) => {
      if (characteristic.active) {
        const referenceGoal = releaseGoal.data[characteristic.key] ?? 0;
        if (referenceGoal !== characteristic.goal) {
          const delta = characteristic.goal - referenceGoal;
          changes.push({
            characteristic_key: characteristic.key,
            delta: delta,
          });
        }
      }
    });

    return { changes: changes, allow_dynamic: dinamicBalance };
  }

  function cleanConfigData() {
    return {
      ...configPageData,
      characteristics: configPageData!.characteristics
        .filter((characteristic: Characteristic) => characteristic.active)
        .map((characteristic: Characteristic) => ({
          ...removeProperties(characteristic),
          subcharacteristics: characteristic.subcharacteristics
            .filter((sub: Subcharacteristic) => sub.active)
            .map((sub: Subcharacteristic) => ({
              ...removeProperties(sub),
              measures: sub.measures
                .filter((measure: Measure) => measure.active)
                .map((measure: Measure) => removeProperties(measure))
            }))
        }))
    };
  }

  function removeProperties(obj: any) {
    const { goal, active, ...rest } = obj;
    return rest;
  }

  function handleModalBtnClick() {
    if (activeStep == 1)
      handleChangeRefValue(true);
    else
      handleChangeDinamicBalance(true)

    setShowConfirmationModal(false)
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
      <SnackbarProvider>
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
            <form onSubmit={handleSubmit(handleNextButtonClick)}>
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
                  <Button onClick={() => handlePreviousButtonClick()} variant="outlined">
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
      </SnackbarProvider>
      <WarningModal
        setIsModalOpen={setShowConfirmationModal} text={activeStep == 1 ? "Os valores de referência afetam como algumas medidas são calculadas. Alguns deles não podem ser modificados." : "O balanceamento das metas funciona com base em uma matriz de relacionamento entre as características de qualidade. Ao permitir o balanceamento dinâmico, o sistema faz com que essas relações sejam ignoradas, dessa forma, alguns objetivos definidos podem ser inalcançáveis."}
        btnText='Continuar' isModalOpen={showConfirmationModal} handleBtnClick={handleModalBtnClick} />
    </>
  );
}

ReleaseInfo.getLayout = getLayout;

export default ReleaseInfo;
