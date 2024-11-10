/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
import * as React from 'react';
import { delimitProps, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { __notifyFromReact } from 'UICore/Events';
import { TInternalProps } from 'UICore/Executor';
import { default as Async } from 'Controls/Container/Async';
import { IControlProps, ICaptionOptions } from 'Controls/interface';

interface IMisspellContainerOptions extends TInternalProps, IControlProps, ICaptionOptions {
    misspellValue?: string;
    task1187611584?: boolean;
    misspellClass?: string;
    onMisspellCaptionClick?: () => void;
}

/**
 * Контрол-контейнер для {@link Controls/listDataOld:ListContainer}, который обеспечивает загрузку и отображение {@link Controls/search:Misspell}, если поиск был произведён в неправильной раскладке.
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/component-kinds/ руководство разработчика по классификации контролов Wasaby и схеме их взаимодействия}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_search.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 *
 * @public
 */

export default React.forwardRef(function MisspellContainer(
    props: IMisspellContainerOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement<IMisspellContainerOptions, string> {
    const linkRef = React.useRef(null);

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    const style = attrs.style;

    const onClick = React.useCallback(() => {
        __notifyFromReact(linkRef.current, 'misspellCaptionClick', [], true);
    }, [props.onMisspellCaptionClick]);

    const { clearProps } = delimitProps(props);

    return (
        <div {...attrs} style={style} data-qa={attrs['data-qa'] || props['data-qa']} ref={linkRef}>
            {!!props.misspellValue && !props.task1187611584 ? (
                <Async
                    className={props.misspellClass}
                    templateName="Controls/search:Misspell"
                    templateOptions={{
                        misspellValue: props.misspellValue,
                        caption: <span onClick={onClick}>{props.misspellValue}</span>,
                    }}
                ></Async>
            ) : null}
            {React.cloneElement(props.children, {
                ...clearProps,
                forwardedRef: ref,
            })}
        </div>
    );
});
