import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { createCategoryDto } from './DTO/crate-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    async createCategory(@Body() createCategoryDto: createCategoryDto) {
        return this.categoryService.addCategory(createCategoryDto);
    }

    @Get(':id')
    async getCategory(@Param('id') id: string) {
        return this.categoryService.getCategory(id);
    }

    @Get()
    async getAllCategories() {
        return this.categoryService.getAllCategories();
    }

    @Put(':id')
    async updateCategory(@Param('id') id: string, @Body('name') name: string) {
        return this.categoryService.updateCategory(id, name);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }
}
