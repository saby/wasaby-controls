/**
 * @kaizen_zone 96668898-7a01-436d-86e7-2f42d52f6246
 */
import { defaultHeight } from 'Controls/buttons';
import { IButtonOptions } from 'Controls/_dropdown/Button';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { TVisibility } from 'Controls/marker';

/**
 * Модуль подготовки css стилей для отображения меню
 * @module
 * @public
 */

const MENU_MODULE = 'Controls/menu';

/**
 * Получает размер иконки
 * @param {object} options
 */
function getIconSize({ iconSize, icon }: Pick<IButtonOptions, 'icon' | 'iconSize'>) {
    const sizes = { small: 's', medium: 'm', large: 'l' };
    let resultIconSize;
    if (iconSize) {
        resultIconSize = iconSize;
    } else {
        for (const s in sizes) {
            if (icon?.indexOf('icon-' + s) !== -1) {
                resultIconSize = sizes[s];
            }
        }
    }
    return resultIconSize || 'm';
}

function getIconSizeClass(icon: IButtonOptions['icon'], iconSize: IButtonOptions['iconSize']) {
    if (icon) {
        return ` controls-MenuButton_iconSize-${getIconSize({ icon, iconSize })} `;
    }
    return '';
}

interface IDropdownButtonProps
    extends Pick<
        IButtonOptions,
        | 'icon'
        | 'iconTemplate'
        | 'caption'
        | 'viewMode'
        | 'inlineHeight'
        | 'fontSize'
        | 'iconSize'
        | 'headerContentTemplate'
        | 'showHeader'
        | 'items'
        | 'parentProperty'
        | 'root'
    > {
    markerVisibility?: TVisibility;
}

/**
 * Генерирует css класс для выравнивания стики окна по переданным опциям
 * @param {IDropdownButtonProps} options
 */
export function cssStyleGeneration(options: IDropdownButtonProps) {
    const isCircle = (options.icon || options.iconTemplate) && !options.caption;
    const viewMode = options.viewMode === 'linkButton' ? 'link' : options.viewMode;
    let currentHeight = options.inlineHeight || defaultHeight(viewMode, isCircle);
    if (!currentHeight && options.viewMode === 'linkButton') {
        currentHeight = 'default';
    }
    let offsetClassName = ` controls-MenuButton_inlineHeight-${currentHeight}_popup `;
    offsetClassName += `controls-MenuButton_${isCircle ? 'isCircle' : 'isDefault'}_popup `;

    const iconSize = getIconSize(options);
    if (
        viewMode === 'link' &&
        (!options.icon || iconSize === 's' || iconSize === 'xs') &&
        !currentHeight
    ) {
        // у viewMode = 'link' по умолчанию нет высоты
        offsetClassName += 'controls-MenuButton_link_inlineHeight-default_popup ';
    } else if (options.icon) {
        if (!currentHeight) {
            offsetClassName += 'controls-MenuButton_withIcon_popup ';
        }
        offsetClassName += getIconSizeClass(options.icon, iconSize);
    }

    if (options.markerVisibility === 'visible' || options.markerVisibility === 'onactivated') {
        offsetClassName += 'controls-MenuButton_marker-visible_popup ';
    } else {
        offsetClassName += 'controls-MenuButton_marker-hidden_popup ';
    }

    offsetClassName += `controls-MenuButton_popup controls-MenuButton_${viewMode}_popup `;

    if (!options.headerContentTemplate && !options.headerTemplate && !options.showHeader) {
        offsetClassName += 'controls-Dropdown_withoutHeader_popup ';
    } else {
        offsetClassName += 'controls-Dropdown_withHeader_popup ';
    }

    if (options.items && isLoaded(MENU_MODULE)) {
        const itemWithIcon = loadSync(MENU_MODULE).getIconInRoot(options.items, options);
        if (itemWithIcon) {
            offsetClassName += `controls-Dropdown_iconSize-${
                itemWithIcon.get('iconSize') || options.iconSize
            }_popup`;
        }
    }

    return offsetClassName;
}
