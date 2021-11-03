import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopCategory } from '../top-page.model';

export class HhDataDto {
  @IsNumber()
  @ApiProperty()
  count: number;

  @IsNumber()
  @ApiProperty()
  juniorSalary: number;

  @IsNumber()
  @ApiProperty()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class TopPageAdvantageDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  desctiption?: string;
}

export class CreateTopPageDto {
  @IsEnum(TopCategory)
  firstCateegory: TopCategory;

  @IsString()
  @IsOptional()
  secondCategory?: string;

  @IsString()
  @ApiProperty()
  alias: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  category: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => HhDataDto)
  hh?: HhDataDto;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantageDto)
  advatages: TopPageAdvantageDto[];

  @IsString()
  @ApiProperty()
  seoText: string;

  @IsString()
  @ApiProperty()
  tagsTitle: string;

  @IsArray()
  @ApiProperty()
  @IsString({ each: true })
  tags: string[];
}
