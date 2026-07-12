import { Injectable, NotFoundException } from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryTreeRepo: TreeRepository<Category>,
  ) {}

  async getTree(): Promise<any> {
    return this.categoryTreeRepo.findTrees({ depth: 2 });
  }

  async getRoots(): Promise<any> {
    return this.categoryTreeRepo.findRoots();
  }

  async getDescendants(): Promise<any> {
    // const parent =
    // return this.categoryTreeRepo.findDescendants();
  }

  async getSectionCategories(sectionId: number) {
    const roots = await this.categoryTreeRepo.find({
      where: {
        section: { id: sectionId },
        parent: null,
      },
    });

    const trees = [];
    for (const root of roots) {
      const tree = await this.categoryTreeRepo.findDescendantsTree(root);
      trees.push(tree);
    }
    return trees;
  }

  async findCategoryById(id: number): Promise<Category | null> {
    const category = await this.categoryTreeRepo.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });

    if (!category) throw new NotFoundException('Category not found ❌');

    return this.categoryTreeRepo.findAncestorsTree(category);
  }

  async findCategoryBySlug(slug: string): Promise<Category | null> {
    const category = await this.categoryTreeRepo.findOne({
      where: { slug },
      relations: { parent: true, children: true },
    });

    if (!category) throw new NotFoundException('Category not found ❌');

    return this.categoryTreeRepo.findAncestorsTree(category);
  }

  async findDescendants(category): Promise<any> {
    return this.categoryTreeRepo.findDescendants(category);
  }
}
