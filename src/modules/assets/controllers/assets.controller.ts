import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile as UploadedFileType } from '../../common/interfaces/uploaded-file.interface';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AssetsService } from '../pipes/services/assets.service';
import { FileSizeValidatorPipe } from '../pipes/file-size.pipe';

@ApiTags('Assets')
@Controller('v1/assets')
export class AssetsController {
  constructor(private readonly assetService: AssetsService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file to the server' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
    schema: { example: { url: 'https://example.com/file.jpg' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or file size exceeded the limit.',
  })
  
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileSizeValidatorPipe)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
      }),
    )
    file: UploadedFileType,
  ): Promise<{ url: string }> {
    const url = await this.assetService.saveFile(file);
    return { url };
  }
}
