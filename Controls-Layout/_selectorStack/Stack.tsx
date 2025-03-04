import { forwardRef, ForwardedRef } from 'react';
import { Stack as StackTemplate } from 'Controls/popupTemplate';
import { Provider, useSlice } from 'Controls-DataEnv/context';
import { HeaderTemplate } from './StackHeader';
import { ContentTemplate } from './StackContent';
import { LISTS_CONTEXT_NODE_NAME, ISelectFactoryArguments } from 'Controls/selector';
import 'css!Controls-Layout/selectorStack';

export const SELECTOR_CONTEXT_NAME = 'selectorContextName';

//@ts-ignore
export const Stack = forwardRef((props, ref: ForwardedRef<unknown>): JSX.Element => {
    const slice = useSlice(SELECTOR_CONTEXT_NAME);
    const { configs, initialKey } = slice?.state as ISelectFactoryArguments;

    return (
        <Provider dataLayoutId={LISTS_CONTEXT_NODE_NAME}>
            <StackTemplate
                forwardedRef={ref}
                headerContentTemplate={
                    <HeaderTemplate {...configs[initialKey]?.filterConfig} configs={configs} />
                }
                bodyContentTemplate={
                    <ContentTemplate
                        {...configs[initialKey]}
                        storeId={initialKey}
                        configs={configs}
                    />
                }
                headerBorderVisible={false}
                rightBorderVisible={false}
                backgroundStyle="unaccented"
            />
        </Provider>
    );
});
