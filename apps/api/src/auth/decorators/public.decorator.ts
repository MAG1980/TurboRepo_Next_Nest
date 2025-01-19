import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants';

/**
 * Добавляет эндпойнт доступным без аутентификации.
 * @constructor
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
