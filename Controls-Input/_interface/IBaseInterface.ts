export type TBinding = string[];
export type TVisibilityCondition = Function;
export type TValidator = Function;
export type TIcon = string;

export type TOuterIconLabel = {
    icon: TIcon;
};

export type TOuterTextLabel = {
    label: string;
    labelPosition: 'top' | 'start';
};

export type TInnerLabel = {
    label: string;
    jumping: boolean;
};
