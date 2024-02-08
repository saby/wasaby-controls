import { TInputMode } from 'Controls/input';
import { StringType } from 'Meta/types';

const options: readonly TInputMode[] = [
    'none',
    'text',
    'decimal',
    'numeric',
    'tel',
    'search',
    'email',
    'url',
] as const;

export const TInputModeType = StringType.oneOf(options);
