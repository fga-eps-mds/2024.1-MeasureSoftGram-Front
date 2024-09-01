import { render, screen, fireEvent } from '@testing-library/react';
import { balanceMatrixService } from '@services/balanceMatrix';
import { useTranslation } from 'react-i18next';
import { productQuery } from '@services/product';
import { useRouter } from 'next/router';
import ReleaseInfo from '../ReleaseCreation';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@services/api');
jest.mock('@services/product');
jest.mock('@services/balanceMatrix');

describe('ReleaseInfo Component', () => {
  beforeAll(() => {
    (useRouter as jest.Mock).mockReturnValue({
      isReady: true,
      query: { product: 'org-123-prod-456' },
    });

    (productQuery.getPreConfigEntitiesRelationship as jest.Mock).mockResolvedValue({
      data: [
        {
          "id": 1,
          "key": "reliability",
          "name": "Reliability",
          "description": null,
          "subcharacteristics": [
            {
              "id": 4,
              "key": "maturity",
              "name": "Maturity",
              "description": null,
              "measures": [
                {
                  "id": 8,
                  "key": "ci_feedback_time",
                  "name": "Ci Feedback Time",
                  "description": null
                }
              ]
            }
          ]
        },
        {
          "id": 2,
          "key": "maintainability",
          "name": "Maintainability",
          "description": null,
          "subcharacteristics": [
            {
              "id": 1,
              "key": "modifiability",
              "name": "Modifiability",
              "description": null,
              "measures": [
                {
                  "id": 4,
                  "key": "non_complex_file_density",
                  "name": "Non Complex File Density",
                  "description": null
                },
                {
                  "id": 5,
                  "key": "commented_file_density",
                  "name": "Commented File Density",
                  "description": null
                }
              ]
            }
          ]
        },
        {
          "id": 3,
          "key": "functional_suitability",
          "name": "Functional Suitability",
          "description": null,
          "subcharacteristics": [
            {
              "id": 3,
              "key": "functional_completeness",
              "name": "Functional Completeness",
              "description": null,
              "measures": [
                {
                  "id": 7,
                  "key": "team_throughput",
                  "name": "Team Throughput",
                  "description": null
                }
              ]
            }
          ]
        }
      ],
    });

    (productQuery.getCurrentReleaseGoal as jest.Mock).mockResolvedValue({
      data: {
        "id": 11,
        "data": {
          "reliability": 100,
          "maintainability": 100,
          "functional_suitability": 100
        },
        "allow_dynamic": false
      },
    });

    (productQuery.getProductDefaultPreConfig as jest.Mock).mockResolvedValue({
      data: {
        "characteristics": [
          {
            "key": "reliability",
            "weight": 34,
            "subcharacteristics": [
              {
                "key": "testing_status",
                "weight": 50,
                "measures": [
                  {
                    "key": "passed_tests",
                    "weight": 33,
                    "min_threshold": 0,
                    "max_threshold": 1
                  },
                  {
                    "key": "test_builds",
                    "weight": 33,
                    "min_threshold": 0,
                    "max_threshold": 300000
                  },
                  {
                    "key": "test_coverage",
                    "weight": 34,
                    "min_threshold": 60,
                    "max_threshold": 100
                  }
                ]
              },
              {
                "key": "maturity",
                "weight": 50,
                "measures": [
                  {
                    "key": "ci_feedback_time",
                    "weight": 100,
                    "min_threshold": 1,
                    "max_threshold": 900
                  }
                ]
              }
            ]
          },
          {
            "key": "maintainability",
            "weight": 33,
            "subcharacteristics": [
              {
                "key": "modifiability",
                "weight": 100,
                "measures": [
                  {
                    "key": "non_complex_file_density",
                    "weight": 33,
                    "min_threshold": 0,
                    "max_threshold": 10
                  },
                  {
                    "key": "commented_file_density",
                    "weight": 33,
                    "min_threshold": 10,
                    "max_threshold": 30
                  },
                  {
                    "key": "duplication_absense",
                    "weight": 34,
                    "min_threshold": 0,
                    "max_threshold": 5
                  }
                ]
              }
            ]
          },
          {
            "key": "functional_suitability",
            "weight": 33,
            "subcharacteristics": [
              {
                "key": "functional_completeness",
                "weight": 100,
                "measures": [
                  {
                    "key": "team_throughput",
                    "weight": 100,
                    "min_threshold": 45,
                    "max_threshold": 100
                  }
                ]
              }
            ]
          }
        ]
      },
    });

    (productQuery.getProductCurrentPreConfig as jest.Mock).mockResolvedValue({
      data: {
        "id": 14,
        "name": "Acacia",
        "data": {
          "characteristics": [
            {
              "key": "reliability",
              "weight": 46,
              "subcharacteristics": [
                {
                  "key": "maturity",
                  "weight": 100,
                  "measures": [
                    {
                      "key": "ci_feedback_time",
                      "weight": 100,
                      "metrics": [
                        {
                          "key": "sum_ci_feedback_times"
                        },
                        {
                          "key": "total_builds"
                        }
                      ],
                      "max_threshold": 900,
                      "min_threshold": 1
                    }
                  ]
                }
              ]
            },
            {
              "key": "maintainability",
              "weight": 33,
              "subcharacteristics": [
                {
                  "key": "modifiability",
                  "weight": 100,
                  "measures": [
                    {
                      "key": "non_complex_file_density",
                      "weight": 33,
                      "metrics": [
                        {
                          "key": "functions"
                        },
                        {
                          "key": "complexity"
                        }
                      ],
                      "max_threshold": 10,
                      "min_threshold": 0
                    },
                    {
                      "key": "commented_file_density",
                      "weight": 67,
                      "metrics": [
                        {
                          "key": "comment_lines_density"
                        }
                      ],
                      "max_threshold": 30,
                      "min_threshold": 10
                    }
                  ]
                }
              ]
            },
            {
              "key": "functional_suitability",
              "weight": 21,
              "subcharacteristics": [
                {
                  "key": "functional_completeness",
                  "weight": 100,
                  "measures": [
                    {
                      "key": "team_throughput",
                      "weight": 100,
                      "metrics": [
                        {
                          "key": "total_issues"
                        },
                        {
                          "key": "resolved_issues"
                        }
                      ],
                      "max_threshold": 100,
                      "min_threshold": 45
                    }
                  ]
                }
              ]
            }
          ]
        },
        "created_at": "2024-09-01T00:08:41.371226-03:00",
        "created_config": true
      },
    });

    (balanceMatrixService.getBalanceMatrix as jest.Mock).mockResolvedValue({
      data: {
        "count": 3,
        "next": null,
        "previous": null,
        "result": {
          "functional_suitability": {
            "+": [
              "reliability",
              "maintainability"
            ],
            "-": []
          },
          "reliability": {
            "+": [
              "functional_suitability",
              "maintainability"
            ],
            "-": []
          },
          "maintainability": {
            "+": [
              "functional_suitability",
              "reliability"
            ],
            "-": []
          }
        }
      },
    });

    (productQuery.getPreConfigEntitiesRelationship as jest.Mock).mockResolvedValue({
      data: { "message": "Parametros válidos para criação de Release" },
    });
  });

  it('should render the component correctly', () => {
    render(<ReleaseInfo />);
    const { t } = useTranslation('plan_release');
    expect(screen.getByText(t('planRelease'))).toBeInTheDocument();
  });

  it('should navigate through steps correctly', async () => {
    render(<ReleaseInfo />);

    const { t } = useTranslation('plan_release');

    const releaseIntput = screen.getByTestId('apelido-release') as HTMLInputElement;

    fireEvent.change(releaseIntput, { target: { value: 'release 1' } });

    const nextButton = await screen.findByRole("button", { name: t('next') });
    fireEvent.click(nextButton);

    expect(screen.getByText(t('basicConfig'))).toBeInTheDocument();
  });

});
