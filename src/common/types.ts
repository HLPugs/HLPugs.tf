export interface SiteConfiguration {
  branding: SiteBranding;
  navigation: NavItem[];
  classes: TfClass[];
}

export interface SiteBranding {
  siteName: string;
  siteSubTitle: string;
  logoPath: string;
}

export interface NavItem {
  type: 'tab' | 'divider' | 'module';
  icon?: string;
  name?: string;
  link?: string;
  external?: boolean;
}

export interface TfClass {
  name: string;
  numberPerTeam: number;
}

export interface UserScheme {
  loggedIn?: boolean;
  alias?: string;
  steamid?: string;
  avatar?: string;
}