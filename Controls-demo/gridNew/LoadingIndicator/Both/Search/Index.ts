import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/Search/Search';
import { IColumn } from 'Controls/grid';
import PortionedSearchMemory from './PortionedSearchMemory';
import { SyntheticEvent } from 'UI/Vdom';

export default class Explorer extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _viewSource: PortionedSearchMemory;
    protected _filter: object = {};
    protected _columns: IColumn[] = [{ displayProperty: 'title' }];
    protected _position: number = 0;

    protected _littleData: boolean = false;
    protected _moreUpTrueAndWithoutData: boolean = false;

    protected _beforeMount(): void {
        this._viewSource = new PortionedSearchMemory({ keyProperty: 'key' });
    }

    protected _littleDataChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._moreUpTrueAndWithoutData = false;
        this._viewSource.setLittleData(newValue);
    }

    protected _moreUpTrueAndWithoutDataChangedHandler(
        event: SyntheticEvent,
        newValue: boolean
    ): void {
        this._littleData = false;
        this._viewSource.setMoreUpTrueAndWithoutData(newValue);
    }
}
