/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';
import { IControlProps, ICaptionOptions } from 'Controls/interface';
import rk = require('i18n!Controls');
import 'css!Controls/search';

/**
 * Контрол, отображающий подсказку, если в запросе при поиске найдена и исправлена опечатка.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ руководство разработчика по классификации контролов Wasaby и схеме их взаимодействия}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/change-layout/ Поиск со сменой раскладки}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_search.less переменные тем оформления}
 *
 * @implements Controls/interface:ICaption
 * @extends UI/Base:Control
 *
 * @public
 */
/*
 * //TODO KONGO A control that displays a tooltip if misspell was in search text was found.
 *
 * @implements Controls/interface:ICaption
 * @extends UI/Base:Control
 *
 * @public
 * @author Крайнов Д.О.
 */

interface IMisspellOptions extends TInternalProps, IControlProps, ICaptionOptions {}

const isDOMTypeElement = (element) => {
    return React.isValidElement(element) || typeof element === 'string';
};

export default React.forwardRef(function Misspell(
    props: IMisspellOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<IMisspellOptions, string> {
    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    const style = attrs.style || props.style;

    return (
        <div
            {...attrs}
            style={style}
            data-qa={attrs['data-qa'] || props['data-qa']}
            className={`controls_search_theme-${props.theme} controls-Misspell controls-Misspell ${attrs.className} ${props.className}`}
            ref={ref}
        >
            <span className="controls-Misspell__text">{rk('Возможно, вы имели в виду')} </span>
            <div className="controls-Misspell__caption">
                <div
                    className="controls-Misspell__caption-content"
                    data-qa="Misspell__caption-content"
                >
                    {isDOMTypeElement(props.caption) ? props.caption : <props.caption />}
                </div>
            </div>
        </div>
    );
});
