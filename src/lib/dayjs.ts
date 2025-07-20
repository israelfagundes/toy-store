import lib from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';

lib.extend(relativeTime);
lib.locale(ptBR);

export const dayjs = lib;
