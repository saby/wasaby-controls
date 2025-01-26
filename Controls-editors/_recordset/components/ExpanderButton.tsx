import { Button } from 'Controls/buttons';

interface IExpanderButtonProps {
    caption: string;
    isExpanded: boolean;
    onClick: () => void;
}
export function ExpanderButton(props: IExpanderButtonProps) {
    const { caption, onClick, isExpanded } = props;
    return (
        <div
            className={
                'tw-flex tw-cursor-pointer tw-items-baseline controls-recordsetEditor_expander-button'
            }
            onClick={onClick}
        >
            <div className={'controls-recordsetEditor_header-title_bold'}>{caption}</div>
            <Button
                icon={isExpanded ? 'icon-MarkExpandBoldMin' : 'icon-MarkRightBoldMin'}
                viewMode={'link'}
                iconStyle={'secondary'}
                iconSize={'2xs'}
                inlineHeight={'s'}
                fontSize={'s'}
                translucent={'none'}
            />
        </div>
    );
}
