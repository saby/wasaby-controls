/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Утилита для получения конфигурации крошек и кнопки назад по RecordSet'e
 * @class Controls/_dataSource/calculatePath
 * @public
 */

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';

export type Path = null | Model[];

interface IPathResult {
    path: Path;
    pathWithoutItemForBackButton: Path;
    backButtonCaption: string | null;
    backButtonItem: Model;
}

function getPath(data: RecordSet | Path): Path {
    const path = data instanceof RecordSet && data.getMetaData().path;
    let breadCrumbs = null;

    if (path && path.getCount() > 0) {
        breadCrumbs = factory(path).toArray();
    } else if (Array.isArray(data)) {
        breadCrumbs = data;
    }

    return breadCrumbs;
}

function getBackButtonCaption(path: Path, displayProperty?: string): string {
    let caption = '';

    if (path && path.length >= 1 && displayProperty) {
        caption = path[path.length - 1].get(displayProperty);
    }

    return caption;
}

function getBackButtonItem(path: Path): Model {
    let item;

    if (path && path.length >= 1) {
        item = path[path.length - 1];
    }

    return item;
}

function getPathWithoutItemForBackButton(breadCrumbs: Path): Path {
    let breadCrumbsWithoutItemForBackButton = null;

    if (breadCrumbs && breadCrumbs.length > 1) {
        breadCrumbsWithoutItemForBackButton = breadCrumbs.slice(
            0,
            breadCrumbs.length - 1
        );
    }

    return breadCrumbsWithoutItemForBackButton;
}

/**
 * @typedef {Object} Controls/_dataSource/calculatePath/ICalculatedPath
 * @description Возвращаемое значение
 * @property {Array|Types/collection:RecordSet} path
 * @property {Array<Types/entity:Model>} pathWithoutItemForBackButton
 * @property {Types/entity:Model} backButtonItem
 * @property {string} backButtonCaption
 */

/**
 * Получить конфигурацию для отображения крошек и кнопки назад по переданному RecordSet'у
 * @function Controls/_dataSource/calculatePath#getCalculatedFilter
 * @param {Types/collection:RecordSet} data
 * @param {String} displayProperty
 * @returns Controls/Utils/getCalculatedFilter/ICalculatedFilter.typedef
 */
export default function calculatePath(
    data: RecordSet | Path,
    displayProperty?: string
): IPathResult {
    const path = getPath(data);

    return {
        path,
        pathWithoutItemForBackButton: getPathWithoutItemForBackButton(path),
        backButtonItem: getBackButtonItem(path),
        backButtonCaption: getBackButtonCaption(path, displayProperty),
    };
}
