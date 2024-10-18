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
    jumping: boolean;
};

export type TCaptionLabel = {
    labelPosition: 'captionStart' | 'captionEnd';
    label: string;
};
