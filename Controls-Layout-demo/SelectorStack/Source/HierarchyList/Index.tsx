import { getArguments } from 'Controls-Layout-demo/SelectorStack/SelectorTemplate/ConfigLoader';
import { ForwardedRef, forwardRef, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import { Selector } from 'Controls/lookup';

export const hierarchyConfig = getArguments({
    multiSelect: true,
    hierarchy: true,
    addButton: true,
});

function SelectorDemo(props: IControlProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const selectorTemplate = {
        templateName: 'Controls-Layout/selectorStack:Stack',
        templateOptions: hierarchyConfig,
        popupOptions: {
            width: 500,
        },
    };

    return (
        <div className={'tw-flex ws-flex-wrap'} ref={ref}>
            <Selector selectorTemplate={selectorTemplate} caption={'Choose'} multiSelect={true} />
        </div>
    );
}

const forwardedSelectorDemo = forwardRef(SelectorDemo);
export default forwardedSelectorDemo;
