import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-TabsLayout-demo/colored/BaseView/BackgroundFill/Index');
import { query } from 'Application/Env';
import { View } from 'Controls-TabsLayout/colored';

export default class BackgroundFillDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKey: number = null;
    protected _selectedKey2: number = null;

    protected _children: {
        coloredTabs1: View;
        coloredTabs2: View;
    };

    protected _afterMount(): void {
        if (query.get.animation === 'false') {
            View._offAnimation();
            this._children.coloredTabs1.useRoundings = false;
            this._children.coloredTabs2.useRoundings = false;
        }
    }

    static _styles: string[] = ['Controls-TabsLayout-demo/colored/BaseView/Default/Style'];
}
