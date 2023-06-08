/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_horizontalScroll/Shadows/Shadows';

interface IShadowsOptions extends IControlOptions {
    backgroundStyle?: string;
    needBottomPadding?: boolean;
}

export default class Shadows extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _getClasses(
        options: IShadowsOptions,
        position: 'start' | 'end'
    ): string {
        return (
            'controls-ColumnScroll__shadow' +
            ` controls-ColumnScroll__shadow-${
                options.backgroundStyle || 'default'
            }` +
            ` controls-ColumnScroll__shadow_with${
                !!options.needBottomPadding ? '' : 'out'
            }-bottom-padding` +
            ` controls-ColumnScroll__shadow_position-${position}` +
            ` js-controls-ColumnScroll__shadow_position-${position}`
        );
    }
}
