import { Controller, Get, Query } from '@nestjs/common';
import { Category } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { AuthType } from '../../../../modules/core/iam/authentication/enums/auth-type.enum';
import { Auth } from '../../../../modules/core/iam/authentication/decorator/auth.decorator';

@Auth(AuthType.None)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryService.getTree();
  }

  @Get('section')
  async getCategoriesBySection(@Query() query: any): Promise<Category[]> {
    const { sectionId } = query;
    return await this.categoryService.getSectionCategories(sectionId);
  }
}
