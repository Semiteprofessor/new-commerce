import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/sections.entity';
import { Category } from './entities/category.entity';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './controllers/category.controller';
import { SectionRepository } from './repositories/section.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Category])],
  providers: [CategoryService, SectionRepository, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService, CategoryRepository],
})
export class CategoriesModule {}
