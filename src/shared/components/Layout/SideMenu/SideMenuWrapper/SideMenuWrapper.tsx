import React from 'react';
import Link from 'next/link';

import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Divider from '@mui/material/Divider';

import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import * as Styles from './styles';

import OrganizationSelector from '../OrganizationSelector';
import ProductsSelector from '../ProductsSelector';

const IMAGE_SOURCE = '/images/svg/logo_white.svg';

interface Props {
  menuItems?: React.ReactNode;
  footer?: React.ReactNode;
}

function SideMenuWrapper({ menuItems, footer }: Props) {
  const { isCollapsed, toggleCollapse } = useSideMenuContext();

  return (
    <Styles.Wrapper>
      <Link href="/home">
        <Styles.Logo src={IMAGE_SOURCE} height={50} />
      </Link>
      <OrganizationSelector />
      <ProductsSelector />
      <Styles.CollapseButton onClick={toggleCollapse}>
        {isCollapsed ? <NavigateNextRoundedIcon fontSize="large" color="#f5f5f5" /> : <NavigateBeforeRoundedIcon fontSize="large" color="#f5f5f5" />}
      </Styles.CollapseButton>
      <Divider sx={{ width: '100%', my: '10px', border: '1px solid rgba(0, 0, 0, 0.30)' }} />
      <Styles.ItemContainer>{menuItems}</Styles.ItemContainer>
      <Divider sx={{ width: '100%', my: '2px', border: '1px solid rgba(0, 0, 0, 0.30)' }} />
      {footer}
    </Styles.Wrapper>
  );
}

export default SideMenuWrapper;
