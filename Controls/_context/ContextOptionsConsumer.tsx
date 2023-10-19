/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { TemplateFunction } from 'UICommon/base';

interface IProps {
    contextOptionsInnerComponent: TemplateFunction;
}

function ContextOptionsConsumer(props: IProps): JSX.Element {
    const _dataOptionsValue = React.useContext(DataContext);
    return <props.contextOptionsInnerComponent {...props} _dataOptionsValue={_dataOptionsValue} />;
}

export default React.memo(ContextOptionsConsumer);
