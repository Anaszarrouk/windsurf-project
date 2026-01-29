import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

export abstract class BaseCrudService<TEntity extends { id: string }> {
  protected constructor(
    protected readonly repository: Repository<TEntity>,
    private readonly entityLabel: string,
  ) {}

  async findAll(options?: FindManyOptions<TEntity>): Promise<TEntity[]> {
    return this.repository.find(options);
  }

  async findOne(
    id: string,
    options?: Omit<FindOneOptions<TEntity>, 'where'>,
  ): Promise<TEntity> {
    const entity = await this.repository.findOne({
      ...(options ?? {}),
      where: { id } as any,
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityLabel} with ID ${id} not found`);
    }

    return entity;
  }

  async create(dto: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async update(id: string, dto: DeepPartial<TEntity>): Promise<TEntity> {
    const entity = await this.repository.preload({ id, ...(dto as any) } as any);

    if (!entity) {
      throw new NotFoundException(`${this.entityLabel} with ID ${id} not found`);
    }

    return this.repository.save(entity);
  }

  async removeHard(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  async removeSoft(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.softRemove(entity as any);
  }
}
