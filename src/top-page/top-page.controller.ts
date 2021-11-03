import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND } from './top-page.constants';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Get('index')
  async getItems() {
    const pages = await this.topPageService.getItems();

    if (!pages.length) {
      return [];
    }

    return pages;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    const topPage = await this.topPageService.create(dto);
    if (!topPage) {
      throw new ValidationError();
    }
    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    const topPage = await this.topPageService.get(id);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Get('byAlias/:alias')
  async byAlias(@Param('alias') alias: string) {
    const topPage = await this.topPageService.getByAlias(alias);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const topPage = await this.topPageService.delete(id);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
    const topPage = await this.topPageService.update(id, dto);

    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get('search/:text')
  async search(@Param('text') search: string) {
    return this.topPageService.findByText(search);
  }
}
