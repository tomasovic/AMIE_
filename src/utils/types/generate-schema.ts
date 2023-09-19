import {appendFile, readdir, readFileSync, stat, unlink, writeFileSync} from 'fs-extra';
import {extname, join} from 'path';
import {glob} from 'glob';
import * as fs from "fs";
import {mergeTypeDefs} from '@graphql-tools/merge';
import {print} from 'graphql';

const readGraphqlFiles = async (dir: string, typesArray: string[]) => {
    const files = await readdir(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        if ((await stat(filePath)).isDirectory()) {
            await readGraphqlFiles(filePath, typesArray);
        } else if (extname(file) === '.graphql') {
            const schema = readFileSync(filePath, 'utf8');
            typesArray.push(schema);
        }
    }
}

const globGenerateSchema = async () => {
    const readFiles = glob.sync('./src/api/**/*.graphql').map((file) => fs.readFileSync(file, {encoding: 'utf-8'}));

    try {
        await unlink('schema.graphql');
        writeFileSync('schema.graphql', '# generated Schema - do not edit # \n\n', {flag: 'a+', mode: 0o777});
    } catch (error) {
        console.log('Types generation error', error);
    }

    const typeDefs = print(mergeTypeDefs(readFiles));

    appendFile('schema.graphql', typeDefs, (err) => {
        if (err) throw err;
    });

    console.info('Graphql schema generated');
}

globGenerateSchema()