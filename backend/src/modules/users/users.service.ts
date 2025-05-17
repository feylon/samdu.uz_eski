import { ConflictException, Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const admins = await this.usersRepo.count({ where: { role: Role.ADMIN } });
    if (admins > 0) return;
    const email = this.config.getOrThrow<string>('admin.email');
    await this.create({
      email,
      password: this.config.getOrThrow<string>('admin.password'),
      fullName: this.config.getOrThrow<string>('admin.fullName'),
      role: Role.ADMIN,
    });
    this.logger.log(`Default admin yaratildi: ${email}`);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  findActiveById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id, isActive: true } });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.usersRepo.exists({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    const user = this.usersRepo.create({
      ...dto,
      email: dto.email.toLowerCase(),
      password: await bcrypt.hash(dto.password, 10),
    });
    const saved = await this.usersRepo.save(user);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const exists = await this.usersRepo.exists({ where: { email: dto.email.toLowerCase() } });
      if (exists) throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }
    const { password, ...rest } = dto;
    Object.assign(user, rest, rest.email ? { email: rest.email.toLowerCase() } : {});
    if (password) user.password = await bcrypt.hash(password, 10);
    await this.usersRepo.save(user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
  }

  async touchLastLogin(id: string): Promise<void> {
    await this.usersRepo.update(id, { lastLoginAt: new Date() });
  }
}
