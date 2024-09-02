import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Organization } from '@customTypes/organization';
import { organizationQuery } from '@services/organization';
import { toast } from 'react-toastify';
import { useAuth } from '@contexts/Auth';

interface Props {
  children: ReactNode;
}

interface IOrganizationContext {
  currentOrganization: Organization | null;
  currentOrganizations: Organization[];
  setCurrentOrganizations: (organizations: Organization[]) => void;
  organizationList: Organization[];
  isLoading: boolean;
  fetchOrganizations: () => void;
}

const OrganizationContext = createContext<IOrganizationContext | undefined>(undefined);

export function OrganizationProvider({ children }: Props) {
  const { session } = useAuth();
  const [currentOrganizations, setCurrentOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizationList, setOrganizationList] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = async () => {
    console.log('teste1');
    console.log('session is: ', session);
    if (!session) return;
    setIsLoading(true);
    try {
      console.log('teste2');
      const result = await organizationQuery.getAllOrganization();
      console.log('teste3');
      if (result.type === 'success') {
        console.log('teste4');
        const organizations = result.value.map(org => ({
          id: org.id ?? '',
          name: org.name,
          description: org.description ?? '',
          url: org.url ?? '',
          products: org.products ?? [],
          key: org.key ?? ''
        }));
        console.log('teste5');
        setOrganizationList(organizations);
        console.log('teste6');
      } else {
        toast.error("Erro ao carregar organizações.");
      }
    } catch (error) {
      console.log('teste7');
      console.error("Failed to fetch organizations:", error);
      toast.error("Erro ao carregar organizações. Por favor, tente novamente.");
    } finally {
      console.log('teste8');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('teste9');
    fetchOrganizations();
  }, []);

  useEffect(() => {
    console.log('teste10');
    if (organizationList.length > 0 && currentOrganizations.length === 0) {
      console.log('teste11');
      setCurrentOrganizations([organizationList[0]]);
    }
    console.log('teste12');
  }, [organizationList, currentOrganizations]);

  useEffect(() => {
    console.log('teste13');
    if (currentOrganizations.length > 0) {
      console.log('teste14');
      setCurrentOrganization(currentOrganizations[0]);
      console.log('teste15');
    } else {
      console.log('teste16');
      setCurrentOrganization(null);
      console.log('teste17');
    }
  }, [currentOrganizations]);

  const value = useMemo(() => {
    return {
      currentOrganization,
      currentOrganizations,
      setCurrentOrganizations,
      organizationList,
      isLoading,
      fetchOrganizations
    };
  }, [currentOrganization, currentOrganizations, organizationList, isLoading]);

  console.log('teste18');
  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);

  if (context === undefined) {
    throw new Error('OrganizationContext must be used within a OrganizationProvider');
  }

  return context;
}
