import { join } from 'path'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// db.json file path
const file = join('./tmp/', 'db.json')
////console.log(file)

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file)
const defaultData = { prompts: [], models: [] }
const db = new Low(adapter, defaultData)
await db.read();

export default db;