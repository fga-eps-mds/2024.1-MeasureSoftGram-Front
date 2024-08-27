import { Box, Divider, Typography } from '@mui/material';
import React, { memo, ReactElement } from 'react';
import Image from 'next/image';
import myImage from '../../../../public/images/svg/logo.svg';

export const AuthHeader = memo(
  ({ loginButton, subTitle }: { loginButton: ReactElement, subTitle: string }) => (
    <Box display="flex" flexDirection="column" gap="1rem">
      <Box>
        <Image src={myImage} alt="Logo Measure" />
      </Box>

      <Box display="flex" marginBottom="1rem" justifyContent="center">
        {loginButton}
      </Box>

      <Box marginBottom="2rem">
        <Divider variant="fullWidth" sx={{ ':after': { borderColor: '#113D4C' }, ':before': { borderColor: '#113D4C' } }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: '300' }}>{subTitle}</Typography>
        </Divider>
      </Box>

    </Box>
  )
);
AuthHeader.displayName = 'AuthHeader';
