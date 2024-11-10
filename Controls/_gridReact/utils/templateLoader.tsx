/*
 * Файл содержит функцию, которая необходима для обратной совместимости с wasaby.
 * Если прикладной разработчик использует опции, принимающие шаблон васаби, то этот метод
 * позволяет импортировать шаблон как реакт компонент.
 */

import * as React from 'react';
import { loadSync } from 'WasabyLoader/ModulesLoader';

type RefObject = { render: Function };
type MemoRefObject = { type: RefObject };

export function templateLoader(
    template: string | Function | RefObject | MemoRefObject,
    templateProps?: object
): React.ReactNode | null {
    const attrs = templateProps?.attrs || {};
    if (typeof template === 'string') {
        const TemplateComponent = loadSync(template);
        return <TemplateComponent {...templateProps} attrs={attrs} />;
    }
    // Если в grid в wasaby-стиле указать шаблон записи/колонки из реакта, бывает два кейса:
    // 1. В шаблон придёт объект ForwardRef с type и render
    // 2. В шаблон придёт объект Memo, в котором будет поле type, в котором уже объект ForwardRef с type и render.
    // Если указан partial через wasaby-шаблон, то в template придёт просто функция.
    // Реакт умеет рендерить все три варианта.
    if (
        typeof template === 'function' ||
        (typeof template === 'object' &&
            ((template as RefObject).render !== undefined ||
                (template as MemoRefObject).type?.render !== undefined))
    ) {
        const TemplateComponent = template;
        return <TemplateComponent {...templateProps} attrs={attrs} />;
    }

    // Если в шаблоне лежит готовый реакт-элемент, то просто его возвращаем
    if (React.isValidElement(template)) {
        return template;
    }

    return null;
}
