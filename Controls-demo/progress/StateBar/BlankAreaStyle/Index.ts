import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/progress/StateBar/BlankAreaStyle/Template');

class StateBar extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _dataDefault: object[];
    protected _dataReadonly: object[];
    protected _dataPrimary: object[];
    protected _dataSecondary: object[];
    protected _dataSuccess: object[];
    protected _dataWarning: object[];
    protected _dataDanger: object[];
    protected _dataInfo: object[];

    protected _beforeMount(): void {
        this._dataDefault = [
            {
                value: 20,
            },
        ];
        this._dataReadonly = [
            {
                value: 20,
            },
        ];
        this._dataPrimary = [
            {
                value: 20,
                style: 'primary',
            },
        ];
        this._dataSecondary = [
            {
                value: 20,
                style: 'secondary',
            },
        ];
        this._dataSuccess = [
            {
                value: 20,
                style: 'success',
            },
        ];
        this._dataWarning = [
            {
                value: 20,
                style: 'warning',
            },
        ];
        this._dataDanger = [
            {
                value: 20,
                style: 'danger',
            },
        ];
        this._dataInfo = [
            {
                value: 20,
                style: 'info',
            },
        ];
    }
}

export default StateBar;
