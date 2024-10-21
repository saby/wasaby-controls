import rk = require('i18n!Controls');
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import { isSingleSelectionItem, prepareEmpty } from 'Controls/_dropdown/Util';
import _Controller from 'Controls/_dropdown/_Controller';

export function getFullTexts(items: Model[], props, controller: _Controller): string[] {
    const { displayProperty, parentProperty, nodeProperty } = props;
    const texts: string[] = [];
    factory(items).each((item) => {
        let text = '';
        if (parentProperty) {
            const controllerItems = controller.getItems() || props.items;
            let parentKey = item?.get(parentProperty);
            while (
                controllerItems &&
                parentKey !== undefined &&
                parentKey !== null &&
                parentKey !== props.root
            ) {
                const parent = controllerItems.getRecordById(parentKey);
                if (parent?.get(nodeProperty) === false) {
                    text = `${parent.get(displayProperty)} ${text}`;
                } else {
                    break;
                }
                parentKey = parent?.get(parentProperty);
            }
        }
        text += item?.get(displayProperty) ?? '';
        if (text) {
            texts.push(text);
        }
    });
    return texts;
}

export function getFullText(items, props, controller): string {
    const texts = getFullTexts(items, props, controller);
    return texts.join(', ');
}

/** Возвращает текстовое значение селектора
 * @param items
 * @param props
 * @param controller
 */
export function getTextWithLimit(items: Model[], props, controller: _Controller): string {
    const texts = getFullTexts(items, props, controller);
    if (props.maxVisibleItems) {
        return texts.slice(0, props.maxVisibleItems).join(', ');
    }
    return texts.join(', ');
}

export function getText(items: Model[], props, controller: _Controller): string {
    const { selectedAllText, selectedAllKey, emptyText, emptyKey, keyProperty } = props;
    const item = items[0];
    let text = '';
    if (isSingleSelectionItem(item, selectedAllText, keyProperty, selectedAllKey)) {
        text = selectedAllText;
    } else if (isSingleSelectionItem(item, emptyText, keyProperty, emptyKey)) {
        text = prepareEmpty(emptyText);
    } else {
        text = getTextWithLimit(items, props, controller);
    }
    return text;
}

export function getMoreText(items: Model[], maxVisibleItems: number): string {
    let moreText = '';
    if (maxVisibleItems) {
        if (items.length > maxVisibleItems) {
            moreText = ', ' + rk('еще') + ' ' + (items.length - maxVisibleItems);
        }
    }
    return moreText;
}

function getMultiText(selectedItems, menuConfigs) {}
