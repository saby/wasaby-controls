import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-TabsLayout-demo/colored/BaseView/HeadTemplate/Index');
import { query } from 'Application/Env';
import { View } from 'Controls-TabsLayout/colored';

export default class HeadTemplateDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey: number = null;

    protected _children: {
        coloredTabs: View;
    };

    protected _afterMount(): void {
        if (query.get.animation === 'false') {
            View._offAnimation();
            this._children.coloredTabs.useRoundings = false;
        }
    }

    static _styles: string[] = ['Controls-TabsLayout-demo/colored/BaseView/Default/Style'];
}
