import { fileURLToPath } from 'url'
import { mkdir, access, readdir, readFile } from 'fs/promises'
import { dirname } from 'path'
import { resolve, isAbsolute } from 'path'
import { constants } from 'fs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Database from 'better-sqlite3'

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let IS_PACKAGED = false

if (process.pkg) {
	IS_PACKAGED = true
	console.log('info: Running in packaged mode')
} else {
	console.log('info Running as a script')
}

// console.log(`__dirname: ${__dirname}
// __filename: ${__filename}`)

const argv = yargs(hideBin(process.argv))
	.option('data', {
		alias: 'd',
		type: 'string',
		description: 'Data directory path for the database (must be absolute)',
		demandOption: true,
		coerce: (arg) => {
			if (IS_PACKAGED === true && !isAbsolute(arg)) {
				throw new Error('Data path must be an absolute path')
			}
			return arg
		},
	})
	.option('schema', {
		alias: 's',
		type: 'string',
		description: 'Schema file path (must be absolute)',
		demandOption: true,
		coerce: (arg) => {
			if (IS_PACKAGED === true && !isAbsolute(arg)) {
				throw new Error('Schema path must be an absolute path')
			}
			return arg
		},
	})
	.help()
	.alias('help', 'h')
	.example('$0 -d /path/to/data -s /path/to/schema.sql', 'Start with absolute paths')
	.example('$0 --data=/path/to/data --schema=/path/to/schema.sql', 'Start with long options')
	.strict().argv

// console.log('Parsed arguments:', { data: argv.data, schema: argv.schema })

const SchemaQuery = `SELECT 
    m.name AS table_name,
    p.name AS column_name,
    p.type AS column_type
FROM 
    sqlite_master m
LEFT OUTER JOIN 
    pragma_table_info(m.name) p
WHERE 
    m.type = 'table' 
    AND m.name NOT LIKE 'sqlite_%'
ORDER BY 
    m.name, p.cid;`

;(async () => {
	const dbHandle = new Database(`${argv.data}/server.sqlite`)
	if (!access(`${argv.schema}`, constants.F_OK)) {
		console.error(`Missing schema file: ${argv.schema}`)
	} else {
		const schemaContent = await readFile(argv.schema, 'utf8')
		dbHandle.exec(schemaContent)

		console.log(`Schema loaded from ${argv.schema}`)

		let result = dbHandle.prepare(SchemaQuery).all()

		// console.log('results:', result)
	}
})()
