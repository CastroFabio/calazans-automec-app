import { HttpException, HttpStatus } from '@nestjs/common';

export class ResourceHasDependenciesException extends HttpException {
  constructor(resourceName: string, dependencyName: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Não é possível excluir o(a) ${resourceName} pois existem ${dependencyName} vinculados(as).`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}
