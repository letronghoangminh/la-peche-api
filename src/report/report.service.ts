import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Role } from 'src/enum/role.enum';
import { ErrorMessages } from 'src/helpers/helpers';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleReportDto, ReportDto } from './dto/report.dto';
import { ReportModel } from './model/report.model';

@Injectable()
export class ReportService {
  constructor(private prismaService: PrismaService) {}

  async getAllReports(user: {
    role: string;
    username: string;
  }): Promise<ReportModel[]> {
    if (user.role === Role.ADMIN)
      return await this.prismaService.report.findMany();
    return await this.prismaService.report.findMany({
      where: {
        reporterName: user.username,
      },
    });
  }

  async getReportById(
    id: number,
    user: { role: string; id: number; username: string },
  ): Promise<ReportModel> {
    const condition = {
      id: id,
    };

    if (!(user.role === Role.ADMIN)) condition['reporterName'] = user.username;

    const report = await this.prismaService.report.findFirst({
      where: condition,
    });

    if (report) {
      return report;
    } else {
      throw new NotFoundException(ErrorMessages.REPORT.REPORT_NOT_FOUND);
    }
  }

  async createReport(
    dto: ReportDto,
    user: { role: string; id: number; username: string },
  ): Promise<ReportModel> {
    try {
      if (
        dto.reporterName === user.username &&
        !(dto.reporterName === dto.targetName)
      ) {
        const report = await this.prismaService.report.create({
          data: {
            reason: dto.reason,
            category: dto.category,
            reporter: {
              connect: {
                username: dto.reporterName,
              },
            },
            target: {
              connect: {
                username: dto.targetName,
              },
            },
          },
        });

        if (report) {
          return report;
        }
      } else {
        throw new ForbiddenException(ErrorMessages.REPORT.USERNAME_INVALID);
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(ErrorMessages.REPORT.USERNAME_INVALID);
        }
      }
      throw error;
    }
  }

  async handleReport(id: number, dto: HandleReportDto): Promise<ReportModel> {
    const report = await this.prismaService.report.findFirst({
      where: {
        id: id,
      },
    });

    if (report) {
      return await this.prismaService.report.update({
        where: {
          id: id,
        },
        data: {
          reason: dto.reason,
          status: dto.status,
          category: dto.category,
        },
      });
    } else {
      throw new NotFoundException(ErrorMessages.REPORT.REPORT_NOT_FOUND);
    }
  }

  async deleteReportById(id: number): Promise<ReportModel> {
    const report = await this.prismaService.report.findFirst({
      where: {
        id: id,
      },
    });

    if (report) {
      return await this.prismaService.report.delete({
        where: {
          id: id,
        },
      });
    } else {
      throw new NotFoundException(ErrorMessages.REPORT.REPORT_NOT_FOUND);
    }
  }
}
