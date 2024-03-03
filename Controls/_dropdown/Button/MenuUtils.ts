/**
 * @kaizen_zone 96668898-7a01-436d-86e7-2f42d52f6246
 */
import { defaultHeight } from 'Controls/buttons';

function getIconSize(options: object) {
    const sizes = ['small', 'medium', 'large'];
    let iconSize;
    if (options.iconSize) {
        switch (options.iconSize) {
            case 's':
                iconSize = sizes[0];
                break;
            case 'm':
                iconSize = sizes[1];
                break;
            case 'l':
                iconSize = sizes[2];
                break;
        }
    } else {
        sizes.forEach((size) => {
            if (options.icon.indexOf('icon-' + size) !== -1) {
                iconSize = size;
            }
        });
    }
    return iconSize;
}

function cssStyleGeneration(options: object) {
    // для каждого размера вызывающего элемента создаем класс, который выравнивает popup через margin.
    let offsetClassName = 'controls-MenuButton_' + options.viewMode;

    if (
        !options.icon ||
        options.viewMode === 'ghost' ||
        options.viewMode === 'onlinePageHeader' ||
        options.viewMode === 'filled' ||
        options.viewMode === 'linkButton' ||
        options.viewMode === 'outlined'
    ) {
        if (options.viewMode === 'link' && options.inlineHeight) {
            offsetClassName += '__height-' + options.inlineHeight;
        } else {
            const isCircle = options.icon && options.viewMode === 'filled';
            const currentHeight =
                options.inlineHeight ||
                defaultHeight(options.viewMode, isCircle) ||
                options.fontSize;
            offsetClassName += '__' + currentHeight;
        }
    } else if (options.icon) {
        // у кнопки типа 'Ссылка' высота вызывающего элемента зависит от размера иконки,
        // поэтому необходимо это учесть при сдвиге
        offsetClassName += '_iconSize-' + (getIconSize(options) || 'medium');
    }
    if (
        (options.viewMode === 'ghost' ||
            options.viewMode === 'filled' ||
            options.viewMode === 'outlined') &&
        options.icon
    ) {
        offsetClassName += '_iconSize-' + (getIconSize(options) || 'medium');
    }
    if (!options.headerTemplate && !options.showHeader && options.viewMode === 'link') {
        offsetClassName += '_duplicate';
    }
    offsetClassName += '_popup';
    return offsetClassName;
}

export = {
    cssStyleGeneration,
};
