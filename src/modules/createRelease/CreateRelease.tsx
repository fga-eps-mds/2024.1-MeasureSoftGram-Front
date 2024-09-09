import React, { useEffect, useState } from 'react';
import { Alert, Container, Snackbar } from '@mui/material';

import DrawerMenu from '@components/DrawerMenu';
import { ButtonType, Product } from '@customTypes/product';
import api from '@services/api';
import { useSnackbar } from 'notistack';
import ConfigPage from './components/ConfigPage';
import ReleaseInfo from './components/ReleaseInfo';
import ReleaseGoals from './components/ReleaseGoals';

import { CreateReleaseProvider, useCreateReleaseContext } from './context/useCreateRelease';
import FirstReleaseWarning from './components/FirstReleaseWarning';
import ReleaseConfigSelector from './components/ReleaseConfigSelector';
import ThresholdConfig from './components/ThresholdConfig';
import { CREATE_RELEASE_STEP } from './consts';

interface CreateReleaseProps {
  open: boolean;
  handleClose: () => void;
}

interface CreateReleaseContainerProps {
  productId: string;
  organizationId: string;
  currentProduct: Product;
  open: boolean;
  handleClose: () => void;
}

function CreateRelease({ open, handleClose }: CreateReleaseProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [configPage, setConfigPage] = useState(0);
  const [configPageTitle, setConfigPageTitle] = useState<string>('');
  const configPageTitles = [
    'Definir peso das características',
    'Definir peso das subcaracterísticas',
    'Definir peso das medidas'
  ];
  const { enqueueSnackbar } = useSnackbar()

  const {
    alertMessage,
    closeAlert,
    goToNextStep,
    finishReleasePlanning,
    configPageData,
    releaseInfoForm,
    organizationId,
    productId,
    getNextStep,
    getPreviousStep,
    isFirstRelease,
    resetStates
  } = useCreateReleaseContext();

  const renderStep = () =>
  ({
    0: <ReleaseInfo setActiveStep={setActiveStep} />,
    1: isFirstRelease ? <FirstReleaseWarning /> : <ReleaseConfigSelector setActiveStep={setActiveStep} />,
    2: (
      <ConfigPage
        setActiveStep={setActiveStep}
        page={configPage}
        title={configPageTitle}
      />
    ),
    3: (
      <ThresholdConfig
        data={configPageData.characteristicData}
        tabs={configPageData.subcharacterCheckbox}
        checkboxValues={configPageData.measureCheckbox}
        setCheckboxValues={configPageData.setMeasureCheckbox}
      />
    ),
    4: <ReleaseGoals setActiveStep={setActiveStep} />
  }[activeStep]);

  const handleCloseModal = () => {
    handleClose();
    closeAlert();
    resetStates();
    setActiveStep(0);
  };

  const handleGoToNextStep = () => {
    if (!goToNextStep(activeStep)) return;

    const newActiveStep = getNextStep(activeStep, configPage);
    if (activeStep === newActiveStep && newActiveStep === CREATE_RELEASE_STEP.CharacteristicStep) {
      setConfigPage(configPage + 1);
    }
    setActiveStep(newActiveStep);
  };

  const handleBackButton = () => {
    if (activeStep === CREATE_RELEASE_STEP.ReleaseInfoStep) {
      handleCloseModal();
      return;
    }

    const newActiveStep = getPreviousStep(activeStep, configPage);
    if (activeStep === newActiveStep && newActiveStep === CREATE_RELEASE_STEP.CharacteristicStep) {
      setConfigPage(configPage - 1);
    }
    setActiveStep(newActiveStep);
  };

  useEffect(() => {
    setConfigPageTitle(configPageTitles[configPage]);
  }, [configPage]);

  useEffect(() => {
    if (open) resetStates();
  }, [open])

  async function checkReleaseInfo() {
    try {
      const { data, status } = await api.get(`/organizations/${organizationId}/products/${productId}/release/is-valid/?nome=${releaseInfoForm.name}&dt-inicial=${releaseInfoForm.startDate}&dt-final=${releaseInfoForm.endDate}`)
      handleGoToNextStep()
    } catch (error: any) {
      console.log("error.response", error.response)
      console.log("error", error)
      enqueueSnackbar(`Erro ao criar release, ${error?.response?.data?.detail}`, { variant: 'error' })
    }
  }
  const handleNextButton = async () => {
    if (activeStep === CREATE_RELEASE_STEP.ReleaseInfoStep) {
      checkReleaseInfo();
    } else if (activeStep === CREATE_RELEASE_STEP.ReleaseGoalStep) {
      finishReleasePlanning();
    } else {
      handleGoToNextStep();
    }
  }

  const BUTTONS: Array<ButtonType> = [

    {
      label: 'Cancelar',
      onClick: handleCloseModal,
      backgroundColor: '#FFF',
      color: '#113D4C',
      variant: 'outlined',
      dataTestId: 'cancel-button'
    },
    {
      label: 'Voltar',
      onClick: handleBackButton,
      backgroundColor: '#FFF',
      color: '#113D4C',
      variant: 'outlined',
      dataTestId: 'back-button'
    },
    {
      label: activeStep === CREATE_RELEASE_STEP.ReleaseGoalStep ? 'Finalizar' : 'Continuar',
      onClick: async () => await handleNextButton(),
      backgroundColor: '#113D4C',
      color: '#fff',
      variant: 'contained',
      disabled: activeStep === CREATE_RELEASE_STEP.ReleaseSelectorStep && !isFirstRelease,
      dataTestId: 'next-button'
    }
  ];

  const ALERTS = {
    successOnCreation: <Alert severity="success">Release criada com sucesso!</Alert>,
    errorOnCreation: <Alert severity="error">Ocorreu um erro durante a criação da release.</Alert>,
    noCharacteristicSelected: <Alert severity='warning'>Ao menos uma característica deve ser selecionada</Alert>,
    fillName: <Alert severity='warning'>Preencha o nome da release</Alert>,
    characteristicValuesInvalid: <Alert severity='warning'>A soma de todos os valores preenchidos deve ser igual a 100</Alert>,
    invalidDate: <Alert severity='warning'>A data de início deve ser anterior a data de fim</Alert>,
    sameReleaseGoal: <Alert severity='warning'>As informações da release devem ser diferentes da última release</Alert>,
  };
  const handleOnCloseAlert = () => {
    if (alertMessage === 'successOnCreation') {
      handleClose();
      setActiveStep(0);
    }

    setTimeout(closeAlert, 5000);
  };

  useEffect(() => {
    if (alertMessage) handleOnCloseAlert();
  }, [alertMessage]);

  return (
    <>
      <DrawerMenu handleCloseModal={handleCloseModal} open={open} buttons={BUTTONS}>
        <Container>{renderStep()}</Container>
      </DrawerMenu>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={!!alertMessage}
        onClose={handleOnCloseAlert}
      >
        {ALERTS[alertMessage as keyof typeof ALERTS]}
      </Snackbar>
    </>
  );
}

function CreateReleaseContainer({
  productId,
  organizationId,
  open,
  handleClose,

  currentProduct
}: CreateReleaseContainerProps) {
  return (
    <CreateReleaseProvider productId={productId} organizationId={organizationId} currentProduct={currentProduct}>
      <CreateRelease open={open} handleClose={handleClose} />
    </CreateReleaseProvider>
  );
}

export default CreateReleaseContainer;
