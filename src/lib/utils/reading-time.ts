const WORDS_PER_MINUTE = 200

export function calculateReadingTime(content: string): number {
  // Remove markdown syntax for more accurate word count
  const plainText = content
    .replace(/#{1,6}\s/g, '') // headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
    .replace(/\*([^*]+)\*/g, '$1') // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // code blocks
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
    .replace(/[-*+]\s/g, '') // list markers
    .replace(/\n+/g, ' ') // newlines
    .trim()

  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE)
  
  return Math.max(1, readingTime) // Minimum 1 minute
}

export function formatReadingTime(minutes: number, locale: string = 'pt-BR'): string {
  if (locale === 'pt-BR') {
    return `${minutes} min de leitura`
  }
  return `${minutes} min read`
}
