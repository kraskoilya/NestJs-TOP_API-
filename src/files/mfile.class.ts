export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | MFile) {
    Object.assign(this, file);
  }
}
