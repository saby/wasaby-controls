import { memo, MouseEventHandler } from 'react';
import { Button } from 'Controls/buttons';

import * as rk from 'i18n!Controls-editors';

export type TSizeEditorAspectRatioToggler = {
    enabled: boolean;
    onClick: MouseEventHandler;
};

const SizeEditorAspectRatioToggler = memo((props: TSizeEditorAspectRatioToggler) => {
    const { enabled, onClick } = props;

    return (
        <div className="controls-PropertyGrid-sizeEditor__aspectRatio">
            <div className="controls-PropertyGrid-sizeEditor_lockIcon__topBorder" />
            <Button
                icon={enabled ? 'icon-Lock' : 'icon-Unlock'}
                viewMode="link"
                iconStyle="unaccented"
                iconSize="2xs"
                onClick={onClick}
                tooltip={enabled ? rk('Убрать сохранение пропорций') : rk('Сохранять пропорции')}
            />
            <div className="controls-PropertyGrid-sizeEditor_lockIcon__bottomBorder" />
        </div>
    );
});

export default SizeEditorAspectRatioToggler;
