import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/current_time_and_randomness.tact',
    options: {
        debug: true
    }
};
