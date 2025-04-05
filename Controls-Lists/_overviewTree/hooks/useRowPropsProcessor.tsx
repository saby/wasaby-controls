import * as React from 'react';
import { IRowProps } from 'Controls/treeGrid';
import { Model } from 'Types/entity';
import { ListSlice } from 'Controls/dataFactory';
import { Logger } from 'UI/Utils';

// Хук для обработки пропсов строк
export function useRowPropsProcessor(
    slice?: ListSlice,
    originalGetRowProps?: (item: Model) => IRowProps
) {
    return React.useCallback(
        (item: Model): IRowProps => {
            if (!slice || !slice.state.parentProperty || !slice.state.nodeProperty) {
                Logger.error('В слайсе не задан nodeProperty или parentProperty');
                return {};
            }

            const fromProps = originalGetRowProps?.(item) || {};
            const isRoot = item.get(slice.state.parentProperty) === slice.state.root;
            const isNode = !!item.get(slice.state.nodeProperty);
            const isFirstItem = slice.state.items?.at(0) === item;

            /** Верхний отступ */
            let paddingTop = fromProps.padding?.top || 'default';
            if (isFirstItem) {
                paddingTop = 'null';
            } else if (isRoot) {
                paddingTop = 'l';
            } else if (isNode) {
                paddingTop = 'm';
            }

            /** Нижний отступ */
            const paddingBottom = isNode ? '2xs' : fromProps.padding?.bottom || 'default';

            /** Стиль фона при ховере */
            const hoverBackground = isNode ? 'none' : fromProps.hoverBackgroundStyle || 'danger';

            /** Размер шрифта */
            let fontSize = fromProps.fontSize || 'm';
            if (isRoot) {
                fontSize = '4xl';
            } else if (isNode) {
                fontSize = 'xl';
            }

            /** Жирность шрифта */
            const fontWeight = isNode ? 'bold' : 'default';

            /** Курсор */
            const cursorStyle = isNode ? 'default' : fromProps.cursor || 'default';

            /** Первый айтем невидимый, для отображения в заголовке */
            const className = isFirstItem
                ? 'ControlsLists-overviewTree__invisibleFirstItem'
                : fromProps.className;

            return {
                ...fromProps,

                // Базовые настройки
                markerVisible: false,
                expanderIcon: 'none',
                withoutExpanderPadding: true,
                withoutLevelPadding: true,

                // Интерактивность
                hoverBackgroundStyle: hoverBackground,
                cursor: cursorStyle,

                className,

                // Шрифт
                fontSize,
                fontWeight,

                // Отступы
                padding: {
                    top: paddingTop,
                    bottom: paddingBottom,
                },
            };
        },
        [slice, originalGetRowProps]
    );
}
