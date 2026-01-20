import slugifyLib from 'slugify'

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'pt',
    remove: /[*+~.()'"!:@]/g,
  })
}

export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  let slug = slugify(text)
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${slugify(text)}-${counter}`
    counter++
  }
  
  return slug
}
