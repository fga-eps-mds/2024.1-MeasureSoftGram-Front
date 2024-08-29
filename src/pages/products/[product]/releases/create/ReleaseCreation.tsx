import React, { useEffect, useState } from 'react';

import { Alert, Box, Breadcrumbs, Button, IconButton, Link, Modal, Typography } from '@mui/material';
import * as Styles from './styles';
import { Changes, PreConfigEntitiesRelationship } from '@customTypes/product';
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
import ConfirmationModal from '@components/ConfirmationModal';
import { balanceMatrixService } from '@services/balanceMatrix';
import { enqueueSnackbar, SnackbarProvider } from '@components/snackbar';
import { t } from 'i18next';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalText, setModalText] = useState("");
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
          const currentReleaseGoal = await productQuery.getCurrentReleaseGoal(organization, product);
          setReleaseGoal(currentReleaseGoal.data);

          const entitiesRelationship = await productQuery.getPreConfigEntitiesRelationship(organization, product);
          setPreConfigEntitiesRelationship(entitiesRelationship.data);

          const defaultPreConfigResult = await productQuery.getProductDefaultPreConfig(organization, product);
          setConfigPageData(formatConfig(defaultPreConfigResult.data, currentReleaseGoal));
          setConfigDefaultPageData(formatConfig(defaultPreConfigResult.data, currentReleaseGoal));

          const currentPreConfigResult = await productQuery.getProductCurrentPreConfig(organization, product);
          setLastConfigPageData(formatConfig(mergeWithDefault(currentPreConfigResult.data.data, defaultPreConfigResult.data), currentReleaseGoal));

          const balance = await balanceMatrixService.getBalanceMatrix();
          setCharacteristicRelations(balance.data.result);
        } catch (error) {
          console.log(error)
        }
      }

      getPreConfig();
    };
  }, [router.isReady]);

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
      await api.get(`/organizations/${organizationId}/products/${productId}/create/release/is-valid/?nome=${getValues("name")}&dt-inicial=${getValues("startDate")}&dt-final=${getValues("endDate")}`)
      setActiveStep(activeStep + 1);
    } catch (error: any) {
      enqueueSnackbar(`${error.response.data.detail}`, { autoHideDuration: 10000, variant: 'error' })
    }
  };

  function handleChangeRefValue(value: boolean) {
    if (value)
      setShowConfirmationModal(value);

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
      <Modal
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
          paddingTop: 1
        }}>
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Atenção</h3>
              <IconButton onClick={() => setShowConfirmationModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Alert
              icon={<WarningIcon />}
              severity="warning"
              sx={{ margin: '10px 0' }}
            >
              {activeStep == 1 ? "Os valores de referência afetam como algumas medidas são calculadas. Alguns deles não podem ser modificados." : "O balanceamento das metas funciona com base em uma matriz de relacionamento entre as características de qualidade (link). Ao permitir o balanceamento dinâmico, o sistema faz com que essas relações sejam ignoradas, dessa forma, alguns objetivos definidos podem ser inalcançáveis."}
            </Alert>
            <Box sx={{ width: '100%' }}>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (activeStep == 1)
                    handleChangeRefValue(true);
                  else
                    handleChangeDinamicBalance(true)

                  setShowConfirmationModal(false)
                }}
                sx={{ width: '100%' }}
              >
                Continuar
              </Button>
            </Box>
          </>

        </Box>
      </Modal>
    </>
  );
}

ReleaseInfo.getLayout = getLayout;

export default ReleaseInfo;
