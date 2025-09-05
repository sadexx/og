import { FindOneOptions, ObjectLiteral, Repository } from "typeorm";
import { NotFoundException } from "../exceptions";

export async function findOneOrFail<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: FindOneOptions<T>
): Promise<T> {
  const entity = await repository.findOne(options);

  if (!entity) {
    const entityName = repository.metadata.name;
    throw new NotFoundException(`${entityName} not found.`);
  }

  return entity;
}
