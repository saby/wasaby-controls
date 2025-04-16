import { TSupportedLibs } from 'Controls/gridColumnScroll';
import { Logger } from 'UI/Utils';

function GridColumnScrollError(libName: TSupportedLibs) {
    return Logger.error(
        'Ошибка использования функционала Controls/gridColumnScroll. ' +
            'Библиотека таблиц не загружена! ' +
            'Попытка создания табличного контроллера с аспектом скроллирования, хотя библиотека табличного представления не загружена. ' +
            `В данном случае - библиотека ${libName}. ` +
            'Библиотека Controls/gridColumnScroll - вспомогательная библиотека для горизонтального скроллирования колонок таблиц.'
    );
}

function GetGridError() {
    return Logger.error('Библиотека Controls/grid должна быть загружена!');
}

function InvalidStickyColumnsCountValueError(grid: object) {
    return Logger.error(
        'Неверное значение опции stickyColumnsCount! ' +
            'Значение опции stickyColumnsCount должно быть меньше чем количество колонок в таблице. ' +
            'Должна быть хотябы одна скроллируемая колонка.',
        grid
    );
}

function ColumnTemplateError() {
    return Logger.warn(
        'Controls/grid. В шаблон "Controls/grid:ColumnTemplate" не передана область видимости ("scope"). ' +
            'Полноценный рендер невозможен, см. https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/columns/template/from-wml/'
    );
}

function GroupTemplateError() {
    return Logger.warn(
        'Controls/grid. В шаблон "Controls/grid:GroupTemplate" не передана область видимости ("scope"). ' +
            'Полноценный рендер невозможен, см. https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/item/#config'
    );
}

function GroupTemplateAndGroupRenderError() {
    return Logger.warn(
        'В список переданы одновременно опции groupTemplate и groupRender.' +
            ' Опция groupTemplate будет проигнорирована.'
    );
}

function IObservableObjectError() {
    return Logger.error(
        'Не возможно отслеживать изменения results, т.к. results не реализует интерфейс IObservableObject'
    );
}

export {
    GridColumnScrollError,
    GetGridError,
    InvalidStickyColumnsCountValueError,
    ColumnTemplateError,
    GroupTemplateError,
    GroupTemplateAndGroupRenderError,
    IObservableObjectError,
};
