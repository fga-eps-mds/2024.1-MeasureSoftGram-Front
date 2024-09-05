import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreConfigData } from '@customTypes/preConfig';
import '@testing-library/jest-dom/extend-expect';
import ReferenceValuesForm from '../ReferenceValuesForm';

const mockConfigPageData: PreConfigData = {
  characteristics: [
    {
      key: 'char1',
      active: true,
      subcharacteristics: [
        {
          key: 'subchar1',
          active: true,
          measures: [
            {
              key: 'measure1',
              active: true,
              min_threshold: 10,
              max_threshold: 90,
              weight: 0,
              metrics: []
            },
          ],
          weight: 0
        },
      ],
      weight: 0,
      goal: 0
    },
  ],
};

const mockDefaultPageData: PreConfigData = {
  characteristics: [
    {
      key: 'char1',
      subcharacteristics: [
        {
          key: 'subchar1',
          measures: [
            {
              key: 'measure1',
              min_threshold: 5,
              max_threshold: 95,
              weight: 0,
              metrics: []
            },
          ],
          weight: 0
        },
      ],
      weight: 0,
      goal: 0
    },
  ],
};

const mockSetConfigPageData = jest.fn();

describe('ReferenceValuesForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the form with correct elements', () => {
    render(
      <ReferenceValuesForm
        configPageData={mockConfigPageData}
        defaultPageData={mockDefaultPageData}
        setConfigPageData={mockSetConfigPageData}
      />
    );

    expect(screen.getByText('defineRefValues')).toBeInTheDocument(); // Verifica a renderização do título principal

    // Verifica a renderização dos accordions
    expect(screen.getByText('characteristics.char1')).toBeInTheDocument();
    expect(screen.getByText('subCharacteristics.subchar1')).toBeInTheDocument();
    expect(screen.getByText('measures.measure1')).toBeInTheDocument();
  });

  test('should call handleMeasureChange when input value is changed', () => {
    render(
      <ReferenceValuesForm
        configPageData={mockConfigPageData}
        defaultPageData={mockDefaultPageData}
        setConfigPageData={mockSetConfigPageData}
      />
    );

    const minInput = screen.getByLabelText(/Min/);
    fireEvent.change(minInput, { target: { value: '15' } });

    expect(mockSetConfigPageData).toHaveBeenCalledWith(expect.any(Function));

    const maxInput = screen.getByLabelText(/Max/);
    fireEvent.change(maxInput, { target: { value: '85' } });

    expect(mockSetConfigPageData).toHaveBeenCalledWith(expect.any(Function));
  });

  test('should correctly update measure thresholds when input values change', () => {
    const { rerender } = render(
      <ReferenceValuesForm
        configPageData={mockConfigPageData}
        defaultPageData={mockDefaultPageData}
        setConfigPageData={mockSetConfigPageData}
      />
    );

    const minInput = screen.getByLabelText(/Min/);
    fireEvent.change(minInput, { target: { value: '15' } });

    expect(mockSetConfigPageData).toHaveBeenCalledWith(expect.any(Function));

    // Simulando o estado atualizado
    mockConfigPageData.characteristics[0].subcharacteristics[0].measures[0].min_threshold = 15;
    rerender(
      <ReferenceValuesForm
        configPageData={mockConfigPageData}
        defaultPageData={mockDefaultPageData}
        setConfigPageData={mockSetConfigPageData}
      />
    );

    expect(minInput).toHaveValue(15);
  });
});
