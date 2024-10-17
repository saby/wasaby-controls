/**
 * @kaizen_zone 6b2f7c09-87a5-4183-bd7c-59117d2711bc
 */
import { IControlProps } from 'Controls/interface';
import { TInternalProps } from 'UICore/Executor';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import * as React from 'react';

interface ISwitchableAreaTemplateOptions extends TInternalProps, IControlProps {
    className?: string;
    content: React.ReactElement;
}

/**
 * Основной шаблон для элемента
 * @class Controls/_switchableArea/SwitchableAreaItemTemplate
 * @implements Controls/interface:IControl
 * @private
 */
export default React.forwardRef(function SwitchableAreaItemTemplate(
    props: ISwitchableAreaTemplateOptions,
    _
): React.ReactElement<ISwitchableAreaTemplateOptions, string> {
    React.useEffect(() => {
        if (props.onAfterMount) {
            props.onAfterMount();
        }
    }, []);

    const getAttrClass = () => {
        if (props.attrs?.className) {
            return props.attrs.className;
        } else if (props.className) {
            return props.className;
        }
    };

    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return <props.content {...attrs} {...props} className={getAttrClass()} />;
});
