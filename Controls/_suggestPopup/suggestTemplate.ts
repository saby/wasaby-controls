/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import * as template from 'wml!Controls/_suggestPopup/suggestTemplate';
import * as columnTemplate from 'wml!Controls/_suggestPopup/DefaultColumnContent';

import { IControlOptions, Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Model } from 'Types/entity';

export default class SuggestTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _defaultColumns = [];

    protected _beforeMount(options?: IControlOptions): Promise<void> | void {
        this._defaultColumns = [
            {
                displayProperty: options.displayProperty || 'title',
                width: 'auto',
                fontSize: options.fontSize || 'm',
                nodeProperty: options.nodeProperty,
                template: columnTemplate,
            },
        ];
    }

    protected _itemClick(event: SyntheticEvent, item: Model) {
        this._notify('itemClick', [item]);
    }
}
