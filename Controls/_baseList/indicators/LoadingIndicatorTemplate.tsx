/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { IIndicatorProps } from './WrapperIndicatorsTemplate';
import * as React from 'react';
import { TemplateFunction } from 'UICommon/base';

/**
 * Шаблон, который по умолчанию используется для отображения индикатора загрузки в списочных контролах.
 *
 * @class Controls/_baseList/indicators/LoadingIndicatorTemplate
 * @public
 * @demo Controls-demo/list_new/LoadingIndicator/Global/Index
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
    message?: TemplateFunction | React.Component | string;
}

export default function LoadingIndicatorTemplate(
    props: ILoadingIndicatorTemplateProps
): JSX.Element {
    const message = props.message && (
        <div className={'controls-BaseControl__loadingIndicator-message'}>
            {typeof props.message === 'function' && <props.message item={props?.item} />}
            {typeof props.message === 'object' &&
                React.cloneElement(props.message, { ...props.message.props, item: props?.item })}
            {typeof props.message !== 'object' && typeof props.message !== 'function'
                ? props.message
                : ''}
        </div>
    );
    return (
        <div className={'controls-BaseControl__loadingIndicator-content'}>
            <div className={'controls-BaseControl__loadingIndicatorImage'} />
            {message}
        </div>
    );
}
