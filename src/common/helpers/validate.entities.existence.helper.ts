import { FindOptionsWhere, In, ObjectLiteral, Repository } from "typeorm";
import { HttpException } from "../exceptions/http.exception";
import { EHttpResponseCode } from "../enums";

export const validateEntitiesExistence = async <T extends ObjectLiteral & { id: string | number }>(
  ids: unknown[],
  repository: Repository<T>,
  relations: string[] = []
): Promise<T[]> => {
  const optionsWhere: FindOptionsWhere<T> = {
    id: In(ids)
  } as FindOptionsWhere<T>;

  const entities = await repository.find({ where: optionsWhere, relations });

  if (entities.length !== ids.length) {
    throw new HttpException(EHttpResponseCode.NOT_FOUND, `${repository.metadata.name} not found`);
  }

  return entities;
};
