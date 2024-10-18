import type { INewListSchemeProps } from 'Controls/baseList';

type TOptions = Pick<INewListSchemeProps, 'useCollection' | 'hasSlice'> & {
    isFromBaseControl?: boolean;
    hasCollection?: boolean;
};

// TODO: Расписать нормально, жить долго будет
// Новый список, не будем в BaseControl даже заходить.
export function isWithoutBaseControl(options: TOptions): boolean {
    return (!!options.useCollection || options.hasSlice) && !options.isFromBaseControl;
}

//  Совмещенный список, будем в BaseControl делать старую логику и залезать в слайс иногда(для новой).
export function isControlDividedWithSlice(options: TOptions): boolean {
    return (
        (!!options.useCollection || !!options.hasSlice) &&
        (!!options.useCollection || !!options.hasCollection)
    );
}
