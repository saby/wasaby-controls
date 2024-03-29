/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Context } from './Context';
import type { PinController } from './PinController';

export interface IProps extends TInternalProps {
    content: TemplateFunction;
}

/**
 * Контрол, принимающий закрепленные данные от {@link Controls/stickyEnvironment:DataPinContainer DataPinContainer}
 * @public
 */
function DataPinConsumer(props: IProps, ref): JSX.Element {
    const [pinnedData, setPinnedData] = React.useState<unknown | null>(null);

    // получаем из контекста данные
    const { controller } = React.useContext(Context) as {
        controller: PinController;
    };

    React.useEffect(() => {
        controller.subscribe(setPinnedData);
        return () => {
            controller.unsubscribe(setPinnedData);
        };
    }, []);

    return (
        <props.content {...props} forwardedRef={ref} pinnedData={pinnedData} />
    );
}
export default React.forwardRef(DataPinConsumer);
