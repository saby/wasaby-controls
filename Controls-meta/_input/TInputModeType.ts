import { TInputMode } from 'Controls/input';
import { StringType } from 'Types/meta';

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
