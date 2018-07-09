import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';

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
    tabConfig?: {
        icon: IconName;
        iconPrefix: IconPrefix;
        name: string;
        link: string;
        external: boolean;
    };
    moduleConfig?: {
        name: string;
        moduleName: string;
    };
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

export interface ChatMessageType {
    username: string;
    userid: string;
    id: string;
    timestamp: Date;
    message: string;

}
