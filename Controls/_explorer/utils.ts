/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { Path } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { IHeaderCell, THeaderVisibility, isReactColumns } from 'Controls/grid';
import { INavigationOptionValue, INavigationPositionSourceConfig, TKey } from 'Controls/interface';
import { IExplorerOptions, TBreadcrumbsVisibility, TExplorerViewMode } from './interface/IExplorer';
import { NODE_TYPE_PROPERTY_GROUP } from 'Controls/baseTree';

/**
 * Вычисляет итоговую видимость заголовка таблицы:
 * <ul>
 *     <li>
 *         Если breadcrumbsVisibility === 'hidden', то используем дефолт headerVisibility || 'hasdata'
 *    </li>
 *    <li>
 *        Если breadcrumbsVisibility === 'visible', то
 *        <ul>
 *            <li>
 *                Если нужно выводить кнопку "Назад" в заголовке таблицы, то
 *                <ul>
 *                    <li>
 *                        при нахождении в корне используем дефолт headerVisibility || 'hasdata'
 *                    </li>
 *                    <li>
 *                        при нахождении не в корне заголовок всегда делаем видимым
 *                    </li>
 *                </ul>
 *            </li>
 *            <li>
 *                Во всех остальных случаях используем дефолт headerVisibility || 'hasdata'
 *            </li>
 *        </ul>
 *    </li>
 * </ul>
 */
export function getHeaderVisibility(
    root: TKey,
    topRoot: TKey,
    header: undefined | IHeaderCell[],
    headerVisibility: undefined | THeaderVisibility,
    breadcrumbsVisibility: undefined | TBreadcrumbsVisibility
): THeaderVisibility {
    const def = headerVisibility || 'hasdata';

    // Если крошки скрыты, то руководствуемся значением опции headerVisibility
    if (breadcrumbsVisibility === 'hidden') {
        return def;
    }

    // Если нужно выводить кнопку "Назад" в заголовке, то в случае если мы находимся не в корне,
    // то принудительно показываем заголовок
    if (needBackButtonInHeader(header, breadcrumbsVisibility)) {
        return root === (topRoot || null) ? headerVisibility || 'hasdata' : 'visible';
    }

    return def;
}

/**
 * На основании конфигурации заголовка таблицы определяет пустая или нет его первая ячейка.
 */
export function firstHeaderCellIsEmpty(header: undefined | IHeaderCell[]): boolean {
    // title - устаревшее поле колонки
    const firstHeaderCell = header?.length && (header[0] as IHeaderCell & { title: string });
    return (
        firstHeaderCell &&
        !(firstHeaderCell.title || firstHeaderCell.caption) &&
        !firstHeaderCell[isReactColumns(header) ? 'render' : 'template']
    );
}

/**
 * Вычисляет нужно или нет выводить кнопку "Назад" в первой ячейке заголовка таблицы.
 * Нужно выводить если у нас табличное представление, в первой ячейке заголовка
 * не задан пользовательский контент и крошки не скрыты.
 *
 * <b>Deprecated!!! Use {@link calculateBreadcrumbsLayout}</b>
 *
 * @deprecated Метод устарел
 */
export function needBackButtonInHeader(
    header: undefined | IHeaderCell[],
    breadcrumbsVisibility: undefined | TBreadcrumbsVisibility
): boolean {
    return breadcrumbsVisibility !== 'hidden' && firstHeaderCellIsEmpty(header);
}

/**
 * На основании старого и нового пути определяем идет ли возврат назад.
 * Возврат назад идет если:
 *  * новый путь пустой, а старый нет
 *  * oldPath начинается с newPath
 */
export function detectGoingBackByPath(oldPath: Path, newPath: Path): boolean {
    const pathSeparator = '_';
    // ф-ия преобразует данные крошек в строку
    const breadcrumbsStringify = (path: Path) => {
        return (path || [])
            .map((item) => {
                return item.getKey();
            })
            .join(pathSeparator);
    };

    // Строковое представление пути, соответсвующее oldPath
    const oldPathStr = breadcrumbsStringify(oldPath);
    // Строковое представление пути, соответсвующее newPath
    const newPathStr = breadcrumbsStringify(newPath);

    return (
        (newPathStr === '' && oldPathStr !== '') ||
        oldPathStr.startsWith(`${newPathStr}${pathSeparator}`)
    );
}

export function needRecreateCollection(
    oldViewMode: TExplorerViewMode,
    newViewMode: TExplorerViewMode
): boolean {
    if (oldViewMode === 'list' && newViewMode === 'table') {
        return true;
    }

    return oldViewMode === 'table' && newViewMode === 'list';
}

export function resolveViewMode(
    viewMode: TExplorerViewMode,
    useColumns: boolean
): TExplorerViewMode | 'columns' {
    return viewMode === 'list' && useColumns ? 'columns' : viewMode;
}

/**
 * На основании настроек навигации определяет используется ли навигация по курсору.
 */
export function isCursorNavigation(
    navigation: INavigationOptionValue<unknown>
): navigation is INavigationOptionValue<INavigationPositionSourceConfig> {
    return !!navigation && navigation.source === 'position';
}

/**
 * Собирает курсор для навигации относительно заданной записи.
 * @param item - запись, для которой нужно "собрать" курсор
 * @param navigation - конфигурация курсорной навигации
 */
export function getCursorValue(
    item: Model,
    navigation: INavigationOptionValue<INavigationPositionSourceConfig>
): unknown[] {
    const position: unknown[] = [];
    const optField = navigation.sourceConfig.field;
    const fields: string[] = optField instanceof Array ? optField : [optField];

    let noData = true;
    fields.forEach((field) => {
        const fieldValue = item.get(field);

        position.push(fieldValue);
        noData = noData && fieldValue === undefined;
    });

    // Если все поля курсора undefined, значит курсора нет
    if (noData) {
        return undefined;
    }

    return position;
}

/**
 * Возможные расположения хлебных крошек в explorer
 * @typedef Controls/_explorer/utils/TBreadcrumbsPosition
 * @variant header в заголовке таблицы
 * @variant top над списком
 * @variant undefined не отображаются
 */

export type TBreadcrumbsPosition = 'header' | 'top' | undefined;

/**
 * Возможные расположения кнопки "Назад" в explorer
 * @typedef Controls/_explorer/utils/TBackButtonPosition
 * @variant results в строке итогов
 * @variant header в заголовке таблицы
 * @variant top над списком
 * @variant undefined не отображаются
 */
export type TBackButtonPosition = TBreadcrumbsPosition | 'results';

// Конфигурация layout хлебных крошек в explorer
export interface IBreadcrumbsLayout {
    // Расположение кнопки "Назад"
    backButtonPosition: TBackButtonPosition;
    // Расположение хлебных крошек
    breadcrumbsPosition: TBreadcrumbsPosition;
}

/**
 * На основании опций explorer и его данных вычисляет какой вариант размещения хлебных крошек использовать
 */
export function calculateBreadcrumbsLayout(
    options: Partial<IExplorerOptions>,
    items: RecordSet
): IBreadcrumbsLayout {
    if (options.breadcrumbsVisibility === 'hidden') {
        return {
            backButtonPosition: undefined,
            breadcrumbsPosition: undefined,
        };
    }

    const layout: IBreadcrumbsLayout = {
        backButtonPosition: 'top',
        breadcrumbsPosition: 'top',
    };

    // Если режим отображения не таблица, то крошки всегда над списком
    if (options.viewMode !== 'table') {
        return layout;
    }

    // true если мы можем использовать первую ячейку заголовка для наших нужд
    const canUseHeader =
        // первая ячейка заголовка пустая
        firstHeaderCellIsEmpty(options.header) &&
        // шапка видна
        (options.headerVisibility === 'visible' ||
            (options.headerVisibility === 'hasdata' && items && items.getCount()));
    if (canUseHeader) {
        layout.backButtonPosition = 'header';
        layout.breadcrumbsPosition = 'header';
    }

    const firstCol = options.columns && options.columns[0];
    const results = items && items.getMetaData().results;

    // Результаты видны в том случае, если resultsVisibility === 'visible'
    let resultsVisible = options.resultsVisibility === 'visible';

    // Если options.resultsVisibility === 'hasdata', то проверяем количество записей в рекордсете
    if (options.resultsVisibility === 'hasdata' && items) {
        const rootItemsIndices = items.getIndicesByValue(options.parentProperty, options.root);

        if (rootItemsIndices.length === 1) {
            const rootItemParent = items.at(rootItemsIndices[0]).get(options.nodeProperty);

            // Если в корне одна запись и это узел в виде группы, то показываем результаты, если в узле > 1 записи.
            if (rootItemParent === NODE_TYPE_PROPERTY_GROUP) {
                resultsVisible =
                    items.getIndicesByValue(options.parentProperty, rootItemParent).length > 1;
            }
        } else {
            // Если записей в корне > 1, то показываем результаты
            resultsVisible = rootItemsIndices.length > 1;
        }
    }

    const canUseResults =
        // есть первая колонка
        firstCol &&
        // не задан кастомный шаблон строки итогов
        !options.resultsTemplate &&
        // у первой колонки не задан кастомный шаблон результатов
        !firstCol.resultTemplate &&
        // строка итогов отображается сверху
        options.resultsPosition === 'top' &&
        // нет результатов для первой колонки
        results &&
        !results.get(firstCol.displayProperty) &&
        // строка итогов видна
        resultsVisible;
    if (canUseResults) {
        layout.backButtonPosition = 'results';
    }

    // Если сказали что видна только кнопка "Назад", то убираем крошки из макета
    if (options.breadcrumbsVisibility === 'onlyBackButton') {
        layout.breadcrumbsPosition = undefined;
    }

    return layout;
}
