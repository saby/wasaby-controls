import { useContext } from 'react';
import { Context as PageContext } from './resources/Context';
import { getPopupComponent } from 'Controls/popup';

export default function TemplateDemo(props) {
    const context = useContext(PageContext);
    const Component = getPopupComponent(props.popupComponentName);
    return (
        <Component bodyContentTemplate={<div>{context}</div>} allowAdaptive={props.allowAdaptive} />
    );
}
