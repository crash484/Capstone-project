import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'lib', 'python_modules', 'outputs', 'forecast_output.json')
    const raw = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(raw)
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error reading forecast output:', error)
    return NextResponse.json({ error: 'Could not read forecast output' }, { status: 500 })
  }
}
