/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import {
    getButtonTemplate,
    getSimpleButtonTemplateOptionsByItem,
    ItemTemplate,
    showType,
} from 'Controls/toolbars';
import { Logger } from 'UI/Utils';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { DOMUtil, getWidth } from 'Controls/sizeUtils';
import { constants } from 'Env/Env';
import * as ReactDOMServer from 'react-dom/server';
import { IOperationsPanelItem } from '../_interface/IOperationsPanel';
import { TemplateFunction } from 'UI/Base';

type Key = string | number | null;

let MENU_WIDTH = 0;
const EMPTY_ORIGINAL_SHOW_TYPE = 'emptyOriginalShowType';

const createActualItems = (itemsPram: RecordSet<Record>): RecordSet<Record> => {
    itemsPram.each((item) => {
        const iconSize = item.get('iconSize');
        const viewModeValue = item.get('viewMode');
        let captionValue = '';

        if (viewModeValue && viewModeValue !== 'ghost') {
            captionValue = item.get('caption');
        } else if (item.get('title') && !viewModeValue) {
            captionValue = item.get('title');
        }

        item.set('viewMode', viewModeValue || 'link');
        item.set('caption', captionValue);
        item.set('iconSize', iconSize || 'm');
    });

    return itemsPram;
};

const _private = {
    initializeConstants(theme: string) {
        if (!MENU_WIDTH) {
            const iconClass = `icon-medium icon-SettingsNew controls-Toolbar__menu_spacing-small_theme-${theme}`;
            MENU_WIDTH =
                constants.isBrowserPlatform &&
                getWidth(`<i class="${iconClass}"/></span>`);
        }
    },

    getContentTemplate(item, itemTemplate, itemTemplateProperty) {
        let contentTemplate = null;
        if (itemTemplateProperty && item) {
            contentTemplate = item.get(itemTemplateProperty);
        }
        if (!contentTemplate && itemTemplate !== ItemTemplate) {
            contentTemplate = itemTemplate;
        }
        return contentTemplate;
    },

    getItemsSizes(
        items,
        visibleKeys,
        theme,
        itemTemplate,
        itemTemplateProperty
    ) {
        const itemsMark = [];
        let item;
        let buttonTemplateOptions;

        visibleKeys.forEach((key) => {
            item = items.getRecordById(key);
            buttonTemplateOptions = _private.getButtonTemplateOptionsForItem(
                item,
                itemTemplateProperty
            );
            // Сейчас никак нельзя получить верстку реакт компонента по другому
            // Удалить после перехода на реакт
            itemsMark.push(
                ReactDOMServer.renderToString(
                    ItemTemplate.render({
                        item,
                        size: 'm',
                        itemsSpacing: 'medium',
                        theme,
                        direction: 'horizontal',
                        buttonTemplate: getButtonTemplate(),
                        buttonTemplateOptions,
                        contentTemplate: _private.getContentTemplate(
                            item,
                            itemTemplate,
                            itemTemplateProperty
                        ),
                    })
                )
            );
        });

        return DOMUtil.getElementsWidth(
            itemsMark,
            'controls-Toolbar__item',
            true
        );
    },

    getButtonTemplateOptionsForItem(
        item: Record,
        itemTemplateProperty?: string
    ): object {
        const buttonOptions = getSimpleButtonTemplateOptionsByItem(item);

        if (
            itemTemplateProperty &&
            item.get(itemTemplateProperty) &&
            !buttonOptions._caption &&
            !buttonOptions._icon
        ) {
            Logger.error(
                'OperationsPanel: при использовании своего шаблона отображения операции (itemTemplateProperty) ' +
                    'необходимо задать caption и/или icon на каждой операции для корректных расчётов размеров'
            );
        }

        return buttonOptions;
    },

    setShowType(items: RecordSet<IOperationsPanelItem>, type: showType): void {
        items.each((item) => {
            const configShowType = item.get('showType');
            // Сохраняем переданный в опции showType, чтобы при изменении размеров панели действий
            // не потерять положение кнопки, определённое пользователем в опции
            if (
                item.get('originalShowType') === undefined &&
                configShowType === undefined
            ) {
                item.set('originalShowType', EMPTY_ORIGINAL_SHOW_TYPE);
            }
            if (
                item.get('originalShowType') === undefined &&
                configShowType !== undefined
            ) {
                item.set('originalShowType', configShowType);
            }
            if (item.get('originalShowType') !== showType.MENU) {
                item.set('showType', type);
            }
        });
    },

    showHiddenItemsAsIcons(
        items: RecordSet,
        emptyWidth: number,
        hiddenItemsKeys: Key[],
        theme: string,
        defaultItemTemplate: TemplateFunction,
        itemTemplateProperty: string
    ): void {
        hiddenItemsKeys.forEach((key) => {
            const item = items.getRecordById(key);
            if (item.get('icon')) {
                item.set('hiddenCaption', item.get('caption'));
                item.set('caption', null);
            }
        });

        const hiddenItemsSizes = _private.getItemsSizes(
            items,
            hiddenItemsKeys,
            theme,
            defaultItemTemplate,
            itemTemplateProperty
        );

        hiddenItemsKeys.forEach((key, index) => {
            const itemSize = hiddenItemsSizes[index];
            if (emptyWidth > itemSize) {
                const item = items.getRecordById(key);
                item.set('showType', showType.MENU_TOOLBAR);
                emptyWidth -= itemSize;
            }
        });
    },
};

export = {
    fillItemsType(
        keyProperty,
        parentProperty,
        items,
        availableWidth,
        theme,
        defaultItemTemplate,
        itemTemplateProperty
    ) {
        let itemsSizes;
        let currentWidth;
        const visibleItemsKeys: Key[] = [];

        createActualItems(items);

        items.each((item) => {
            const caption = item.get('caption');
            const hiddenCaption = item.get('hiddenCaption');

            if (!item.get(parentProperty)) {
                visibleItemsKeys.push(item.get(keyProperty));
            }
            if (!caption && hiddenCaption) {
                item.set('caption', hiddenCaption);
            }
        });

        if (visibleItemsKeys.length <= 1) {
            _private.setShowType(items, showType.TOOLBAR);
        } else {
            itemsSizes = _private.getItemsSizes(
                items,
                visibleItemsKeys,
                theme,
                defaultItemTemplate,
                itemTemplateProperty
            );
            currentWidth = itemsSizes.reduce((acc, width) => {
                return acc + width;
            }, 0);
            _private.initializeConstants(theme);
            currentWidth += MENU_WIDTH;
            if (currentWidth > availableWidth) {
                _private.setShowType(items, showType.MENU);
                let toolbarItemsWidth: number = 0;
                const hiddenItemsKeys: Key[] = [];

                for (let i = visibleItemsKeys.length - 1; i >= 0; i--) {
                    const item = items.getRecordById(visibleItemsKeys[i]);
                    if (currentWidth > availableWidth) {
                        item.set('showType', showType.MENU);
                        hiddenItemsKeys.push(visibleItemsKeys[i]);
                    } else {
                        item.set('showType', showType.MENU_TOOLBAR);
                        toolbarItemsWidth += itemsSizes[i];
                    }
                    currentWidth -= itemsSizes[i];
                }

                const emptyWidth =
                    availableWidth - toolbarItemsWidth - MENU_WIDTH;
                if (hiddenItemsKeys.length && emptyWidth) {
                    _private.showHiddenItemsAsIcons(
                        items,
                        emptyWidth,
                        hiddenItemsKeys,
                        theme,
                        defaultItemTemplate,
                        itemTemplateProperty
                    );
                }
            } else {
                _private.setShowType(items, showType.TOOLBAR);
            }
        }

        return items;
    },
    _private, // for unit testing
};
