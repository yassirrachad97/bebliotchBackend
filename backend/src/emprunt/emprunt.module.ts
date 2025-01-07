import { Module } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { EmpruntController } from './emprunt.controller';

@Module({
  providers: [EmpruntService],
  controllers: [EmpruntController]
})
export class EmpruntModule {}
