import { forwardRef, ForwardedRef, ReactElement } from 'react';
import { IBaseEditor } from 'Controls/_filterPanel/BaseEditor';

export default forwardRef(function getExtendedTemplate(
    props: IBaseEditor,
    ref: ForwardedRef<unknown>
): ReactElement {
    if (props.extendedTemplate) {
        return (
            <props.extendedTemplate
                {...props.extendedTemplateOptions}
                attrs={props.attrs}
                forwardedRef={ref}
                ref={ref}
                propertyValue={props.propertyValue}
                resetValue={props.resetValue}
                extendedCaption={props.extendedCaption}
            />
        );
    } else {
        return (
            <div
                ref={ref}
                {...props.attrs}
                onClick={(event) => {
                    (props.onExtendedCaptionClick || props.onExtendedcaptionclick)?.(event);
                }}
                title={props.extendedCaption || ''}
            >
                {props.extendedCaption || ''}
            </div>
        );
    }
});
