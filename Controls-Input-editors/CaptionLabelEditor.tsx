import { LabelEditor, ILabelEditorProps } from './LabelEditor';
import { Checkbox } from 'Controls/checkbox';
import { memo, useMemo } from 'react';
import { Label } from 'Controls/input';
import * as rk from 'i18n!Controls-editors';

interface ICaptionLabelEditorProps extends ILabelEditorProps {}

interface IContentTemplateProps {
    itemValue?: string;
    itemCaption?: string;
}

function ContentTemplate(props: IContentTemplateProps) {
    switch (props.item.item.get('value')) {
        case 'captionStart':
            return (
                <Checkbox
                    value={true}
                    captionPosition="start"
                    caption={props.item.item.get('caption')}
                />
            );
        case 'captionEnd':
            return (
                <Checkbox
                    value={true}
                    captionPosition="end"
                    caption={props.item.item.get('caption')}
                />
            );
        case 'top':
            return (
                <div className="tw-flex tw-flex-col">
                    <Label caption={props.item.item.get('title')} />
                    <Checkbox value={true} />
                </div>
            );
        case 'start':
            return (
                <div className="tw-flex">
                    <Label caption={props.item.item.get('title')} />
                    <Checkbox value={true} className="controls-margin_right-s" />
                </div>
            );
        default:
            return <Checkbox value={true} />;
    }
}

export const CaptionLabelEditor = memo((props: ICaptionLabelEditorProps) => {
    const data = useMemo(() => {
        return [
            {
                title: rk('Текстом слева'),
                value: 'start',
            },
            {
                title: rk('Текстом сверху'),
                value: 'top',
            },
            {
                caption: rk('После чекбокса'),
                value: 'captionEnd',
                isLabelHidden: true,
            },
            {
                caption: rk('Перед чекбоксом'),
                value: 'captionStart',
                isLabelHidden: true,
            },
        ];
    }, []);
    return (
        <LabelEditor
            {...props}
            customData={data}
            contentTemplate={ContentTemplate}
            onChange={props.onChange}
        />
    );
});
