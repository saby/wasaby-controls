import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/HintManager/HintStyle/HintStyle';
import { Controller } from 'Controls/hintManager';
import { getStylishRoute } from 'Controls-demo/HintManager/mockedData/routesMockedData';
import { TStyle } from 'Controls/popupTemplate';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _stepStyles: TStyle[] = [
        'danger',
        'warning',
        'secondary',
        'success',
        'info',
        'primary',
        'unaccented',
        'invalid',
    ];

    protected _beforeMount(): void {
        this._stepStyles.forEach((style) => {
            const route = getStylishRoute(style);
            new Controller(route).activate();
        });
    }
}
