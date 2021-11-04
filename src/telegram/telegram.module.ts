import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramModuleAsyncOpt } from './telegram.interface';
import { TelegramService } from './telegram.service';

@Global()
@Module({})
export class TelegramModule {
  static forRootAsync(options: ITelegramModuleAsyncOpt): DynamicModule {
    const asyncOpt = TelegramModule.createAsyncOptionsProvider(options);
    return {
      module: TelegramModule,
      imports: options.imports,
      providers: [TelegramService, asyncOpt],
      exports: [TelegramService],
    };
  }

  private static createAsyncOptionsProvider(
    options: ITelegramModuleAsyncOpt,
  ): Provider {
    return {
      provide: TELEGRAM_MODULE_OPTIONS,
      useFactory: async (...args: any[]) => {
        const config = await options.useFactory(...args);
        return config;
      },
      inject: options.inject || [],
    };
  }
}
