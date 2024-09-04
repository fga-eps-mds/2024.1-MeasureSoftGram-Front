import React, { useEffect } from 'react';
import { BsFillBuildingFill } from 'react-icons/bs';
import LetterAvatar from '@components/LetterAvatar';
import { useOrganizationContext } from '@contexts/OrganizationProvider';
import { useSideMenuContext } from '@contexts/SidebarProvider/SideMenuProvider';
import { Organization } from '@customTypes/organization';
import { useTranslation } from 'react-i18next';
import SideMenuItem from '../SideMenuItem';
import MSGSelectBox from 'src/components/idv/inputs/MSGSelectBox';

function OrganizationSelector() {
  const { organizationList, setCurrentOrganizations, currentOrganization, fetchOrganizations } = useOrganizationContext();
  const { isCollapsed, toggleCollapse } = useSideMenuContext();

  const onChange = (value: Organization) => {
    setCurrentOrganizations([value]);
  };

  useEffect(() => {
    if (!organizationList.length) {
      fetchOrganizations(true);
    }
  }, [fetchOrganizations, organizationList]);

  const { t } = useTranslation('sidebar');

  return (
    <>
      {!isCollapsed ?
        <MSGSelectBox
          label={t('organization.placeholder')}
          width="98%"
          options={organizationList ?? []}
          onChange={(e) => onChange(e.target.value)}
          value={currentOrganization}
        /> :
        <SideMenuItem
          startIcon={<LetterAvatar name={currentOrganization?.name ?? '?'} icon={<BsFillBuildingFill color="#000000" />} />}
          text={currentOrganization?.name ?? 'Selecione a Organização'}
          tooltip={t("tooltip.organization-selection")}
          onClick={() => toggleCollapse()}
          selected={false}
        />
      }
    </>
  );
}

export default OrganizationSelector;
