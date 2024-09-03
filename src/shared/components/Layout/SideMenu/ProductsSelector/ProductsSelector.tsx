import React, { useEffect } from 'react';
import { FiBox } from 'react-icons/fi';
import LetterAvatar from '@components/LetterAvatar';
import { useProductContext } from '@contexts/ProductProvider';
import { useRouter } from 'next/router';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import { useTranslation } from 'react-i18next';
import SideMenuItem from '../SideMenuItem';
import MSGSelectBox from 'src/components/idv/inputs';
import { Product } from '@customTypes/product';
import { useQuery } from '../../../../../pages/products/hooks/useQuery';

function ProductSelector() {
  const { currentOrganization } = useOrganizationContext();
  const { currentProduct, setCurrentProduct, productsList, updateProductList } = useProductContext();
  const { toggleCollapse, isCollapsed } = useSideMenuContext();
  const router = useRouter();

  useQuery();

  const onChange = (value: Product) => {
    setCurrentProduct(value);
    toggleCollapse();
    void router.push(`/products/${currentOrganization?.id}-${value.id}-${value.name}`);
  };

  const { t } = useTranslation('sidebar');

  return (
    <>
      {!isCollapsed ?
        <MSGSelectBox
          label={t('product.placeholder')}
          width="98%"
          options={productsList}
          onChange={(e) => onChange(e.target.value)}
          value={currentProduct}
        /> :
        <SideMenuItem
          startIcon={<LetterAvatar name={currentProduct?.name ?? '?'} icon={<FiBox color="#000000" />} />}
          text={currentProduct?.name ?? t("product.placeholder")}
          tooltip={t("tooltip.product-selection")}
          onClick={() => toggleCollapse()}
          selected={false}
        />
      }
    </>
  );
}

export default ProductSelector;
