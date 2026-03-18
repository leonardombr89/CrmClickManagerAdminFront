import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Admin'
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    bgcolor: 'primary',
    route: '/dashboard',
  },
  {
    displayName: 'Chamados',
    iconName: 'lifebuoy',
    bgcolor: 'primary',
    route: '/chamados',
  },
  {
    displayName: 'Atividades',
    iconName: 'timeline',
    bgcolor: 'primary',
    route: '/atividades',
  },
  {
    displayName: 'Empresas',
    iconName: 'building',
    bgcolor: 'primary',
    route: '/empresas',
  },
  {
    displayName: 'Leads',
    iconName: 'mail',
    bgcolor: 'primary',
    route: '/leads',
  },
  {
    displayName: 'Planos',
    iconName: 'credit-card',
    bgcolor: 'primary',
    route: '/planos',
  },
  {
    displayName: 'Cupons',
    iconName: 'ticket',
    bgcolor: 'primary',
    route: '/cupons',
  },
  {
    displayName: 'Pagamentos',
    iconName: 'receipt-2',
    bgcolor: 'primary',
    route: '/pagamentos',
  }
];
