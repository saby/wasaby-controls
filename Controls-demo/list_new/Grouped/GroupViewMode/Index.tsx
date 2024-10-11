import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Blocks from './blocks/Index';
import TitledBlocks from './titledBlocks/Index';

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div ref={ref} className="controls-padding-m">
            <div className="tw-flex tw-flex-wrap controlsDemo__childMinWidth400">
                <div className="controls-padding_bottom-m controls-margin_right-2xl">
                    <Blocks />
                </div>
                <div>
                    <TitledBlocks />
                </div>
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Blocks.getLoadConfig(),
            ...TitledBlocks.getLoadConfig(),
        };
    },
});
