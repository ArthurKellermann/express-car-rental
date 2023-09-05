import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../repositories/implementations/user-repository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('PrismaUsersRepository') private usersRepository: UserRepository,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error('Email or password incorret');
    }

    const passwordMatch = compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email or password incorret');
    }

    const token = sign({}, '9b913e7f1f9e37ddaae984018e3dfc54', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: AuthenticateUserResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
    return tokenReturn;
  }
}