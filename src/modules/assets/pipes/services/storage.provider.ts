export interface StorageProvider {
  upload(
    fileBuffer: Buffer,
    fileName: string,
    folderName?: string,
  ): Promise<string>;
  delete(fileUrl: string): Promise<void>;
}
