import { ReactElement, FunctionComponent, forwardRef, ForwardedRef } from 'react';
import { lazy, importer } from 'UI/Async';

interface IOrderRuleChooserEditor {
    ['data-qa']: string;
    className: string;
}

const componentName = 'WHD/Widgets/components:OrderRuleChooserEditor';
const LazyComponent = lazy((): FunctionComponent => importer(componentName));

function OrderRuleChooserEditor(
    props: IOrderRuleChooserEditor,
    ref: ForwardedRef<HTMLDivElement>
): ReactElement {
    const { ['data-qa']: dataQa, className } = props;

    return (
        <div ref={ref} data-qa={dataQa} className={className}>
            <LazyComponent {...props} />
        </div>
    );
}

export default forwardRef(OrderRuleChooserEditor);
