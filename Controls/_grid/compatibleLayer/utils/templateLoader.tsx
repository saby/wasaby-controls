/*
 * Файл содержит функцию, которая необходима для обратной совместимости с wasaby.
 * Если прикладной разработчик использует опции, принимающие шаблон васаби, то этот метод
 * позволяет импортировать шаблон как реакт компонент.
 */

import * as React from 'react';
import { loadSync, isLoaded as isModuleLoaded } from 'WasabyLoader/ModulesLoader';
import { ModulesManager } from 'RequireJsLoader/conduct';
import { isReactComponentType } from 'UICore/Executor';

type RefObject = { render: Function };
type MemoRefObject = { type: RefObject };

/*
 * Универсальный загрузчик-рендерер шаблонов.
 * Умеет сам определять, каким образом нужно загрузть шаблон.
 * Поддерживает
 * * Загрузку и рендер строки с путём к шаблону
 * * Рендер шаблона, сгенерированного из WML <ws:partial />
 * * Рендер шаблона, переданного как forwardedRef (+memo) в контентную опцию
 * * Рендер шаблона, переданного как чистый React элемент (+memo)
 * * Рендер шаблона, переданного как HTML нода / children
 * Используется в основном для режима совместимости ,когда мы точно не знаем, в каком виде передан шаблон
 * @param template
 * @param templateProps
 */
export function templateLoader(
    template: string | Function | RefObject | MemoRefObject,
    templateProps?: Record<string, unknown>
): React.ReactNode | null {
    const attrs = templateProps?.attrs || {};
    const templateKey = (
        templateProps && templateProps.hasOwnProperty('key')
            ? templateProps.key
            : 'grid_default_key'
    ) as React.Key;

    if (typeof template === 'string') {
        if (ModulesManager.isModule(template) && isModuleLoaded(template)) {
            const TemplateComponent = loadSync(template);
            return <TemplateComponent {...templateProps} attrs={attrs} key={templateKey} />;
        } else {
            return template;
        }
    }
    // Если в grid в wasaby-стиле указать шаблон записи/колонки из реакта, бывает три кейса:
    // 1.Если указан partial через wasaby-шаблон, то в template придёт просто функция.
    // 2. В шаблон придёт объект ForwardRef с type и render
    // 3. В шаблон придёт объект Memo, в котором будет поле type, в котором уже объект ForwardRef с type и render.
    // Реакт умеет рендерить все три варианта.
    if (typeof template === 'function' || isReactComponentType(template)) {
        const TemplateComponent = template as React.FunctionComponent;
        return <TemplateComponent {...templateProps} attrs={attrs} key={templateKey} />;
    }

    if (React.isValidElement(template)) {
        // В конце пытаемся орендерить "валидный" реакт-элемент
        if (isReactComponentType(template.type)) {
            // Если в шаблоне лежит готовый реакт-элемент, то возвращаем его, передав опции.
            return React.cloneElement(template, {
                ...templateProps,
                attrs,
                key: templateKey,
            });
        }
        // Сюда попадём, если прикладник передал без обёртки forwardRef свой html шаблон.
        // При такой структуре contentTemplate={React.useMemo(() => { return <div>never do like this</div> }, [])}
        // нельзя прокидывать все пропсы на шаблон, т.к. будет попытка повесить их
        // как атрибуты HTML элемента, а в консоли будет простыня ошибок.
        return React.cloneElement(template, {
            attrs,
            style: templateProps?.style,
            className: templateProps?.className,
            key: templateKey,
        });
    }

    // Фикс случая, когда в качестве шаблона передали wml-контрол.
    // В таком случае шаблон приходит в виде объекта с единственным полем "default" и для рендера нужно использовать его.
    // По идее не поддерживать бы такое, но мест слишком много, примеры:
    // https://online.sbis.ru/opendoc.html?guid=1fd29a15-abca-4dfc-8b7b-b2db61fd8287
    // https://online.sbis.ru/opendoc.html?guid=d0665387-1134-48e3-bbc6-0ba94c1a313c
    // https://online.sbis.ru/opendoc.html?guid=addabbbc-5b60-4724-8e33-743ea07cb41c
    if (template?.default) {
        return templateLoader(template.default, templateProps);
    }

    return null;
}
