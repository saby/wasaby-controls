/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import CollectionItem, { IOptions as ICollectionItemOptions } from './CollectionItem';
import { TemplateFunction } from 'UI/Base';
import { TListTriggerPosition } from 'Controls/interface';

export interface IOptions extends ICollectionItemOptions {
    position: TListTriggerPosition;
}

export default class Trigger extends CollectionItem<null> {
    private _$position: TListTriggerPosition;

    readonly listElementName: string = 'loading-trigger';

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return 'Controls/baseList:CollectionTriggerComponent';
    }

    getPosition(): TListTriggerPosition {
        return this._$position;
    }
}

Object.assign(Trigger.prototype, {
    'Controls/display:Trigger': true,
    _moduleName: 'Controls/display:Trigger',
    _instancePrefix: '-trigger',
    _$position: null,
});
