import * as path from 'path';

export function getFontFileName(filePath: string): string {
    const fileName = path.basename(filePath);
    return fileName.replace(path.extname(fileName), '');
}