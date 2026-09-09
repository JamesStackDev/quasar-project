import type { Translation } from '@/types/interfaces/Translation'
import axiosService from './interceptors/Api'

export async function getAllTranslations(): Promise<Translation[]> {
  const res = await axiosService.get('/translations')

  return res.data
}

export async function getTranslation(id: string): Promise<Translation> {
  const res = await axiosService.get(`/translations/${id}`)

  if (!res.data) {
    throw new Error('Translation not found')
  }

  return res.data
}

export async function getTranslationsByTask(
  taskId: string
): Promise<Translation[]> {
  const res = await axiosService.get(`/translations?taskId=${taskId}`)

  return res.data
}

export async function getTranslationByLocale(
  taskId: string,
  locale: string
): Promise<Translation | null> {
  const res = await axiosService.get(
    `/translations?taskId=${taskId}&locale=${locale}`
  )

  return res.data[0] ?? null
}

export async function createTranslations(
  translation: Translation
): Promise<Translation> {
  const res = await axiosService.post('/translations', translation)

  return res.data
}

export async function updateTranslations(
  id: string,
  translation: Partial<Translation>
): Promise<Translation> {
  const res = await axiosService.patch(`/translations/${id}`, translation)

  return res.data
}

export async function deleteTranslations(id: string): Promise<void> {
  await axiosService.delete(`/translations/${id}`)
}