import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDtoFromFrontend } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDtoFromFrontend) {}
