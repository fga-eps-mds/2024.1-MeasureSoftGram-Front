import React, { useEffect } from 'react';
import { BsFillBuildingFill } from 'react-icons/bs';
import { FiRepeat } from 'react-icons/fi';
import LetterAvatar from '@components/LetterAvatar';
import useBoolean from '@hooks/useBoolean';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import { Organization } from '@customTypes/organization';
import { useTranslation } from 'react-i18next';
import SideMenuItem from '../SideMenuItem';
import SideList from '../SideList';

function OrganizationSelector() {
  const { organizationList, setCurrentOrganizations, currentOrganization, fetchOrganizations } = useOrganizationContext();
  const { isCollapsed, toggleCollapse } = useSideMenuContext();
  const { value: isOpen, setTrue: openMenu, setFalse: onClose } = useBoolean(false);

  const onClickItem = (organization: Organization) => {
    setCurrentOrganizations([organization]);
    onClose();
    console.log("Toggling collapse state from:", isCollapsed);
    toggleCollapse();
  };

  useEffect(() => {
    if (isOpen && !organizationList.length) {
      fetchOrganizations();
    }
  }, [isOpen, fetchOrganizations, organizationList]);

  const { t } = useTranslation();

  return (
    <>
      <SideMenuItem
        startIcon={<LetterAvatar name={currentOrganization?.name ?? '?'} icon={<BsFillBuildingFill />} />}
        text={currentOrganization?.name ?? 'Selecione a Organização'}
        endIcon={<FiRepeat />}
        tooltip={t("sidebar.tooltip.organization-selection")}
        onClick={openMenu}
        selected={false}
      />
      <SideList
        itemType='organization'
        seeMorePath="/products"
        values={organizationList ?? []}
        open={isOpen}
        onClose={onClose}
        onClickItem={onClickItem}
      />
    </>
  );
}

export default OrganizationSelector;
