import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './DTO/create-book.dto';
import { error } from 'console';
import { UpdateBookDto } from './DTO/update-book.dto';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService){}

@Get('hello')
    getHello(): string {
        return 'hello';
    }
    @Post('AddBook')
    async ajoutBook(@Body() createBookDto: CreateBookDto): Promise<any>{
        return  this.bookService.addBook(createBookDto);
    }

    @Get(':id')
    async avoirBook(@Param('id') id: string): Promise<any>{
        if(!id){
            throw new BadRequestException('L\'id du livre est requis');
        }
        return  this.bookService.getBook(id);
    }

    @Get('')
    async avoirBooks(): Promise<any>{
        return  this.bookService.getAllBooks();
    }

    @Put('update/:id') 
  async updateBook(
    @Param('id') id: string, 
    @Body() updateBookDto: UpdateBookDto, 
    
  ): Promise<any> {
    return this.bookService.updateBook(id, updateBookDto);
  }

    @Delete('delete/:id')
    async suprimerBook(@Param('id') id: string): Promise<any>{
        if(!id){
            throw new BadRequestException('L\'id du livre est requiss');
            
        }
        return  this.bookService.deleteBook(id);
    }
}
