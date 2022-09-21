import '@testing-library/jest-dom';

import React from 'react';
import { render } from '@testing-library/react';

import CreateRelease from '../CreateRelease';

jest.mock('@pages/createRelease/context/useCreateRelease', () => ({
  ...jest.requireActual('@pages/createRelease/context/useCreateRelease'),
  useCreateReleaseContext: () => ({
    successOnCreation: 'success',
    closeAlert: () => {},
    goToGoalsStep: () => {},
    createProductReleaseGoal: () => {}
  })
}));

describe('<CreateRelease />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Snapshot', () => {
    it('Deve corresponder ao Snapshot', () => {
      const tree = render(
        <CreateRelease
          open
          handleClose={() => {}}
          productId={1}
          organizationId={1}
        />
      )

      expect(tree).toMatchSnapshot();
    });
  });
});