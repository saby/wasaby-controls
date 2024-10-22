/**
 * @kaizen_zone 5c260dca-bc4a-4366-949a-824d00984a8e
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import {
    ButtonTemplate,
    IButtonOptions,
    defaultHeight,
    defaultFontColorStyle,
    getDefaultOptions,
} from 'Controls/buttons';
import { Abstract as ChainAbstract, factory } from 'Types/chain';
import { ICrudPlus } from 'Types/source';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudWrapper } from 'Controls/dataSource';
import { showType } from './interfaces/IShowType';
import { getIcon, isSVGIcon } from 'Controls/Utils/Icon';

type TItem = Record;
type TItems = RecordSet<TItem>;

export function getButtonTemplate(): TemplateFunction {
    return ButtonTemplate;
}

export function loadItems(source: ICrudPlus, filter?: object): Promise<TItems> {
    const crudWrapper = new CrudWrapper({ source });
    const queryParams = {};
    if (filter) {
        queryParams.filter = filter;
    }
    return crudWrapper.query(queryParams);
}

export function hasSourceChanged(newSource?: ICrudPlus, oldSource?: ICrudPlus): boolean {
    const currentSource = oldSource;
    return newSource && currentSource !== newSource;
}

export function getSimpleButtonTemplateOptionsByItem(
    item: TItem,
    toolbarOptions: IControlOptions = {}
): IButtonOptions {
    const toolbarViewMode = toolbarOptions.viewMode;
    const cfg: IButtonOptions = {};
    const defaultOptions = getDefaultOptions();
    const icon = getIcon(item.get('icon'));
    const isSVG = isSVGIcon(item.get('icon'));
    const readOnly = item.get('readOnly') || toolbarOptions.readOnly;
    const isVerticalDirection = toolbarOptions.direction === 'vertical';
    const iconStyle = item.get('iconStyle') || toolbarOptions.iconStyle || defaultOptions.iconStyle;

    const isGhostViewMode =
        isVerticalDirection &&
        (!item.get('viewMode') ||
            item.get('viewMode') === 'link' ||
            item.get('viewMode') === 'linkButton');

    const viewMode = toolbarViewMode ? 'filled' : isGhostViewMode ? 'ghost' : item.get('viewMode');
    const caption = item.get('caption');

    if (
        typeof icon === 'undefined' &&
        typeof caption === 'undefined' &&
        typeof item.get(toolbarOptions.parentProperty) === 'undefined'
    ) {
        Logger.error(
            'Controls.toolbars.View: У элемента не задан "icon" и "caption". Элемент тулбара может отображаться некорректно'
        );
    }

    const getButtonStyle = () => {
        if (toolbarViewMode && toolbarOptions.buttonStyle) {
            return toolbarOptions.buttonStyle;
        }
        return viewMode === 'ghost'
            ? 'default'
            : item.get('buttonStyle') || defaultOptions.buttonStyle;
    };

    // todo: https://online.sbis.ru/opendoc.html?guid=244a5058-47c1-4896-a494-318ba2422497
    const inlineHeight = isVerticalDirection
        ? 'xl'
        : item.get('inlineHeight') ||
          toolbarOptions.inlineHeight ||
          (viewMode === 'filled' ? 'default' : defaultHeight(viewMode));
    const iconSize = isVerticalDirection
        ? 'm'
        : item.get('iconSize') || (viewMode === 'filled' ? 's' : toolbarOptions.iconSize || 'm');

    const translucent = toolbarOptions.translucent || false;

    cfg._hoverIcon = true;
    cfg._buttonStyle = readOnly ? 'readonly' : getButtonStyle();
    cfg._translucent = translucent;
    cfg._contrastBackground = item.get('contrastBackground');
    cfg._viewMode = viewMode;
    cfg._height = inlineHeight;
    cfg._fontColorStyle = translucent
        ? 'forTranslucent'
        : item.get('fontColorStyle') ||
          toolbarOptions.fontColorStyle ||
          defaultFontColorStyle(viewMode);
    cfg._fontSize = item.get('fontSize') || defaultOptions.fontSize;
    cfg._hasIcon = !!icon;
    cfg._caption = caption;
    cfg._stringCaption = typeof caption === 'string' || caption instanceof String;
    cfg._captionPosition = item.get('captionPosition') || defaultOptions.captionPosition;
    if (['left', 'right'].includes(cfg._captionPosition)) {
        cfg._captionPosition = cfg._captionPosition === 'left' ? 'start' : 'end';
    }
    cfg._icon = icon;
    cfg._isSVGIcon = isSVG;
    cfg._iconSize = iconSize;
    cfg._iconStyle = readOnly ? 'readonly' : translucent ? 'forTranslucent' : iconStyle;
    cfg.readOnly = readOnly;
    cfg._underlineVisible = item.get('underlineVisible') || toolbarOptions.underlineVisible;

    return cfg;
}

export function getTemplateByItem(item: TItem, options): TemplateFunction {
    const selfItemTemplate: TemplateFunction = item.get(options.itemTemplateProperty);

    if (selfItemTemplate) {
        return selfItemTemplate;
    }

    return options.itemTemplate;
}

export function getMenuItems<T extends Record>(
    items: RecordSet<T> | T[],
    showOnlyMenu: boolean = false
): ChainAbstract<T> {
    return factory(items).filter((item) => {
        if (showOnlyMenu) {
            return true;
        }
        return item.get('showType') !== showType.TOOLBAR;
    });
}

export function needShowMenu(items: RecordSet, parentProperty?: string): boolean {
    const enumerator = items.getEnumerator();
    while (enumerator.moveNext()) {
        const item = enumerator.getCurrent();
        const isRootItem =
            !parentProperty ||
            item.get(parentProperty) === undefined ||
            item.get(parentProperty) === null;
        if (item.get('showType') !== showType.TOOLBAR && isRootItem) {
            return true;
        }
    }

    return false;
}
