import { Utils } from './lib/utils.js'

import 'dotenv/config'

export default function main() {
	const utils = new Utils()
	console.log(`Value of TEST_ENV_VAR is '${process.env.TEST_ENV_VAR}'`)
}

main()
