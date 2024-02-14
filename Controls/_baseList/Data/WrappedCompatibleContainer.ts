import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data/WrappedCompatibleContainer';
import type CompatibleContainerConnected from 'Controls/_baseList/Data/CompatibleContainerConnected';
import type { RecordSet } from 'Types/collection';
import type { INavigationSourceConfig } from 'Controls/interface';

export default class WrappedContainer extends Control {
    _template: TemplateFunction = template;
    protected _children: {
        containerConnected: CompatibleContainerConnected;
    };

    reload(config: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._children.containerConnected?.reload?.(config);
    }
}
