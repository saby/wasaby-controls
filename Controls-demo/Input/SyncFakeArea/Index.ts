import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/SyncFakeArea/SyncFakeArea');

class SyncFakeArea extends Control<IControlOptions> {
    protected _areaValue: '';

    protected _template: TemplateFunction = controlTemplate;

    protected _change(): void {
        this._areaValue = 'Маленький текст';
    }
}

export default SyncFakeArea;
