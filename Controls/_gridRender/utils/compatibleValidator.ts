import { executeSyncOrAsync } from 'UI/Deps';
import * as React from 'react';

type TemplateNameType =
    | 'GridItemTemplate'
    | 'TreeGridItemTemplate'
    | 'ColumnTemplate'
    | 'HeaderContent'
    | 'ResultColumnTemplate'
    | 'ResultsTemplate'
    | 'FooterColumnTemplate'
    | 'FooterTemplate'
    | 'GroupTemplate'
    | 'EmptyColumnTemplate'
    | 'EmptyTemplate'
    | 'NodeFooterTemplate'
    | 'ItemEditorTemplate';

interface ICompatibleCallValidator {
    receivedScope: boolean;
    expectedTemplates: TemplateNameType[] | null;
}

const CHK_TM = 0;

// Метод создания ключа (вызывается перед вызовом templateLoader)
function initValidator(): ICompatibleCallValidator {
    return { receivedScope: false, expectedTemplates: null };
}

// Метод изменения ключа и проверки скоупа (вызывается внутри compatible)
function validate(
    compatibleCallValidator: ICompatibleCallValidator,
    currentTemplate: TemplateNameType,
    expectedTemplates: TemplateNameType[]
) {
    if (compatibleCallValidator || currentTemplate) {
        compatibleCallValidator.receivedScope = true;
        if (!expectedTemplates.some((el) => el === currentTemplate)) {
            compatibleCallValidator.expectedTemplates = expectedTemplates;
        }
    }
    return;
}

// Метод, который возвращает функцию для генерации ошибки, если ожидаемый шаблон не был вызван
// или если не был прокинут scope
function getCheckValidator(container: React.MutableRefObject<HTMLDivElement>) {
    return (
        compatibleCallValidator: ICompatibleCallValidator,
        currentTemplate: TemplateNameType,
        columnIndex?: number
    ) => {
        return setTimeout(() => {
            if (compatibleCallValidator.receivedScope === false) {
                // ошибка скоупа
                executeSyncOrAsync(['Controls/listErrors'], (errs) =>
                    errs.ScopeError(container.current, currentTemplate, columnIndex)
                );
                return;
            }
            if (compatibleCallValidator.expectedTemplates) {
                // ошибка шаблона
                executeSyncOrAsync(['Controls/listErrors'], (errs) =>
                    errs.TemplateError(container.current, currentTemplate, columnIndex)
                );
            }
        }, CHK_TM);
    };
}

function getRenderBoundaryError(container: React.MutableRefObject<HTMLDivElement>) {
    executeSyncOrAsync(['Controls/listErrors'], (errs) =>
        errs.RenderBoundaryError(container?.current)
    );
}

export { initValidator, validate, getCheckValidator, getRenderBoundaryError, TemplateNameType };
