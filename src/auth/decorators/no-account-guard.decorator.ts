import { SetMetadata } from '@nestjs/common';

export const NO_ACCOUNT_GUARD_KEY = 'noAccountGuard';
export const NoAccountGuard = () => SetMetadata(NO_ACCOUNT_GUARD_KEY, true);
