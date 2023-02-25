import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { user } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { AdminGuard, UserGuard } from 'src/auth/guard/auth.guard';
import { APISummaries } from 'src/helpers/helpers';
import { HandleReportDto, ReportDto } from './dto/report.dto';
import { ReportModel } from './model/report.model';
import { ReportService } from './report.service';

type UserType = Pick<user, 'role' | 'id' | 'username'>;

@ApiTags('REPORT')
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ReportModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get()
  getAllReports(@GetUser() user: UserType): Promise<ReportModel[]> {
    return this.reportService.getAllReports({
      role: user.role,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ReportModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Get(':id')
  getReportById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserType,
  ): Promise<ReportModel> {
    return this.reportService.getReportById(id, {
      role: user.role,
      id: user.id,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: APISummaries.USER })
  @ApiOkResponse({ type: ReportModel })
  @ApiBearerAuth()
  @UseGuards(UserGuard)
  @Post()
  createReport(
    @Body() dto: ReportDto,
    @GetUser() user: UserType,
  ): Promise<ReportModel> {
    return this.reportService.createReport(dto, {
      role: user.role,
      id: user.id,
      username: user.username,
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: ReportModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Put(':id')
  handleReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: HandleReportDto,
  ): Promise<ReportModel> {
    return this.reportService.handleReport(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: APISummaries.ADMIN })
  @ApiOkResponse({ type: ReportModel })
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @Delete(':id')
  deleteReportById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReportModel> {
    return this.reportService.deleteReportById(id);
  }
}
