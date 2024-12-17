import { IGroupHeaderProps } from 'Controls-editors/object-type';
import * as translate from 'i18n!Controls-editors';

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
                <span className="controls_PropertyGrid__title">{translate(props.title)}</span>
            ) : null}
        </>
    );
}

export default PropertyGridGroupHeader;
