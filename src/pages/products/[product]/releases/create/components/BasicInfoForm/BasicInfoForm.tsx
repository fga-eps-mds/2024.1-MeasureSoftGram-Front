import React, { } from 'react';
import { Accordion, AccordionSummary, Box, Checkbox, FormControlLabel, hexToRgb, TextField, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Timeline, TimelineSeparator, TimelineConnector, TimelineDot, TimelineItem, TimelineContent, timelineItemClasses } from '@mui/lab';
import { PreConfigData } from '@customTypes/preConfig';
import SectionTooltip from '../SectionTooltip/SectionTooltip';

interface BasicInfoFormProps {
  register: any;
  errors: any;
  watch: any;
  trigger: any;
  followLastConfig: boolean;
  setFollowLastConfig: any;
  configPageData: PreConfigData;
}

export default function BasicInfoForm({ configPageData, trigger, register, errors, followLastConfig, setFollowLastConfig, watch }: BasicInfoFormProps) {
  const renderCurrentConfig = () => (
    <Accordion defaultExpanded
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
        <Typography>Visão Geral da Configuração</Typography>
      </AccordionSummary>
      <Timeline
        key={"0"}
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          marginTop: 0
        }}
      >
        {configPageData?.characteristics?.map((characteristic, index) => (
          <Accordion
            sx={{
              boxShadow: 'inherit',
              backgroundColor: "transparent",
            }}
            key={`ac-characteristic-${index}`}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <TimelineItem key={`characteristic-${index}`}>
                <TimelineSeparator>
                  <TimelineDot color="secondary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span" color={"primary"}>
                    Característica: {characteristic.key}
                  </Typography>
                  <Typography>Peso: {characteristic.weight}</Typography>
                </TimelineContent>
              </TimelineItem>
            </AccordionSummary>
            <Timeline
              key={"1"}
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0,
                  marginLeft: 5,
                },
                marginTop: 0
              }}
            >
              {characteristic.subcharacteristics?.map((subcharacteristic, indexSub) => (
                <TimelineItem key={`subcharacteristic-${index}-${indexSub}`}>
                  <TimelineSeparator>
                    <TimelineDot color="secondary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6" component="span" color={hexToRgb("#2484A5")}>
                      Subcaracterística: {subcharacteristic.key}
                    </Typography>
                    <Typography>Peso: {subcharacteristic.weight}</Typography>
                    <Timeline
                      key={"2"}
                      sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                        },
                        marginTop: 0
                      }}
                    >
                      {subcharacteristic.measures?.map((measure, indexMe) => (
                        <TimelineItem key={`measure-${index}-${indexSub}-${indexMe}`}>
                          <TimelineSeparator>
                            <TimelineDot color="secondary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>
                            <Typography variant="h6" component="span" color={hexToRgb("#5D698E")}>
                              Medida: {measure.key}
                            </Typography>
                            <Typography>Peso: {measure.weight}</Typography>
                            <Typography>
                              min = {measure.min_threshold} | max = {measure.max_threshold}
                            </Typography>

                            {/* <Timeline
                              key={"3"}
                              sx={{
                                [`& .${timelineItemClasses.root}:before`]: {
                                  flex: 0,
                                  padding: 0,
                                },
                                marginTop: 0
                              }}
                            >
                              {measure.metrics?.map((metric, indexMet) => (
                                <TimelineItem key={`metric-${index}-${indexSub}-${indexMe}-${indexMet}`}>
                                  <TimelineSeparator>
                                    <TimelineDot color="secondary" />
                                    <TimelineConnector />
                                  </TimelineSeparator>
                                  <TimelineContent>
                                    <Typography variant="h6" component="span" color={"primary"}>
                                      Métrica: {metric.key}
                                    </Typography>
                                    <Typography>Peso: {metric.weight ?? 0}</Typography>
                                  </TimelineContent>
                                </TimelineItem>
                              ))}
                            </Timeline> */}
                          </TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Accordion>
        ))}
      </Timeline>
    </Accordion>
  )

  return <>
    <SectionTooltip text='Configurações Básicas' tooltip='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore'></SectionTooltip>
    <TextField
      label="Nome da Release"
      required
      style={{ marginBottom: '24px' }}
      autoFocus={true}
      error={!!errors?.name}
      helperText={errors?.name?.message}
      {...register('name', {
        required: 'Nome da Release é obrigatório',
      })}
      inputProps={{
        'data-testid': 'apelido-release'
      }}
      fullWidth
    />
    <TextField
      label="Descrição da Release"
      style={{ marginBottom: '24px' }}
      error={!!errors?.description}
      helperText={errors?.description?.message}
      {...register('description', {
        maxLength: 512,
      })}
      inputProps={{
        'data-testid': 'descricao-release'
      }}
      multiline
      minRows={3}
      maxRows={8}
      fullWidth
    />
    <Box display="flex">
      <TextField
        label="Data de Inicio da Release"
        required
        type="date"
        style={{ marginRight: '16px' }}
        error={!!errors?.startDate}
        helperText={errors?.startDate?.message}
        {...register('startDate', {
          required: 'Data de Inicio da Release é obrigatório',
        })}
        inputProps={{
          'data-testid': 'inicio-release',
          max: watch("endDate")
        }}
        sx={{ flex: 1 }}
      />
      <TextField
        label="Data de Fim da Release"
        required
        type="date"
        style={{ marginBottom: '24px' }}
        error={!!errors?.endDate}
        helperText={errors?.endDate?.message}
        {...register('endDate', {
          required: 'Data de Fim da Release é obrigatório',
        })}
        inputProps={{
          'data-testid': 'fim-release',
          min: watch("startDate")
        }}
        sx={{ flex: 1 }}
      />
    </Box>
    <FormControlLabel control={<Checkbox
      onClick={() => setFollowLastConfig(!followLastConfig)}
      checked={followLastConfig ?? false}
    />} label="Seguir Última Configuração" />
    {renderCurrentConfig()}
  </>
}
