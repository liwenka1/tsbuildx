import { describe, it, expect } from 'vitest'
import { getEntryType, formatSize, formatDuration } from '../src/utils.js'

describe('getEntryType', () => {
  it('should return "js" for TypeScript files', () => {
    expect(getEntryType('src/index.ts')).toBe('js')
    expect(getEntryType('src/main.mts')).toBe('js')
    expect(getEntryType('src/app.tsx')).toBe('js')
  })

  it('should return "js" for JavaScript files', () => {
    expect(getEntryType('src/index.js')).toBe('js')
    expect(getEntryType('src/main.mjs')).toBe('js')
    expect(getEntryType('src/app.jsx')).toBe('js')
  })

  it('should return "css" for CSS files', () => {
    expect(getEntryType('src/styles.css')).toBe('css')
    expect(getEntryType('src/theme.CSS')).toBe('css')
  })

  it('should return "js" for unknown extensions', () => {
    expect(getEntryType('src/data.json')).toBe('js')
    expect(getEntryType('src/config')).toBe('js')
  })
})

describe('formatSize', () => {
  it('should format bytes', () => {
    expect(formatSize(500)).toBe('500 B')
  })

  it('should format kilobytes', () => {
    expect(formatSize(1024)).toBe('1.00 KB')
    expect(formatSize(2560)).toBe('2.50 KB')
  })

  it('should format megabytes', () => {
    expect(formatSize(1024 * 1024)).toBe('1.00 MB')
    expect(formatSize(1024 * 1024 * 2.5)).toBe('2.50 MB')
  })
})

describe('formatDuration', () => {
  it('should format milliseconds', () => {
    expect(formatDuration(500)).toBe('500ms')
    expect(formatDuration(999)).toBe('999ms')
  })

  it('should format seconds', () => {
    expect(formatDuration(1000)).toBe('1.00s')
    expect(formatDuration(2500)).toBe('2.50s')
  })
})


