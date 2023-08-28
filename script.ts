
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

async function renameAndMoveIcons(directoryPath, targetDirectory) {
    const files = await fs.promises.readdir(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
            await renameAndMoveIcons(filePath, targetDirectory);
        } else if (stats.isFile() && file === '24px.svg') {
            const variant = path.basename(path.dirname(filePath)).split('materialicons')[1]
            const grandparentDirectoryName = path.basename(path.dirname(path.dirname(filePath)));
            const newFileName = `${grandparentDirectoryName}${variant}.svg`;
            const newFilePath = path.join(targetDirectory, newFileName);

            await mkdir(targetDirectory, { recursive: true });
            await copyFile(filePath, newFilePath);

            console.log(`Renamed and moved: ${file} -> ${newFileName}`);
        }
    }
}

const sourceDirectory = '../mat-icons/src';
const targetDirectory = './src';

renameAndMoveIcons(sourceDirectory, targetDirectory)
    .then(() => console.log('Done!'))
    .catch(error => console.error('Error:', error));
