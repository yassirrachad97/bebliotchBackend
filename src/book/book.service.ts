import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';
import { CreateBookDto } from './DTO/create-book.dto';
import { v4 as uuidv4 } from 'uuid';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { UpdateBookDto } from './DTO/update-book.dto';
import { CategoryService } from 'src/categories/categories.service';

@Injectable()
export class BookService {
    constructor(
        @Inject('DYNAMODB_CLIENT')
        private readonly dynamoDbClient: DynamoDBDocumentClient,
        private readonly configService: ConfigService,
        private readonly categoryService: CategoryService,
    ) {}

    async addBook(createBookDto: CreateBookDto): Promise<any> {
        const category = await this.categoryService.getCategory(createBookDto.categoryId);
        if (!category) {
          throw new NotFoundException('Catégorie non trouvée');
        }
        const book = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...createBookDto,
        };

        const params = {
            TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
            Item: book,
        };

        try {
            await this.dynamoDbClient.send(new PutCommand(params));
            return { 
                success: true,
                message: 'Book added successfully', 
                data: book 
            };
        } catch (error) {
            console.error('DynamoDB Error:', error);
            throw new Error(`Failed to add book: ${error.message}`);
        }
    }
    
    async getBook(id: string): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
            Key: { id },
        };
    
        try {
          
            const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

        

    
            if (!Item) {
              
                throw new NotFoundException('Livre non trouvé');
            }
    
            return {
                success: true,
                message: 'Livre récupéré avec succès',
                data: Item,
            };
        } catch (error) {
           
            if (error instanceof NotFoundException) {
                throw error;
            }
    
           
            console.error('Erreur DynamoDB:', error.message || error);
            throw new InternalServerErrorException(
                `Échec de récupération du livre : ${error.message || 'Erreur interne'}`,
            );
        }
    }

    async getAllBooks(): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
        };

        try {
            const { Items } = await this.dynamoDbClient.send(new ScanCommand(params));

            if (!Items || Items.length === 0) {
                throw new NotFoundException('Aucun livre trouvé');
            }

            console.log(Items);
            return {
                success: true,
                message: 'Livres récupérés avec succès',
                data: Items,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Erreur DynamoDB:', error.message || error);
            throw new InternalServerErrorException(
                `Échec de récupération des livres : ${error.message || 'Erreur interne'}`,
            );
        }
    }

    async deleteBook(id: string): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
            Key: { id },
        };

        try {
            const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

            if (!Item) {
                throw new NotFoundException('Livre non trouvé');
            }

            await this.dynamoDbClient.send(new DeleteCommand(params));

            return {
                success: true,
                message: 'Livre supprimé avec succès',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Erreur DynamoDB:', error.message || error);
            throw new InternalServerErrorException(
                `Échec de suppression du livre : ${error.message || 'Erreur interne'}`,
            );
        }
    }

    async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
            Key: { id },
        };

        try {
            const { Item } = await this.dynamoDbClient.send(new GetCommand(params));

            if (!Item) {
                throw new NotFoundException('Livre non trouvé');
            }

            const updatedBook = {
                ...Item,
                ...updateBookDto,
            };

            const updateParams = {
                TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
                Item: updatedBook,
            };

            await this.dynamoDbClient.send(new PutCommand(updateParams));

            return {
                success: true,
                message: 'Livre mis à jour avec succès',
                data: updatedBook,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            console.error('Erreur DynamoDB:', error.message || error);
            throw new InternalServerErrorException(
                `Échec de mise à jour du livre : ${error.message || 'Erreur interne'}`,
            );
        }
    }
    
}
