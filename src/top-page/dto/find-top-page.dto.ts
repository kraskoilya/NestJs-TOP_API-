import { IsEnum } from 'class-validator';
import { TopCategory } from '../top-page.model';

export class FindTopPageDto {
  @IsEnum(TopCategory)
  firstCategory: TopCategory;
}
