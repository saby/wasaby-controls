import { TemplateNameType } from 'Controls/gridRender';
import { Logger } from 'UI/Utils';

enum placesToUseTemplate {
    'GridItemTemplate' = 'grid/itemTemplate',
    'TreeGridItemTemplate' = 'treeGrid/itemTemplate',
    'ColumnTemplate' = 'columns[...].template',
    'HeaderContent' = 'header[...].template',
    'ResultColumnTemplate' = 'columns[...].resultTemplate',
    'ResultsTemplate' = 'resultsTemplate',
    'FooterColumnTemplate' = 'footer[...].template',
    'FooterTemplate' = 'footerTemplate',
    'GroupTemplate' = 'groupTemplate',
    'EmptyColumnTemplate' = 'emptyTemplateColumns[...].template',
    'EmptyTemplate' = 'emptyTemplate',
    'NodeFooterTemplate' = 'nodeFooterTemplate',
    'ItemEditorTemplate' = 'itemEditorTemplate',
}

// Метод проверки свой-ва ICompatibleCallValidator на то, поячеечное это свой-во или нет
function checkIsCellTemplate(currentTemplate: TemplateNameType) {
    return (
        currentTemplate === 'ColumnTemplate' ||
        currentTemplate === 'HeaderContent' ||
        currentTemplate === 'ResultColumnTemplate' ||
        currentTemplate === 'FooterColumnTemplate' ||
        currentTemplate === 'EmptyColumnTemplate'
    );
}

function ScopeError(
    container: HTMLDivElement,
    expectedTemplates: TemplateNameType,
    columnIndex?: number
) {
    return Logger.error(
        `Не прокинут scope, либо не вызван платформенный шаблон в шаблоне ${placesToUseTemplate[expectedTemplates]} ` +
            `${
                checkIsCellTemplate(expectedTemplates) && columnIndex !== undefined
                    ? `на ${columnIndex + 1} колонке `
                    : ''
            }\n` +
            'См. новость (пункт 2): https://online.sbis.ru/news/68781645-34b0-4046-a51d-6fdf96b6d899',
        container
    );
}

function TemplateError(
    container: HTMLDivElement,
    currentTemplate: TemplateNameType,
    columnIndex?: number
) {
    return Logger.error(
        `Вызван неправильный шаблон в опции ${placesToUseTemplate[currentTemplate]}` +
            `${
                checkIsCellTemplate(currentTemplate) && columnIndex !== undefined
                    ? ` на ${columnIndex + 1} колонке\n`
                    : '\n'
            }` +
            'Это может происходить в следущих случаях:\n' +
            '1) Не вызван платформенный шаблон \n' +
            '2) Вызван платформенный шаблон, но не тот, который ожидался \n' +
            'См. новость (пункт 1): https://online.sbis.ru/news/68781645-34b0-4046-a51d-6fdf96b6d899\n' +
            'Если выше в консоли ошибка, что не прокинут scope в шаблоне, то эту ошибку проигнорировать!',
        container
    );
}

function RenderBoundaryError(container: HTMLDivElement) {
    return Logger.error('Шаблон GridReactRowComponent рендерится за пределами grid', container);
}

export { ScopeError, TemplateError, RenderBoundaryError };
