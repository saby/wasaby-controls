import { MouseEventHandler } from 'react';
import { Button } from 'Controls/buttons';
import { InfoboxTarget } from 'Controls/popupTargets';
import TagTemplateReact from 'Controls/Application/TagTemplate/TagTemplateReact';

import * as rk from 'i18n!Controls-editors';

type TSizeEditorTitle = {
    title: string;
    delSizeHandler: MouseEventHandler;
};

function SizeEditorTitle(props: TSizeEditorTitle) {
    const { title, delSizeHandler } = props;

    const infoboxTemplate = (
        <Button
            viewMode="link"
            fontColorStyle="label"
            icon="icon-Restore"
            onClick={delSizeHandler}
            caption={rk('Сбросить')}
        />
    );

    return (
        <div className="pw-relative controls-margin_right-s">
            {title}
            <InfoboxTarget template={infoboxTemplate} trigger="click" closeButtonVisible={false}>
                <div className="tw-absolute tw-top-0 tw-right-0">
                    <TagTemplateReact
                        className="tw-cursor-pointer controls-margin_right-2xs"
                        tagStyle="primary"
                    />
                </div>
            </InfoboxTarget>
        </div>
    );
}

export default SizeEditorTitle;
