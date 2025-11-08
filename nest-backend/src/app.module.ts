import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',   // optional but recommended
  }),
  // TODO: I think we'll remove this later maybe, dunno
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60,        // time window in seconds
        limit: 3,      // max requests per window per IP
      }
      ]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
