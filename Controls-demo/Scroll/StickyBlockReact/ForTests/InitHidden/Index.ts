import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/InitHidden/Index');

export default class InitHidden extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _isStickyBlock1Enabled: boolean = false;
    protected _isStickyBlock1Visible: boolean = false;

    protected _changeEnabled(): void {
        this._isStickyBlock1Enabled = !this._isStickyBlock1Enabled;
    }

    protected _changeVisible(): void {
        this._isStickyBlock1Visible = !this._isStickyBlock1Visible;
    }
}
