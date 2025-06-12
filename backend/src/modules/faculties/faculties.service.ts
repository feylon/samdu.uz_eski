import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locale } from '../../common/enums/locale.enum';
import { randomSuffix, slugify } from '../../common/utils/slug.util';
import { hasUniqueLocales, mergeTranslations, pickTranslation } from '../../common/utils/translation.util';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { LocalizedDepartmentDto, LocalizedFacultyDto } from './dto/faculty-response.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { DepartmentTranslation } from './entities/department-translation.entity';
import { Department } from './entities/department.entity';
import { FacultyTranslation } from './entities/faculty-translation.entity';
import { Faculty } from './entities/faculty.entity';

@Injectable()
export class FacultiesService {
  constructor(
    @InjectRepository(Faculty) private readonly facultyRepo: Repository<Faculty>,
    @InjectRepository(FacultyTranslation) private readonly facultyTranslationRepo: Repository<FacultyTranslation>,
    @InjectRepository(Department) private readonly departmentRepo: Repository<Department>,
    @InjectRepository(DepartmentTranslation)
    private readonly departmentTranslationRepo: Repository<DepartmentTranslation>,
  ) {}

  async findActive(lang: Locale): Promise<LocalizedFacultyDto[]> {
    const faculties = await this.facultyRepo.find({
      where: { isActive: true },
      relations: { translations: true, departments: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    return faculties.map((faculty) => this.localize(faculty, lang, false));
  }

  async findActiveBySlug(slug: string, lang: Locale): Promise<LocalizedFacultyDto> {
    const faculty = await this.facultyRepo.findOne({
      where: { slug, isActive: true },
      relations: { translations: true, departments: { translations: true } },
      order: { departments: { sortOrder: 'ASC' } },
    });
    if (!faculty) throw new NotFoundException('Fakultet topilmadi');
    return this.localize(faculty, lang, true);
  }

  findAllAdmin(): Promise<Faculty[]> {
    return this.facultyRepo.find({
      relations: { translations: true, departments: { translations: true } },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Faculty> {
    const faculty = await this.facultyRepo.findOne({
      where: { id },
      relations: { translations: true, departments: { translations: true } },
    });
    if (!faculty) throw new NotFoundException('Fakultet topilmadi');
    return faculty;
  }

  async create(dto: CreateFacultyDto): Promise<Faculty> {
    this.assertLocales(dto.translations);
    const { translations, slug, ...rest } = dto;
    const faculty = this.facultyRepo.create({
      ...rest,
      slug: await this.uniqueSlug(slug ?? translations[0].name),
      translations: translations.map((item) => this.facultyTranslationRepo.create(item)),
    });
    const saved = await this.facultyRepo.save(faculty);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateFacultyDto): Promise<Faculty> {
    const faculty = await this.findOne(id);
    const { translations, slug, ...rest } = dto;
    Object.assign(faculty, rest);
    if (slug && slug !== faculty.slug) faculty.slug = await this.uniqueSlug(slug, id);
    if (translations) {
      this.assertLocales(translations);
      faculty.translations = mergeTranslations(faculty.translations, translations, (data) =>
        this.facultyTranslationRepo.create(data),
      );
    }
    await this.facultyRepo.save(faculty);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const faculty = await this.findOne(id);
    await this.facultyRepo.remove(faculty);
  }

  async addDepartment(facultyId: string, dto: CreateDepartmentDto): Promise<Department> {
    this.assertLocales(dto.translations);
    const faculty = await this.findOne(facultyId);
    const department = this.departmentRepo.create({
      ...dto,
      faculty,
      translations: dto.translations.map((item) => this.departmentTranslationRepo.create(item)),
    });
    const saved = await this.departmentRepo.save(department);
    return this.findDepartment(saved.id);
  }

  async updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findDepartment(id);
    const { translations, ...rest } = dto;
    Object.assign(department, rest);
    if (translations) {
      this.assertLocales(translations);
      department.translations = mergeTranslations(department.translations, translations, (data) =>
        this.departmentTranslationRepo.create(data),
      );
    }
    await this.departmentRepo.save(department);
    return this.findDepartment(id);
  }

  async removeDepartment(id: string): Promise<void> {
    const department = await this.findDepartment(id);
    await this.departmentRepo.remove(department);
  }

  async stats(): Promise<{ faculties: number; departments: number; students: number }> {
    const raw = await this.facultyRepo
      .createQueryBuilder('faculty')
      .select('COUNT(faculty.id)', 'faculties')
      .addSelect('COALESCE(SUM(faculty.students_count), 0)', 'students')
      .where('faculty.is_active = true')
      .getRawOne<{ faculties: string; students: string }>();
    const departments = await this.departmentRepo.count();
    return {
      faculties: Number(raw?.faculties ?? 0),
      departments,
      students: Number(raw?.students ?? 0),
    };
  }

  private async findDepartment(id: string): Promise<Department> {
    const department = await this.departmentRepo.findOne({ where: { id }, relations: { translations: true } });
    if (!department) throw new NotFoundException('Kafedra topilmadi');
    return department;
  }

  private localize(faculty: Faculty, lang: Locale, withDetails: boolean): LocalizedFacultyDto {
    const translation = pickTranslation(faculty.translations, lang);
    const departments = faculty.departments ?? [];
    return {
      id: faculty.id,
      slug: faculty.slug,
      locale: translation?.locale ?? lang,
      name: translation?.name ?? '',
      shortDescription: translation?.shortDescription ?? null,
      deanName: translation?.deanName ?? null,
      address: translation?.address ?? null,
      image: faculty.image,
      icon: faculty.icon,
      phone: faculty.phone,
      email: faculty.email,
      studentsCount: faculty.studentsCount,
      departmentsCount: departments.length,
      ...(withDetails
        ? {
            description: translation?.description ?? null,
            departments: departments.map((department) => this.localizeDepartment(department, lang)),
          }
        : {}),
    };
  }

  private localizeDepartment(department: Department, lang: Locale): LocalizedDepartmentDto {
    const translation = pickTranslation(department.translations, lang);
    return {
      id: department.id,
      name: translation?.name ?? '',
      description: translation?.description ?? null,
      headName: translation?.headName ?? null,
      phone: department.phone,
      email: department.email,
    };
  }

  private assertLocales(translations: { locale: Locale }[]): void {
    if (!hasUniqueLocales(translations)) throw new BadRequestException('Har bir til faqat bir marta berilishi kerak');
  }

  private async uniqueSlug(source: string, excludeId?: string): Promise<string> {
    const base = slugify(source) || randomSuffix();
    let candidate = base;
    while (true) {
      const existing = await this.facultyRepo.findOne({ where: { slug: candidate }, select: { id: true } });
      if (!existing || existing.id === excludeId) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }
  }
}
