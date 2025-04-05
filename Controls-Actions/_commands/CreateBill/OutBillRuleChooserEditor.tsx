import { ReactElement, FunctionComponent, forwardRef, ForwardedRef } from 'react';
import { lazy, importer } from 'UI/Async';

interface IOutBillRuleChooserEditor {
    ['data-qa']: string;
    className: string;
}

const componentName = 'WHD/Widgets/components:OutBillRuleChooserEditor';
const LazyComponent = lazy((): FunctionComponent => importer(componentName));

function OutBillRuleChooserEditor(
    props: IOutBillRuleChooserEditor,
    ref: ForwardedRef<HTMLDivElement>
): ReactElement {
    const { ['data-qa']: dataQa, className } = props;

    return (
        <div ref={ref} data-qa={dataQa} className={className}>
            <LazyComponent {...props} />
        </div>
    );
}

export default forwardRef(OutBillRuleChooserEditor);
