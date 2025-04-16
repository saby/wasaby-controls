import { Store } from 'Controls/HistoryStore';
import { LocalStorage } from 'Browser/Storage';

new LocalStorage().clear();

Store.push('shoesHistoryId', [0]);
Store.push('shoesHistoryId', [6]);
Store.togglePin('shoesHistoryId', 0, true);
