import { Module } from '@nestjs/common';
import { EmpruntService } from './emprunt.service';
import { EmpruntController } from './emprunt.controller';
import { DynamoDBModule } from 'src/dynamodb/dynamodb.module';

@Module({
  imports: [DynamoDBModule],
  providers: [EmpruntService],
  controllers: [EmpruntController]
})
export class EmpruntModule {}
