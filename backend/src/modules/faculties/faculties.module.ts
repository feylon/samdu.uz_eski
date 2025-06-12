import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentTranslation } from './entities/department-translation.entity';
import { Department } from './entities/department.entity';
import { FacultyTranslation } from './entities/faculty-translation.entity';
import { Faculty } from './entities/faculty.entity';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, FacultyTranslation, Department, DepartmentTranslation])],
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
