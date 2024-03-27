import React, { useEffect } from 'react';
import { FiBarChart2, FiGitBranch, FiPaperclip } from 'react-icons/fi';
import { useAuth } from '@contexts/Auth';
import { useProductContext } from '@contexts/ProductProvider';
import { useRouter } from 'next/router';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import SideMenuItem from './SideMenuItem/SideMenuItem';
import SideMenuWrapper from './SideMenuWrapper';
import UserMenu from './UserMenu';

export type SideMenuItemType = {
  startIcon: React.ReactElement;
  text: string;
  tooltip: string;
  path: string;
  disable: boolean;
  selected: boolean;
};

function SideMenu() {
  const { session } = useAuth();
  const { currentOrganization } = useOrganizationContext();
  const { currentProduct } = useProductContext();
  const router = useRouter();

  useEffect(() => {
  }, [currentOrganization, currentProduct]);

  let itemType: 'product' | 'organization' | 'unknown' = 'unknown';

  if (currentProduct && currentOrganization) {
    itemType = 'product';
  } else if (!currentProduct && currentOrganization) {
    itemType = 'organization';
  }

  // if (itemType === 'unknown') {
  //   console.warn('The itemType is set to unknown. Please handle this case appropriately.');
  // }

  const MenuItems: SideMenuItemType[] = [
    {
      startIcon: <FiBarChart2 fontSize={28} />,
      text: 'Visão Geral',
      tooltip: 'Visão Geral do Produto',
      path: `/products/${currentOrganization?.id}-${currentProduct?.id}-${currentProduct?.name}`,
      disable: !currentOrganization,
      selected: router.pathname === '/products/[product]'
    },
    {
      startIcon: <FiGitBranch fontSize={28} />,
      text: 'Repositórios',
      tooltip: 'Repositórios do Produto',
      path: `/products/${currentOrganization?.id}-${currentProduct?.id}-${currentProduct?.name}/repositories`,
      disable: !currentProduct,
      selected: router.query?.repository !== undefined || router.pathname === '/products/[product]/repositories'
    },
    {
      startIcon: <FiPaperclip fontSize={28} />,
      text: 'Releases',
      tooltip: 'Releases de cada repositório',
      path: `/products/${currentOrganization?.id}-${currentProduct?.id}-${currentProduct?.name}/releases`,
      disable: !currentProduct,
      selected: router.query?.release !== undefined
    }
  ];

  return (
    <SideMenuWrapper
      key={`${currentOrganization?.id}-${currentProduct?.id}`}
      itemType={itemType}
      menuItems={
        currentProduct &&
        MenuItems.map((item) => (
          <SideMenuItem
            key={item.text}
            {...item}
            onClick={() => {
              void router.push(item.path);
            }}
          />
        ))
      }
      footer={<UserMenu username={session?.username} />}
    />
  );
}

export default SideMenu;
