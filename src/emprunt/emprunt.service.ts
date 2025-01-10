import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { CreateEmpruntDto } from './DTO/create-emprunt.dto';
import { QueryCommand } from '@aws-sdk/client-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

@Injectable()
export class EmpruntService {
  constructor(
    @Inject('DYNAMODB_CLIENT')
    private readonly dynamoDbClient: DynamoDBDocumentClient,
    private readonly configService: ConfigService,
  ) {}

  async createEmprunt(createEmpruntDto: CreateEmpruntDto) {
    try {
      const { userId, bookId, startDate, endDate, returned } = createEmpruntDto;
      const tableName = this.configService.get<string>('EMPRUNT_TABLE_NAME');

      const bookAvailable = await this.checkBookAvailability(bookId);
      if (!bookAvailable) {
        throw new BadRequestException('Book is not available');
      }

      const emprunt = {
        id: uuidv4(),
        userId,
        bookId,
        startDate,
        endDate,
        returned,
      };

      const params = {
        TableName: tableName,
        Item: emprunt,
      };

      await this.dynamoDbClient.send(new PutCommand(params));
      return {
        success: true,
        message: 'Emprunt enregistré avec succès',
        data: emprunt,
      };
    } catch (error) {
      console.error('Erreur DynamoDB:', error);
      throw new Error("Échec de la création de l'emprunt");
    }
  }

  async checkBookAvailability(bookId: string): Promise<boolean> {
    const tableName = this.configService.get<string>('EMPRUNT_TABLE_NAME');

    const params = {
      TableName: tableName,
      IndexName: 'bookId-index',
      KeyConditionExpression: 'bookId = :bookId',
      FilterExpression: '#returned = :returned',
      ExpressionAttributeValues: {
        ':bookId': { S: bookId } as AttributeValue,
        ':returned': { BOOL: false } as AttributeValue,
      },
      ExpressionAttributeNames: {
        '#returned': 'returned',
      },
    };

    try {
      const { Items } = await this.dynamoDbClient.send(
        new QueryCommand(params),
      );
      return Items?.length === 0;
    } catch (error) {
      console.error('Erreur DynamoDB:', error);
      throw new Error('Échec de la vérification de disponibilité du livre');
    }
  }
}
