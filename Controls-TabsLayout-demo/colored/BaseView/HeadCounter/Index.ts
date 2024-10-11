import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-TabsLayout-demo/colored/BaseView/HeadCounter/Index');
import { query } from 'Application/Env';
import { View, HeadCounter } from 'Controls-TabsLayout/colored';
import 'css!Controls-TabsLayout-demo/colored/BaseView/Default/Style';

export default class HeadTemplateDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _headCounter: object = HeadCounter;

    protected _children: {
        coloredTabs: View;
    };

    protected _selectedKey: number = null;

    protected _afterMount(): void {
        if (query.get.animation === 'false') {
            View._offAnimation();
            this._children.coloredTabs.useRoundings = false;
        }
    }
}
