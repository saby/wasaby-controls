/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { ControllerContext } from './__ControllerContext';

interface IProps {
    controllerOptionsInnerComponent: TemplateFunction;
}

function ControllerContextConsumer(props: IProps): JSX.Element {
    const context = React.useContext(ControllerContext); // получаем из контекста данные
    const selectedItems = context?.selectedItems;
    return (
        <props.controllerOptionsInnerComponent
            {...props}
            selectedItems={selectedItems}
        />
    );
}
export default React.memo(ControllerContextConsumer);
