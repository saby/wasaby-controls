import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout/_verticalTabs/Buttons';
import 'css!Controls-TabsLayout/_verticalTabs/Buttons';
import { Model } from 'Types/entity';
import { IVerticalTabsItem, IVerticalTabs } from './IVerticalTabs';
import { MAX_ITEM_CAPTION_LENGTH } from './resource/constants';

/**
 * Контрол предоставляет пользователю возможность выбрать элемент вертикальных вкладок.
 * @extends UI/Base:Control
 * @implements Controls-TabsLayout/_verticalTabs/IVerticalTabs
 *
 * @public
 * @demo Controls-TabsLayout-demo/VerticalTabs/Index
 */

export default class Buttons extends Control<IVerticalTabs> {
    protected _template: TemplateFunction = template;

    protected _getBackgroundStyle(item: Model<IVerticalTabsItem>): string {
        if (item.get('backgroundStyle')) {
            return 'controls-background-' + item.get('backgroundStyle');
        }
        if (this._options.backgroundStyle) {
            return 'controls-background-' + this._options.backgroundStyle;
        }
        const className = 'VerticalTabs-buttons__button-background';
        return (
            className +
            (item.get(this._options.keyProperty) === this._options.selectedKey ? '-active' : '')
        );
    }
    protected _getItemCaption(item: Model<IVerticalTabsItem>): string {
        const caption = item.get(this._options.displayProperty);
        const counter = item.get('mainCounter') ? item.get('mainCounter') + '' : '';
        const length = MAX_ITEM_CAPTION_LENGTH - counter.length;
        if (caption.length > length) {
            return caption.slice(0, length) + '...';
        }
        return caption;
    }

    protected _getFontWeight(item: Model<IVerticalTabsItem>): string {
        if (item.get('fontWeight')) {
            return item.get('fontWeight');
        }
        if (this._options.fontWeight) {
            return this._options.fontWeight;
        }
        if (this._options.selectedKey === item.get(this._options.keyProperty)) {
            return 'bold';
        } else {
            return 'normal';
        }
    }

    protected _isItemSelected(item: Model<IVerticalTabsItem>): boolean {
        return item.get(this._options.keyProperty) === this._options.selectedKey;
    }

    protected _itemClickHandler(event: Event, item: Model<IVerticalTabsItem>): void {
        const itemId = item.get(this._options.keyProperty);
        if (itemId !== this._options.selectedKey) {
            this._notify('selectedKeyChanged', [itemId]);
        }
    }

    static getDefaultOptions(): IVerticalTabs {
        return {
            displayProperty: 'title',
            keyProperty: 'id',
        };
    }
}
