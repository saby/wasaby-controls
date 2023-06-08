/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import CollectionItem, {
    IOptions as ICollectionItemOptions,
} from './CollectionItem';
import { TemplateFunction } from 'UI/Base';

export type TTriggerPosition = 'top' | 'bottom';

export interface IOptions extends ICollectionItemOptions {
    position: TTriggerPosition;
}

export default class Trigger extends CollectionItem<null> {
    private _$position: TTriggerPosition;

    readonly listElementName: string = 'loading-trigger';

    getTemplate(
        itemTemplateProperty: string,
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return 'Controls/baseList:TriggerComponent';
    }

    getPosition(): TTriggerPosition {
        return this._$position;
    }
}

Object.assign(Trigger.prototype, {
    'Controls/display:Trigger': true,
    _moduleName: 'Controls/display:Trigger',
    _instancePrefix: '-trigger',
    _$position: null,
});
