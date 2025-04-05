import { TOutputItemStatus } from '../output/IOutput';

export type TChangeStep = { value: unknown; status: TOutputItemStatus; senderName?: string };
