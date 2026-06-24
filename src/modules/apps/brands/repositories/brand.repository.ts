export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private readonly _brandRepository: Repository<Brand>,
  ) {}
  async create(data: DeepPartial<Brand>): Promise<Brand> {
    try {
      const user = this._brandRepository.create(data);
      return await this._brandRepository.save(user);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException({
          statusCode: 409,
          message: `A brand with name, ${data.name} already exists `,
        });
      }
      throw e;
    }
  }

  async findOne(
    filterQuery: FindOptionsWhere<Brand>,
    options?: FindOneOptions<Brand>,
  ): Promise<Brand | null> {
    return this._brandRepository.findOne({ where: filterQuery, ...options });
  }

  // async create(createEntityData: DeepPartial<T>): Promise<T> {
  //   const entity = this._brandRepository.create(createEntityData);
  //   return await this._sectionRepository.save(entity);
  // }
}
