import * as rk from 'i18n!Controls';
import { TemplateFunction } from 'UICommon/base';
import { IIndicatorProps } from './WrapperIndicatorsTemplate';
import * as React from 'react';

/**
 * Шаблон, который по умолчанию используется для отображения индикатора порционной загрузки в списочных контролах.
 *
 * @class Controls/_baseList/indicators/IterativeLoadingTemplate
 * @public
 * @see Controls/list
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:iterativeLoadingTemplate>
 *         <ws:partial template="Controls/list:IterativeLoadingTemplate"
 *                      scope="{{iterativeLoadingTemplate}}">
 *             <ws:footerTemplate>
 *                 <div>Дополнительная информация</div>
 *             </ws:footerTemplate>
 *         </ws:partial>
 *     </ws:iterativeLoadingTemplate>
 * </Controls.list:View>
 * </pre>
 */

interface IIterativeLoadingTemplateProps extends IIndicatorProps {
    /**
     * @cfg {TemplateFunction|React.Component|undefined} Пользовательский шаблон, описывающий подвал индикатора.
     * @example
     * <pre class="brush: html; highlight: [6-8]">
     * <!-- WML -->
     * <Controls.list:View source="{{_viewSource}}">
     *    <ws:iterativeLoadingTemplate>
     *       <ws:partial template="Controls/list:IterativeLoadingTemplate"
     *                   scope="{{iterativeLoadingTemplate}}">
     *          <ws:footerTemplate>
     *              <div>Дополнительная информация при поиске/div>
     *          </ws:footerTemplate>
     *       </ws:partial>
     *    </ws:iterativeLoadingTemplate>
     * </Controls.list:View>
     * </pre>
     */
    footerTemplate: TemplateFunction | React.Component;
}

export default function IterativeLoadingTemplate(
    props: IIterativeLoadingTemplateProps
): JSX.Element {
    const footer = props.footerTemplate && (
        <div className="controls-BaseControl__portionedSearch-footerTemplate">
            <props.footerTemplate item={props.item} />
        </div>
    );

    return (
        <div className="controls-BaseControl__loadingIndicator-content controls-BaseControl__portionedSearch-content">
            <div className="controls-BaseControl__loadingIndicatorImage" />
            <div className="ws-flexbox ws-flex-column">
                <div className="js-controls-BaseControl__abortSearch controls-BaseControl__abortSearch">
                    {rk('Прервать поиск')}
                </div>
                {footer}
            </div>
        </div>
    );
}
