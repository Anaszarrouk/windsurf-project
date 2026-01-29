import { BaseCrudService } from './base-crud.service';

export abstract class BaseCrudController<
  TEntity extends { id: string },
  TCreateDto,
  TUpdateDto,
> {
  protected constructor(protected readonly service: BaseCrudService<TEntity>) {}

  findAll() {
    return this.service.findAll();
  }

  findOne(id: string) {
    return this.service.findOne(id);
  }

  create(dto: TCreateDto) {
    return this.service.create(dto as any);
  }

  update(id: string, dto: TUpdateDto) {
    return this.service.update(id, dto as any);
  }

  removeHard(id: string) {
    return this.service.removeHard(id);
  }

  removeSoft(id: string) {
    return this.service.removeSoft(id);
  }
}
