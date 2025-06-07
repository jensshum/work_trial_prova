import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let server: any

beforeAll(async () => {
  // Start the Next.js server
  server = exec('npm run dev')
  
  // Wait for the server to start
  await new Promise((resolve) => setTimeout(resolve, 5000))
})

afterAll(async () => {
  // Kill the server process
  if (server) {
    server.kill()
  }
}) 