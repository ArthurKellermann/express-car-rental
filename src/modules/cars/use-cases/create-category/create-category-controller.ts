import { Request, Response } from 'express';
import { CreateCategoryUseCase } from './create-category-use-case';

export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;

    await this.createCategoryUseCase.execute({
      name,
      description,
    });

    return res.status(201).send();
  }
}