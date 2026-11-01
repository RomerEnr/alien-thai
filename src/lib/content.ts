import { getCollection, getEntries, getEntry, type CollectionEntry, type CollectionKey } from 'astro:content';

type Ordered = { data: { order: number } };

const byOrder = (a: Ordered, b: Ordered) => a.data.order - b.data.order;

/** Every entry of an ordered collection, in the order its content declares. */
async function getOrdered<C extends CollectionKey>(collection: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);
  return (entries as unknown as (CollectionEntry<C> & Ordered)[]).sort(byOrder);
}

export const getTeachers = () => getOrdered('teachers');
export const getPlans = () => getOrdered('plans');
export const getStoryChapters = () => getOrdered('story');
export const getGalleryItems = () => getOrdered('gallery');

export type DisciplineWithTeacher = CollectionEntry<'disciplines'> & { teacher: CollectionEntry<'teachers'> };

/** Disciplines, each with its teacher resolved from the reference. */
export async function getDisciplines(): Promise<DisciplineWithTeacher[]> {
  const disciplines = await getOrdered('disciplines');
  const teachers = await getEntries(disciplines.map((d) => d.data.teacher));
  return disciplines.map((discipline, i) => ({ ...discipline, teacher: requireEntry(teachers[i], discipline.data.teacher.id) }));
}

export async function getDiscipline(id: string): Promise<CollectionEntry<'disciplines'>> {
  return requireEntry(await getEntry('disciplines', id), id);
}

function requireEntry<T>(entry: T | undefined, id: string): T {
  if (!entry) throw new Error(`Missing content entry "${id}"`);
  return entry;
}
