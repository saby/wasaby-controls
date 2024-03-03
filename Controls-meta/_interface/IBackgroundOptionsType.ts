import * as rk from 'i18n!ExtControls';
import { ObjectType, ResourceType, StringType, NumberType } from 'Meta/types';
import {IBackground} from 'ExtControls/richColorPicker';

export const IBackgroundOptionsType = ObjectType.id('Controls/meta:IBackgroundOptionsType')
    .title(rk('Фон'))
    .description(rk('Настройка фона.'))
    .attributes<IBackground>({
        backgroundColor: StringType,
        texture: StringType,
        image: ObjectType.attributes<IBackground['image']>({
            resource: ResourceType,
            className: StringType,
            opacity: NumberType,
            blur: NumberType,
            sepia: NumberType,
            contrast: NumberType,
            saturate: NumberType,
            position: StringType.oneOf(['auto', 'cover', 'contain']),
            name: StringType,
            size: NumberType
        })
    }).defaultValue({})
    .editor(
        () => {
            return import('Controls-editors/properties').then(({ BackgroundEditor }) => {
                return BackgroundEditor;
            });
        },
        {}
    );
