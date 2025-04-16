export interface IActionRightsWithRestriction {
    zone?: string;
    restriction?: string;
    requiredLevel?: 'read' | 'modify';
}

export type TActionRights = string[] | IActionRightsWithRestriction[];

interface IPropTypes {
    type: string;
    name: string;
    caption?: string;
    validators?: string[];
    defaultValue?: unknown;
    editorOptions?: object;

    [name: string]: unknown;
}

export interface IActionConfig {
    type: string;
    props?: object;
    commandName?: string;
    commandOptions?: Record<string, unknown>;
    propTypes?: IPropTypes[];
    info?: {
        category?: string;
        title: string;
        order?: number;
        icon?: string;
    };
    rights?: TActionRights;
}
