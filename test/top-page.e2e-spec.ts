import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect, Types } from 'mongoose';
import { CreateTopPageDto } from 'src/top-page/dto/create-top-page.dto';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { TOP_PAGE_NOT_FOUND } from '../src/top-page/top-page.constants';

const topPageId = new Types.ObjectId().toHexString();

const testDto: CreateTopPageDto = {
  title: 'top page 3',
  category: 'top page category 2',
  advatages: [
    {
      title: 'advatages 2',
      desctiption: 'advatages desctiption',
    },
  ],
  seoText: 'SEO',
  tagsTitle: 'tag',
  tags: ['tag', 'tag2'],
};

const loginDto: AuthDto = {
  login: 'a2@a.com',
  password: '1',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    token = body.access_token;
  });

  it('/top-page/index (GET) - success', async () => {
    await request(app.getHttpServer())
      .get('/top-page/index ')
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/top-page/create (POST) - success', async () => {
    await request(app.getHttpServer())
      .post('/top-page/create ')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/top-page/create  (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/top-page/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ ...testDto, tags: 0 })
      .expect(400);
  });

  it('/top-page/:id (GET) - success', async () => {
    await request(app.getHttpServer())
      .get('/top-page/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.title).toBeDefined();
      });
  });

  it('/top-page/:id (GET) - fail', async () => {
    await request(app.getHttpServer())
      .get('/top-page/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: TOP_PAGE_NOT_FOUND,
        error: 'Not Found',
      });
  });

  it('/top-page/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/top-page/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/top-page/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: TOP_PAGE_NOT_FOUND,
        error: 'Not Found',
      });
  });

  afterAll(() => {
    disconnect();
  });
});
