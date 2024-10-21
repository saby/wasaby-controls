/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as rk from 'i18n!Controls';
import { TemplateFunction } from 'UICommon/base';
import { IIndicatorProps } from './WrapperIndicatorsTemplate';
import * as React from 'react';

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

interface IContinueSearchTemplateProps extends IIndicatorProps {
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
}

export default function ContinueSearchTemplate(props: IContinueSearchTemplateProps): JSX.Element {
    const footer = props.footerTemplate && (
        <div className="controls-BaseControl__continueSearch_footerTemplate">
            {typeof props.footerTemplate === 'function' && (
                <props.footerTemplate item={props?.item} />
            )}
            {typeof props.footerTemplate === 'object' &&
                React.cloneElement(props.footerTemplate, {
                    ...props.footerTemplate.props,
                    item: props?.item,
                })}
            {typeof props.footerTemplate !== 'object' && typeof props.footerTemplate !== 'function'
                ? props.footerTemplate
                : ''}
        </div>
    );

    return (
        <div className="controls-BaseControl__continueSearch_content controls-BaseControl__loadingIndicator-content ws-inline-flexbox ws-align-items-center">
            <div className="controls-BaseControl__continueSearch_icon controls-icon icon-Search2 controls-icon_size-m" />
            <div className="ws-flexbox ws-flex-column">
                <div className="js-controls-BaseControl__continueSearch controls-BaseControl__continueSearch_caption">
                    {rk('Продолжить поиск')}
                </div>
                {footer}
            </div>
        </div>
    );
}
