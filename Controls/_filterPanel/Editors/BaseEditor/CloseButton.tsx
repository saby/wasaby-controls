import { useCallback, ReactElement } from 'react';
import { SyntheticEvent } from 'UICommon/Events';
import { isEqual } from 'Types/object';
import { Icon } from 'Controls/icon';
import rk = require('i18n!Controls');
import { IBaseEditor } from 'Controls/_filterPanel/BaseEditor';
import { logger } from 'Application/Env';
import { useAdaptiveMode } from 'UI/Adaptive';

export default function CloseButtonTemplate(props: IBaseEditor): ReactElement | null {
    const isAdaptive = useAdaptiveMode().device.isPhone();
    const handleCloseEditorClick = useCallback(
        (event: SyntheticEvent) => {
            const extendedValue = {
                value: props.resetValue,
                textValue: '',
                viewMode: props.extendedCaption ? 'extended' : 'basic',
            };

            event.stopPropagation();
            (props.onResetClick || props.onResetclick)?.(event);
            if (!props.onPropertyValueChanged) {
                logger.error(
                    `Controls/filterPanel:BaseEditor: Не задан обработчик клика по крестику сброса в редакторе фильтра.
                 Подпишитесь на событие propertyValueChanged, которое вызывается при клике на крестик и спроксируйте его выше`
                );
            }
            if (props.onPropertyValueChanged) {
                props.onPropertyValueChanged(event, extendedValue);
            }
        },
        [props.resetValue, props.extendedCaption]
    );

    const closeButtonVisible = !(
        props.closeButtonVisible === false ||
        (isEqual(props.propertyValue, props.resetValue) && !props.extendedCaption) ||
        props.resetValue === undefined
    );
    if (closeButtonVisible) {
        return (
            <div
                className={
                    'controls-FilterViewPanel__baseEditor-cross_container' +
                    (isAdaptive
                        ? ' controls-FilterViewPanel__baseEditor-cross_container_adaptive'
                        : '')
                }
            >
                <Icon
                    icon="icon-CloseNew"
                    tooltip={rk('Сбросить')}
                    iconSize={'FilterGroupIcon'}
                    className="controls-FilterViewPanel__groupReset-icon"
                    onClick={handleCloseEditorClick}
                    dataQa="FilterViewPanel__baseEditor-cross"
                />
            </div>
        );
    }
    return null;
}
