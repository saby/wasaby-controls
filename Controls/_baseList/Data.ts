/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
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
        // Если cписок строится асинхронно и через старую схему,
        // то внутренний DataContainer построится только после загрузки данных
        // до этого он будет недоступен в _children
        if (this._children.data) {
            return this._children.data?.reload?.(config);
        } else {
            return Promise.reject();
        }
    }
}
