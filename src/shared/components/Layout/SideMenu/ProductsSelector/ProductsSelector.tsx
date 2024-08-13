import React from 'react';
import { FiBox, FiRepeat } from 'react-icons/fi';
import LetterAvatar from '@components/LetterAvatar';
import { useProductContext } from '@contexts/ProductProvider';
import useBoolean from '@hooks/useBoolean';
import { useRouter } from 'next/router';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import { useTranslation } from 'react-i18next';
import SideList from '../SideList';
import SideMenuItem from '../SideMenuItem';

function ProductSelector() {
  const { currentOrganization } = useOrganizationContext();
  const { currentProduct, setCurrentProduct, productsList } = useProductContext();
  const { toggleCollapse } = useSideMenuContext();
  const { value: isOpen, setTrue: onClick, setFalse: onClose } = useBoolean(false);
  const router = useRouter();

  const onClickItem = (value: any) => {
    setCurrentProduct(value);
    onClose();
    toggleCollapse();
    void router.push(`/products/${currentOrganization?.id}-${value.id}-${value.name}`);
  };

  const { t } = useTranslation('sidebar');

  return (
    <>
      <SideMenuItem
        startIcon={<LetterAvatar name={currentProduct?.name ?? '?'} icon={<FiBox />} />}
        text={currentProduct?.name ?? t("product.placeholder")}
        endIcon={<FiRepeat />}
        tooltip={t("tooltip.product-selection")}
        onClick={onClick}
        selected={false}
      />
      <SideList
        itemType='product'
        organizationId={currentOrganization?.id}
        seeMorePath="/products"
        values={productsList ?? []}
        open={isOpen}
        onClose={onClose}
        onClickItem={onClickItem}
      />
    </>
  );
}

export default ProductSelector;
