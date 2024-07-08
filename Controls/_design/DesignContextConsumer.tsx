import * as React from 'react';
import DesignContext from './Context';
import { TemplateFunction } from 'UICommon/base';

interface IProps {
    designOptionsInnerComponent: TemplateFunction;
}

function DesignContextConsumer(props: IProps): JSX.Element {
    const designContextValue = React.useContext(DesignContext);
    return <props.designOptionsInnerComponent {...props} designContextValue={designContextValue} />;
}

export default React.memo(DesignContextConsumer);
