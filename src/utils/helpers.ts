import fs from 'fs';

export const createFile = (image:string, name:string): string => {
    const data = image.replace(/^data:image\/\w+;base64,/, "");
    const mime = image.split('/')[1].split(';')[0];
    const buffer = Buffer.from(data, 'base64');

    fs.writeFile(`src/upload/media/posts/${name}.${mime}`, buffer, 'base64', (err) => {
        if (err) return console.log(err);
    });

    const url = `/${name}.${mime}`;

    return url;
}