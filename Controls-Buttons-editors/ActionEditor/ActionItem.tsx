import { Title } from 'Controls/heading';
import { Button } from 'Controls/buttons';
import { useContext } from 'react';
import { DataContext } from 'Controls-DataEnv/context';

const ACTIONS_SLICE_NAME = 'Actions';
const DEFAULT_CAPTION = 'Действие';

type Props = {
    id: string;
    onClick: () => void;
    onClear: () => void;
};

/**
 * Отображает выбранное действие
 */
export function ActionItem(props: Props) {
    const { id, onClick, onClear } = props;
    const dataContext = useContext(DataContext);
    const item = dataContext?.[ACTIONS_SLICE_NAME]?.state?.items?.getRecordById?.(id);
    return (
        <div className="controls-ActionEditor-wrapper ws-flexbox ws-justify-content-between space-between ws-align-items-baseline">
            <Title
                className="controls-margin_bottom-s"
                caption={item.get('title') || DEFAULT_CAPTION}
                fontColorStyle="default"
                fontSize="m"
                readOnly={true}
                fontWeight="normal"
                data-qa="controls-PropertyGrid__editor_action"
            />
            <div className="controls-ActionEditor-buttons">
                <Button
                    className="controls-margin_right-xs"
                    onClick={onClick}
                    viewMode="ghost"
                    icon="icon-Edit"
                    inlineHeight="m"
                    iconSize="m"
                />
                <Button
                    className="controls-margin_right-xs"
                    onClick={onClear}
                    viewMode="ghost"
                    buttonStyle="danger"
                    icon="icon-Trash-bucket"
                    inlineHeight="m"
                    iconSize="m"
                />
            </div>
        </div>
    );
}
