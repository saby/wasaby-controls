// TODO: временное решение проблемы с sonar тестами по проверки импортов
// eslint-disable-next-line dependencies-of-modules
import { memo } from 'react';
import { Title } from 'Controls/heading';
import PopupHeaderObjectEditorLayout from './PopupHeaderObjectEditorLayout/PopupHeaderObjectEditorLayout';
import { ObjectMeta } from 'Meta/types';

interface IPropertyGridPopupHeaderTitleProps {
    title?: string;
    onChange?: (value: object) => void;
    headerEditorMeta: ObjectMeta<object>;
    value: object;
}

function PropertyGridPopupHeaderTitle(props: IPropertyGridPopupHeaderTitleProps) {
    const { title, onChange, headerEditorMeta, value } = props;

    return (
        <div className="objectEditorPopupHeaderTitle">
            {headerEditorMeta ? (
                <PopupHeaderObjectEditorLayout
                    metaType={headerEditorMeta}
                    value={value}
                    onChange={onChange}
                />
            ) : (
                <div className="objectEditorPopupHeaderTitle__caption">
                    <Title
                        className="controls-DialogTemplate__caption_text"
                        caption={title}
                        fontColorStyle="default"
                        fontSize="xl"
                        readOnly={true}
                        tooltip={title}
                    />
                </div>
            )}
        </div>
    );
}

export default memo(PropertyGridPopupHeaderTitle);
