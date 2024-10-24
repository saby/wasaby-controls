/**
 * @kaizen_zone 2b102d0c-fd4d-4044-be66-780184ba4e71
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Button } from 'Controls/buttons';
import { INavigationButtonConfig } from 'Controls/interface';
import ShowMoreButton from 'Controls/ShowMoreButton';

import rk = require('i18n!Controls');

interface IClickHandler {
    onClick?: () => void;
}

interface ISeparatorProps extends IClickHandler {
    buttonConfig: INavigationButtonConfig;
    value?: string;
}

interface IButtonProps extends IClickHandler {
    linkFontSize: string;
    linkFontColorStyle: string;
    loadMoreCaption: string;
    linkLabel?: string;
    linkClass?: string;
}

interface IProps extends ISeparatorProps, IButtonProps, TInternalProps {
    buttonView: 'separator' | 'link';
    readOnly: boolean;
}

export const JS_SELECTOR = 'js-controls-BaseControl__NavigationButton';
const DATA_QA = 'navigation-button';

function NavigationButton(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    if (props.buttonView === 'separator') {
        const buttonPosition = props.buttonConfig?.buttonPosition ?? 'center';
        const size = props.buttonConfig?.size ?? 'm';
        const className =
            'controls-BaseControl__cut ws-flexbox ws-flex-grow-1' +
            ` ws-justify-content-${buttonPosition}` +
            ` controls-BaseControl__cut-container_${size}`;

        return (
            <div className={className}>
                <ShowMoreButton
                    className={JS_SELECTOR}
                    value={props.value}
                    iconSize={size}
                    readOnly={props.readOnly}
                    contrastBackground={
                        !props.buttonConfig || props.buttonConfig.contrastBackground !== false
                    }
                    onClick={() => {
                        props.onClick?.();
                    }}
                    attrs={{
                        'data-qa': DATA_QA,
                    }}
                />
            </div>
        );
    }
    return (
        <Button
            className={
                JS_SELECTOR +
                (props.linkClass ? ` ${props.linkClass}` : '') +
                (props.linkFontColorStyle === 'listMore'
                    ? ' controls-BaseControls_navButton-listMore-style'
                    : '')
            }
            data-qa={DATA_QA}
            viewMode={'link'}
            fontSize={props.linkFontSize}
            fontColorStyle={props.linkFontColorStyle}
            caption={props.loadMoreCaption || rk('Еще') + ' ' + (props.linkLabel || '...')}
            readOnly={props.readOnly}
            onClick={() => {
                props.onClick?.();
            }}
        />
    );
}

const NavigationButtonref = React.forwardRef(NavigationButton);
NavigationButtonref.defaultProps = {
    readOnly: false,
};
export default NavigationButtonref;

/**
 * Кнопка подгрузки данных, отображаемая в подвале сайта или подвале узла дерева при навигации по запросу
 * @class Controls/list:MoreButtonTemplate
 * @public
 * @autor Аваеркиев П.А.
 */

/**
 * @name Controls/list:MoreButtonTemplate#buttonView
 * @cfg {Controls/interface:INavigation/TNavigationButtonView.typedef} Вид кнопки подгрузки данных
 * @default link
 * @see buttonConfig
 */

/**
 * @name Controls/list:MoreButtonTemplate#buttonConfig
 * @cfg {Controls/interface:INavigation/INavigationButtonConfig} Настройки кнопки подгрузки данных
 * @see buttonView
 */

/**
 * @name Controls/list:MoreButtonTemplate#readOnly
 * @cfg {boolean} Флаг, позволяющий сделать кнопку некликабельной.
 * @default false
 */
