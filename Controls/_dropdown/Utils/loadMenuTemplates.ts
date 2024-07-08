/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { TemplateFunction } from 'UI/Base';
import { loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';

interface IMenuTemplates {
    headerTemplate?: TemplateFunction | string;
    itemTemplate?: TemplateFunction | string;
    footerContentTemplate?: TemplateFunction | string;
}

const TEMPLATES = [
    'headTemplate',
    'headerTemplate',
    'headerContentTemplate',
    'itemTemplate',
    'groupTemplate',
    'footerContentTemplate',
    'nodeFooterTemplate',
    'emptyTemplate',
    'showMoreRightTemplate',
];

function getItemsTemplates(items: RecordSet, itemTemplateProperty: string) {
    const templates = {};

    if (itemTemplateProperty) {
        items.each((item) => {
            const itemTemplate = item.get(itemTemplateProperty);

            if (typeof itemTemplate === 'string' && itemTemplate) {
                templates[itemTemplate] = true;
            }
        });
    }

    return Object.keys(templates);
}

export function loadItemsTemplates(
    items: RecordSet,
    itemTemplateProperty: string
): Promise<unknown> {
    const templatesToLoad = getItemsTemplates(items, itemTemplateProperty);
    return Promise.all(
        templatesToLoad.map((template) => {
            return loadAsync(template);
        })
    );
}

export default function loadMenuTemplates(
    menuTemplates: IMenuTemplates,
    theme: string
): Promise<void> {
    const loadMenuPromises = [loadAsync('Controls/menu')];

    if (menuTemplates.parentProperty) {
        loadMenuPromises.push(loadAsync('Controls/tree'));
    }

    TEMPLATES.forEach((template) => {
        if (typeof menuTemplates[template] === 'string' && !isLoaded(menuTemplates[template])) {
            loadMenuPromises.push(loadAsync(menuTemplates[template]));
        }
    });
    return Promise.all(loadMenuPromises)
        .then((loadedDeps) => {
            return loadedDeps[0].Control.loadCSS(theme);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
