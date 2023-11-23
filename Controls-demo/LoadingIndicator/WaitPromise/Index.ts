import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/WaitPromise/Template');
import LoadingIndicator from 'Controls/LoadingIndicator';
import 'css!Controls-demo/LoadingIndicator/IndicatorContainer';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _showAdditionalText: boolean = false;
    protected _children: {
        LocalIndicatorDefault: LoadingIndicator;
    };

    protected _clickHandler(): void {
        const waitPromise = new Promise((resolve) => {
            setTimeout(() => {
                this._showAdditionalText = true;
                resolve('');
            }, 2000);
        });
        this._children.LocalIndicatorDefault.show(
            {
                isGlobal: false,
                overlay: 'dark',
                delay: 0,
            },
            waitPromise
        );
    }
}
