import { getArguments } from 'Controls-Layout-demo/SelectorStack/SelectorTemplate/ConfigLoader';
import { ForwardedRef, forwardRef, ReactElement } from 'react';
import { IControlProps } from 'Controls/interface';
import { Selector } from 'Controls/lookup';

export const tabsConfig = getArguments({ multiSelect: true, tabs: true });
export const tabsConfigWithFilter = getArguments({ multiSelect: true, tabs: true, filter: true });
export const tabsConfigWithCaption = getArguments({
    multiSelect: true,
    initialKey: 'clothes',
    tabs: true,
    caption: 'Очень длинный заголовок для окна выбора',
});

function SelectorDemo(props: IControlProps, ref: ForwardedRef<HTMLDivElement>): ReactElement {
    const selectorTemplate = {
        templateName: 'Controls-Layout/selectorStack:Template',
        templateOptions: tabsConfigWithFilter,
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
