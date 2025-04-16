import { getConfig } from 'Controls-Layout-demo/SelectorStack/ConfigLoader';
import { Button } from 'Controls/buttons';
import { StackOpener } from 'Controls/popup';
import { Loader } from 'Controls-DataEnv/dataLoader';
import { RefObject, useCallback, useRef, ForwardedRef, forwardRef } from 'react';

// @ts-ignore
function SelectorDemo(props, ref: ForwardedRef<unknown>): JSX.Element {
    const popupOpenerRef: RefObject<StackOpener> = useRef();
    const openStack = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StackOpener();
        }
        Loader.load(getConfig()).then((loadResults) => {
            popupOpenerRef.current.open({
                template: 'Controls-Layout/selectorStack:Stack',
                templateOptions: {
                    _loadResult: loadResults,
                    _configs: getConfig(),
                },
                width: 500,
            });
        });
    }, []);

    return (
        <div ref={ref}>
            <Button caption={'Open'} onClick={openStack}></Button>
        </div>
    );
}

const forwardedSelectorDemo = forwardRef(SelectorDemo);
export default forwardedSelectorDemo;
