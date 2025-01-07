import { PartialType } from '@nestjs/mapped-types';
import { createCategoryDto} from './crate-category.dto'

export class UpdateCategoryDto extends PartialType(createCategoryDto) {}
