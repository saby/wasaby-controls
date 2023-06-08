/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_stickyEnvironment/DataPinProviderWasabyCompatible';
import { IEdgesData } from './interfaces';
import type { DataPinProvider } from './DataPinProvider';

export default class DataPinProviderWasabyCompatible extends Control {
    protected _template: TemplateFunction = template;
    protected _children: {
        dataPinProvider: DataPinProvider;
    };

    _beforeMount(): void {
        this._onEdgesDataChangedCallback =
            this._onEdgesDataChangedCallback.bind(this);
    }

    protected _onEdgesDataChangedCallback(intersectInfo: IEdgesData): void {
        this._notify('edgesDataChanged', [intersectInfo]);
    }

    clearStack(): void {
        this._children?.dataPinProvider.clearStack();
    }
}
