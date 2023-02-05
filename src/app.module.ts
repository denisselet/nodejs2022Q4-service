import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [UsersModule, TracksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
