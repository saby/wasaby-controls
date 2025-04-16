import { getArguments } from 'Controls-Layout-demo/SelectorStack/SelectorTemplate/ConfigLoader';
import { ForwardedRef, forwardRef, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import { Selector } from 'Controls/lookup';

export const multiSelectConfig = getArguments({ multiSelect: true });
export const multiSelectConfigWithToolbar = getArguments({
    multiSelect: true,
    addButton: true,
    toolbar: true,
});

function SelectorDemo(props: IControlProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const selectorTemplate = {
        templateName: 'Controls-Layout/selectorStack:Template',
        templateOptions: multiSelectConfigWithToolbar,
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
