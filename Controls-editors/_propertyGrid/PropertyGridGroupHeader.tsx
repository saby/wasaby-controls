import { Title as TitleControl } from 'Controls/heading';
import { IGroupHeaderProps } from 'Controls-editors/object-type';

/**
 * Реакт компонент, для отрисовки заголовка группы редакторов внутри проперти грида
 * @class Controls-editors/_propertyGrid/PropertyGridGroupHeader
 * @public
 * @demo Controls-demo/ObjectTypeEditor/ButtonPropsEditorPopup/Index
 */

function PropertyGridGroupHeader(props: IGroupHeaderProps) {
    return (
        <>
            <div className="controls_PropertyGrid__separator"></div>

            {!!props.title ? (
                <TitleControl
                    caption={props.title}
                    fontSize="xs"
                    className="controls_PropertyGrid__title"
                    readOnly={true}
                />
            ) : null}
        </>
    );
}

export default PropertyGridGroupHeader;
