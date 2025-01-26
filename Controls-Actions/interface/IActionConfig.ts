export interface IActionRightsWithRestriction {
    zone?: string;
    restriction?: string;
    requiredLevel?: 'read' | 'modify';
}

export type TActionRights = string[] | IActionRightsWithRestriction[];

export interface IActionConfig {
    type: string;
    props?: object;
    commandName?: string;
    commandOptions?: Record<string, unknown>;
    propTypes?: object[];
    info?: {
        category?: string;
        title: string;
        order?: number;
        icon?: string;
    };
    rights?: TActionRights;
}
