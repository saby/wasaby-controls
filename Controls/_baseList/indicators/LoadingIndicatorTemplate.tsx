/**
 * @kaizen_zone 7360ae57-763d-4cb1-9780-8bdc6999c82f
 */
import { IIndicatorProps } from './WrapperIndicatorsTemplate';

/**
 * Шаблон, который по умолчанию используется для отображения индикатора загрузки в списочных контролах.
 *
 * @class Controls/_baseList/indicators/LoadingIndicatorTemplate
 * @public
 * @demo
 * @see Controls/list
 * @example
 * <pre class="brush: html; highlight: [3-10]">
 * <!-- WML -->
 * <Controls.list:View source="{{_viewSource}}">
 *     <ws:loadingIndicatorTemplate>
 *         <ws:partial template="Controls/list:LoadingIndicatorTemplate"
 *                     message={{Загрузка...}}
 *                     scope="{{loadingIndicatorTemplate}}"/>
 *     </ws:loadingIndicatorTemplate>
 * </Controls.list:View>
 * </pre>
 */

export interface ILoadingIndicatorTemplateProps extends IIndicatorProps {
    /**
     * @name Controls/baseList:ILoadingIndicatorTemplateProps#message
     * @cfg String Текст сообщения индикатора.
     * @default undefined
     */
    message?: string;
}

export default function LoadingIndicatorTemplate(
    props: ILoadingIndicatorTemplateProps
): JSX.Element {
    const message = props.message && (
        <div className={'controls-BaseControl__loadingIndicator-message'}>
            {props.message}
        </div>
    );
    return (
        <div className={'controls-BaseControl__loadingIndicator-content'}>
            <div className={'controls-BaseControl__loadingIndicatorImage'} />
            {message}
        </div>
    );
}
