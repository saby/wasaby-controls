/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { TemplateFunction } from 'UI/Base';
import * as React from 'react';
import { DataContext } from './_OptionsField';

interface IProps {
    content: TemplateFunction;
}

function OptionsFieldConsumer(props: IProps): JSX.Element {
    const options = React.useContext(DataContext);
    return <props.content {...props} _suggestListOptions={options} />;
}
export default React.memo(OptionsFieldConsumer);
