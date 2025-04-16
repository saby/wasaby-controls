/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as rk from 'i18n!Controls';
import { TemplateFunction } from 'UI/Base';
import { IIndicatorProps } from './WrapperIndicatorsTemplate';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { isComponentClass, isForwardRef } from 'UICore/Executor';

/**
 * Шаблон, который по умолчанию используется для отображения кнопки Продолжить поиск во время остановки порционной загрузки в списочных контролах.
 *
 * @class Controls/_baseList/indicators/ContinueSearchTemplate
 * @public
 * @see Controls/list
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:continueSearchTemplate>
 *         <ws:partial template="Controls/list:ContinueSearchTemplate"
 *                      scope="{{continueSearchTemplate}}">
 *             <ws:footerTemplate>
 *                 <div>Дополнительная информация</div>
 *             </ws:footerTemplate>
 *         </ws:partial>
 *     </ws:continueSearchTemplate>
 * </Controls.list:View>
 * </pre>
 */

export interface IContinueSearchTemplateProps extends IIndicatorProps {
    /**
     * @cfg {TemplateFunction|React.Component|undefined} Пользовательский шаблон, описывающий подвал индикатора.
     * @example
     * <pre class="brush: html; highlight: [6-8]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:continueSearchTemplate>
     *       <ws:partial template="Controls/list:ContinueSearchTemplate"
     *                   scope="{{continueSearchTemplate}}">
     *          <ws:footerTemplate>
     *              <div>Дополнительная информация при поиске/div>
     *          </ws:footerTemplate>
     *       </ws:partial>
     *    </ws:continueSearchTemplate>
     * </Controls.list:View>
     * </pre>
     */
    footerTemplate?: TemplateFunction | React.Component;
    /**
     * @cfg {string|undefined} Текст кнопки, значение по дефолту: "Продолжить поиск".
     * @example
     * <pre class="brush: html; highlight: [6]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:continueSearchTemplate>
     *       <ws:partial template="Controls/list:ContinueSearchTemplate"
     *                   scope="{{continueSearchTemplate}}"
     *                   continueSearchCaption="Возобновить поиск">
     *          <ws:footerTemplate>
     *              <div>Дополнительная информация при поиске/div>
     *          </ws:footerTemplate>
     *       </ws:partial>
     *    </ws:continueSearchTemplate>
     * </Controls.list:View>
     * </pre>
     */
    continueSearchCaption?: string;

    message?: string;

    positionHint?: TemplateFunction | React.Component;
    details?: TemplateFunction | React.Component;
}

function useContentTemplate(
    ContentTemplate: TemplateFunction | React.ComponentType | string | React.ReactElement,
    item: IIndicatorProps['item']
) {
    const contentTemplate = React.useMemo(() => {
        if (!ContentTemplate) {
            return;
        }
        if (
            typeof ContentTemplate === 'function' ||
            isComponentClass(ContentTemplate) ||
            isForwardRef(ContentTemplate)
        ) {
            return <ContentTemplate item={item} />;
        }
        if (typeof ContentTemplate === 'object') {
            return React.cloneElement(ContentTemplate, { item });
        }
        return ContentTemplate;
    }, [ContentTemplate, item]);
    return contentTemplate;
}

export default function ContinueSearchTemplate(props: IContinueSearchTemplateProps): JSX.Element {
    const positionHint = useContentTemplate(props.positionHint || props.footerTemplate, props.item);
    const details = useContentTemplate(props.details, props.item);
    const message = props.message ?? 'Пока не найдено';
    const continueSearchCaption = props.continueSearchCaption ?? 'Продолжить поиск';

    return (
        <div
            className="controls-BaseControl__search-content controls-BaseControl__loadingIndicator-content tw-inline-flex tw-items-center"
            data-qa="continue-search"
        >
            <div className="tw-flex tw-flex-col">
                {positionHint && (
                    <div className="controls-BaseControl__continueSearch_positionHint">
                        {positionHint}
                    </div>
                )}
                {message && (
                    <div className="controls-BaseControl__continueSearch_positionHint">
                        {rk(props.message ?? 'Пока не найдено')}
                    </div>
                )}
                {continueSearchCaption && (
                    <Button
                        className="js-controls-BaseControl__continueSearch controls-BaseControl__continueSearch_caption"
                        caption={rk(props.continueSearchCaption ?? 'Продолжить поиск')}
                        fontColorStyle="link"
                        fontSize="xl"
                        inlineHeight="xl"
                        viewMode="outlined"
                        buttonStyle="pale"
                        icon="icon-Search3"
                        iconSize="m"
                        iconStyle="brand"
                    />
                )}
                {details && (
                    <div className="controls-BaseControl__continueSearch_details">{details}</div>
                )}
            </div>
        </div>
    );
}
