import { GroupTemplate as GridGroupTemplate } from 'Controls/gridRender';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export default function GroupTemplate(props) {
    let customGroupTemplate = props.groupTemplate;
    if (typeof props.groupTemplate === 'string') {
        customGroupTemplate = loadSync(props.groupTemplate);
    }
    const ListGroupTemplate = customGroupTemplate || GridGroupTemplate;
    return (
        <ListGroupTemplate
            {...props}
            className="controls-margin_left-xl controls-margin_right-xl"
        />
    );
}
