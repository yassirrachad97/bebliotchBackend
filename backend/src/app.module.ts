import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBModule } from './dynamodb/dynamodb.module';
import { BookModule } from './book/book.module';
import { CategoriesModule } from './categories/categories.module';
import { EmpruntModule } from './emprunt/emprunt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  
      envFilePath: '.env'
    }),
    DynamoDBModule,
    BookModule,
    CategoriesModule,
    EmpruntModule,
  ],
})
export class AppModule {}
