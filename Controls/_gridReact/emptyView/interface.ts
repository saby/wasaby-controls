import {
    IBackgroundProps,
    IBorderProps,
    ICursorProps,
    IFontProps,
    IRoundAnglesProps,
    IShadowProps,
    TSize
} from 'interface';

/**
 * Опции для настройки строки пустого представления
 * @public
 */
export interface IEmptyViewProps
    extends IShadowProps,
        IBorderProps,
        ICursorProps,
        IRoundAnglesProps,
        IFontProps,
        Exclude<IBackgroundProps, {hoverBackgroundStyle: unknown}> {
    padding?: {top: TSize, bottom: TSize};
}
