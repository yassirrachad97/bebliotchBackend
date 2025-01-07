import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { createCategoryDto } from './DTO/crate-category.dto';
import { ReturnValue } from '@aws-sdk/client-dynamodb';

@Injectable()
export class CategoryService {
    constructor(
        @Inject('DYNAMODB_CLIENT')
        private readonly dynamoDbClient: DynamoDBDocumentClient,
        private readonly configService: ConfigService,
    ) {}

    async addCategory(createCategoryDto: createCategoryDto): Promise<any> {
        const category = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            ...createCategoryDto,
        };

        const params = {
            TableName: this.configService.get<string>('CATEGORY_TABLE_NAME'),
            Item: category,
        };

        try {
            await this.dynamoDbClient.send(new PutCommand(params));
            return {
                success: true,
                message: 'Category added successfully',
                data: category,
            };
        } catch (error) {
            console.error('DynamoDB Error:', error);
            throw new InternalServerErrorException(`Failed to add category: ${error.message}`);
        }
    }

    async getCategory(id: string): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('CATEGORY_TABLE_NAME'),
            Key: { id },
        };

        try {
            const { Item } = await this.dynamoDbClient.send(new GetCommand(params));
            if (!Item) {
                throw new NotFoundException('Category not found');
            }

            return {
                success: true,
                message: 'Category retrieved successfully',
                data: Item,
            };
        } catch (error) {
            console.error('DynamoDB Error:', error.message || error);
            throw new InternalServerErrorException(
                `Failed to retrieve category: ${error.message || 'Internal error'}`,
            );
        }
    }

    async getAllCategories(): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('CATEGORY_TABLE_NAME'),
        };

        try {
            const { Items } = await this.dynamoDbClient.send(new ScanCommand(params));
            return {
                success: true,
                message: 'Categories retrieved successfully',
                data: Items || [],
            };
        } catch (error) {
            console.error('DynamoDB Error:', error.message || error);
            throw new InternalServerErrorException(
                `Failed to retrieve categories: ${error.message || 'Internal error'}`,
            );
        }
    }

    async updateCategory(id: string, name: string): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('CATEGORY_TABLE_NAME'),
            Key: { id },
            UpdateExpression: 'SET #name = :name',
            ExpressionAttributeNames: { '#name': 'name' },
            ExpressionAttributeValues: { ':name': name },
            ReturnValues: ReturnValue.ALL_NEW,
        };

        try {
            const { Attributes } = await this.dynamoDbClient.send(new UpdateCommand(params));
            if (!Attributes) {
                throw new NotFoundException('Category not found');
            }

            return {
                success: true,
                message: 'Category updated successfully',
                data: Attributes,
            };
        } catch (error) {
            console.error('DynamoDB Error:', error.message || error);
            throw new InternalServerErrorException(
                `Failed to update category: ${error.message || 'Internal error'}`,
            );
        }
    }

    async deleteCategory(id: string): Promise<any> {
        const params = {
            TableName: this.configService.get<string>('CATEGORY_TABLE_NAME'),
            Key: { id },
        };

        try {
            const { Item } = await this.dynamoDbClient.send(new GetCommand(params));
            if (!Item) {
                throw new NotFoundException('Category not found');
            }

            await this.dynamoDbClient.send(new DeleteCommand(params));
            return {
                success: true,
                message: 'Category deleted successfully',
            };
        } catch (error) {
            console.error('DynamoDB Error:', error.message || error);
            throw new InternalServerErrorException(
                `Failed to delete category: ${error.message || 'Internal error'}`,
            );
        }
    }
}
