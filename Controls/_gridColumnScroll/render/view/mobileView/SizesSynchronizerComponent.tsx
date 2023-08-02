import * as React from 'react';
import { QA_SELECTORS } from '../../../common/data-qa';
import {
    FIXED_VIEW_WRAPPER_CLASS_NAME,
    NAVIGATION_CELL,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
} from '../../../Selectors';

type TKeyMask = '$key$';
const KEY_MASK: TKeyMask = '$key$';

export type TSelectorMask = `${string}${TKeyMask}${string}`;

export type ISize = {
    key: string;
    size: number | string;
};

export interface IMobileViewSizesSynchronizerComponentProps {
    beforeContentSize?: number;

    headerCellSelectorMask: TSelectorMask;
    headerCellsSize: ISize[];

    resultsCellSelectorMask: TSelectorMask;
    resultsCellsSize: ISize[];

    itemSelectorMask: TSelectorMask;
    itemsSize: ISize[];

    navigationSelectorMask: TSelectorMask;
    navigationSize: ISize[];

    fakeNavigationSelectorMask: TSelectorMask;
    fakeNavigationSize: ISize[];

    hasShadow?: boolean;
    hasStickyHeader?: boolean;
    hasStickyTopResults?: boolean;
}

function getSize(
    mask: TSelectorMask,
    sizes: ISize[],
    beforeContentSize?: number,
    beforeSizes?: 0 | ISize[][]
): string {
    if (!mask || !sizes || !sizes.length) {
        return '';
    }

    const getTopStyle = (index: number) => {
        if (beforeSizes === 0) {
            return `top: ${beforeContentSize || 0}px !important;`;
        }

        if (!(beforeSizes && beforeSizes.length)) {
            if (typeof beforeContentSize === 'number') {
                return `top: ${beforeContentSize}px !important;`;
            }
            return '';
        }

        const top = beforeSizes.reduce((acc, currentSizes) => {
            let size: number;

            if (currentSizes && currentSizes.length) {
                const value = currentSizes[index < currentSizes.length ? index : 0].size;
                size = typeof value === 'number' ? value : 0;
            } else {
                size = 0;
            }

            return acc + size;
        }, 0);

        return `top: ${top + (beforeContentSize || 0)}px !important;`;
    };

    return sizes
        .map((size, index) => {
            const selector = mask.replace(KEY_MASK, size.key);
            const height = typeof size.size === 'number' ? `${size.size}px` : size.size;
            return `${selector} { height: ${height}; ${getTopStyle(index)} }`;
        })
        .join('\n');
}

// TODO: #Test на весь этот механизм
export function SizesSynchronizerComponent(
    props: IMobileViewSizesSynchronizerComponentProps
): JSX.Element {
    const headerStyle = React.useMemo(
        () =>
            getSize(
                props.headerCellSelectorMask,
                props.headerCellsSize,
                props.beforeContentSize,
                props.hasStickyHeader ? 0 : undefined
            ),
        [props]
    );

    const resultsStyle = React.useMemo(() => {
        let beforeSizes: 0 | ISize[][];

        if (props.hasStickyTopResults) {
            if (props.hasStickyHeader) {
                beforeSizes = [props.headerCellsSize];
            } else {
                beforeSizes = 0;
            }
        }

        return getSize(
            props.resultsCellSelectorMask,
            props.resultsCellsSize,
            props.beforeContentSize,
            beforeSizes
        );
    }, [props]);

    const navigationStyle = React.useMemo(() => {
        let beforeSizes: 0 | ISize[][];

        if (props.hasStickyTopResults) {
            if (props.hasStickyHeader) {
                beforeSizes = [props.headerCellsSize, props.resultsCellsSize];
            } else {
                beforeSizes = [props.resultsCellsSize];
            }
        } else if (props.hasStickyHeader) {
            beforeSizes = [props.headerCellsSize];
        } else {
            beforeSizes = 0;
        }

        let style = getSize(
            props.fakeNavigationSelectorMask,
            props.fakeNavigationSize,
            props.beforeContentSize,
            beforeSizes
        );

        style += getSize(
            props.navigationSelectorMask,
            props.navigationSize,
            props.beforeContentSize,
            beforeSizes
        );

        return style;
    }, [props]);

    const shadowStyle = React.useMemo(() => {
        if (!props.hasShadow) {
            return '';
        }

        // Отключаем все тени и включаем те что нам нужны, другого способа нет.
        return (
            `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .controls-StickyHeader__shadow-bottom,` +
            `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .controls-StickyHeader__shadow-bottom ` +
            '{ visibility: hidden !important; }' +
            `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL} .controls-StickyHeader__shadow-bottom, ` +
            `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}.js-controls-GridColumnScroll__cell_scrollable .controls-StickyHeader__shadow-bottom ` +
            '{ visibility: visible !important; }'
        );
    }, [props]);

    const itemsStyle = React.useMemo(
        () => getSize(props.itemSelectorMask, props.itemsSize),
        [props.itemSelectorMask, props.itemsSize]
    );

    return (
        <>
            {/* Задает минимальную высоту ячеек обрезанной фиксированной части таблицы и,
                если включена стикишапка, их позицию(top). */}
            <style data-qa={QA_SELECTORS.HEADER_SIZE_STYLE}>{headerStyle}</style>
            <style data-qa={QA_SELECTORS.RESULTS_SIZE_STYLE}>{resultsStyle}</style>
            <style data-qa={QA_SELECTORS.NAVIGATION_SIZE_STYLE}>{navigationStyle}</style>
            <style data-qa={QA_SELECTORS.ITEMS_SIZE_STYLE}>{itemsStyle}</style>

            {/* Тень тоже задается стилями, т.к. стикишапка неспособна правильно посчитать размеры
             так, как ожидает этого таблица.*/}
            <style data-qa={QA_SELECTORS.SHADOWS_STYLE}>{shadowStyle}</style>
        </>
    );
}

export default React.memo(SizesSynchronizerComponent);
