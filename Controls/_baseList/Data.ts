/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data';
import { default as CompatibleContainer } from 'Controls/_baseList/Data/compatible/ListContainerConnectedCompatible';
import { RecordSet } from 'Types/collection';
import { INavigationSourceConfig } from 'Controls/interface';
import { IDataOptions } from './interface/IDataOptions';

export default class Data extends Control<IDataOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        data: typeof CompatibleContainer;
    };

    reload(config?: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._children.data?.reload?.(config);
    }
}
