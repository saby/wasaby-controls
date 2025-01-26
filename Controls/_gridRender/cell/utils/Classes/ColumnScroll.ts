import type { TColumnScrollViewMode, IGridSelectors } from 'Controls/gridColumnScroll';

export interface IGetColumnScrollClasses {
    columnScrollViewMode: TColumnScrollViewMode;
    columnScrollSelectors: IGridSelectors;
    columnScrollIsFixedCell: boolean;
    columnScrollIsFixedToEnd: boolean;
    hasColumnResizer: boolean;
    isSingleColspanedCell: boolean;
    isActsAsRowTemplate: boolean;
    hasColumnScroll: boolean;
}

export function getColumnScrollClasses(props: IGetColumnScrollClasses) {
    const {
        hasColumnScroll,
        columnScrollSelectors,
        columnScrollIsFixedCell,
        columnScrollIsFixedToEnd,
        hasColumnResizer,
        isSingleColspanedCell,
        isActsAsRowTemplate,
    } = props;

    if (!hasColumnScroll || !columnScrollSelectors) {
        return '';
    }

    let className = ' ';

    // Добавляем всем ячейкам класс от механизма абстрактного горизонтального скролла областей.
    // С помощью них реализованы базовые принципы скроллирования.
    // Также добавляем на ячейки детализирующие селекторы, определенные нами на уровне табличного горизонтального скролла.
    // Они нужны для мобильной адаптации и оптимизации, а так же для серверного рендеринга с изначальным смещением.
    if (columnScrollIsFixedCell) {
        className += `${columnScrollSelectors.FIXED_ELEMENT} ${columnScrollSelectors.FIXED_CELL} ${columnScrollSelectors.FIXED_START_CELL}`;
    } else if (columnScrollIsFixedToEnd) {
        className += `${columnScrollSelectors.FIXED_TO_RIGHT_EDGE_ELEMENT} ${columnScrollSelectors.FIXED_CELL} ${columnScrollSelectors.FIXED_END_CELL}`;
    } else {
        className += `${columnScrollSelectors.SCROLLABLE_ELEMENT} ${columnScrollSelectors.SCROLLABLE_CELL}`;
    }

    if (
        // Проверка на ресайзер нужна, только из-за неправильно написанной генерации колонок.
        // Оба флага будут true, даже когда строка разбита на колонки.
        !hasColumnResizer &&
        (isSingleColspanedCell || isActsAsRowTemplate)
    ) {
        className += ` controls-GridReact__cell_fullColspan_columnScroll ${columnScrollSelectors.STRETCHED_TO_VIEWPORT_ELEMENT}`;
    }

    return className;
}
