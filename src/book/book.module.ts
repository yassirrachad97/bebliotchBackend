import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { DynamoDBModule } from '../dynamodb/dynamodb.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [DynamoDBModule,
    CategoriesModule,
  ],  
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
