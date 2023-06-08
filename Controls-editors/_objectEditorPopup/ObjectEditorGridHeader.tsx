import { Title as TitleControl } from 'Controls/heading';
import { IGroupHeaderProps } from 'Controls-editors/object-type';

function ObjectEditorGridHeader(props: IGroupHeaderProps) {
    return (
        <>
            <div className="controls_ObjectEditorPopup__separator"></div>

            {!!props.title ? (
                <TitleControl
                    caption={props.title}
                    fontSize="xs"
                    className="controls_ObjectEditorPopup__title"
                />
            ) : null}
        </>
    );
}

export default ObjectEditorGridHeader;
