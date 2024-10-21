import { LabelEditor, ILabelEditorProps } from './LabelEditor';
import { Checkbox } from 'Controls/checkbox';
import { memo, useMemo } from 'react';
import * as rk from 'i18n!Controls-editors';


interface ICaptionLabelEditorProps extends ILabelEditorProps {
}

interface IContentTemplateProps {
    itemValue?: string;
    itemCaption?: string;
}

function ContentTemplate(props: IContentTemplateProps) {
    switch (props.itemValue) {
        case 'captionStart':
            return <Checkbox value={true} captionPosition='start' caption={props.itemCaption}/>;
        case 'captionEnd':
            return <Checkbox value={true} captionPosition='end' caption={props.itemCaption}/>;
        default:
            return <Checkbox value={true}/>;
    }
}

export const CaptionLabelEditor = memo((props: ICaptionLabelEditorProps) => {
    const data = useMemo(() => {
        return [
            {
                caption: rk('Отсутствует'),
                value: 'hidden',
            },
            {
                caption: rk('Слева'),
                menuCaption: rk('Текстом слева'),
                value: 'start',
            },
            {
                caption: rk('Сверху'),
                menuCaption: rk('Текстом сверху'),
                value: 'top',
            },
            {
                caption: rk('После чекбокса'),
                menuCaption: rk('Подпись после чекбокса'),
                value: 'captionEnd',
                isLabelHidden: true
            },
            {
                caption: rk('Перед чекбоксом'),
                menuCaption: rk('Подпись перед чекбоксом'),
                value: 'captionStart',
                isLabelHidden: true
            },
        ];
    }, []);
    return <LabelEditor
        {...props}
        customData={data}
        Control={ContentTemplate}
        onChange={props.onChange}
    />;
});