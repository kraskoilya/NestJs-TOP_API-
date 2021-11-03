import { Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopCategory, TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async get(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async getByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async delete(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getItems() {
    return this.topPageModel.find().exec();
  }

  async findByCategory(firstCateegory: TopCategory) {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCateegory,
          },
        },
        {
          $group: {
            _id: {
              secondCategory: '$secondCategory',
            },
            pages: {
              $push: { _id: '$_id', alias: '$alias', title: '$title' },
            },
          },
        },
      ])
      .exec();
  }

  async findByText(text: string) {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }
}
