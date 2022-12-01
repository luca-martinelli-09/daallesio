export interface Ingredient {
	id: string;
	name: string;
	plural: string;
	vegan: boolean;
	vegetarian: boolean;
	amount?: number;
	unit?: string;
}

interface OriginPlace {
	name: string;
	maps?: string;
}

interface PreparationTime {
	preparation?: number;
	rest?: number;
}

interface Source {
	type: 'youtube' | 'tiktok' | 'instagram' | 'blog' | 'book';
	ref: string;
}

export interface Recipe {
	id: string;
	date: Date;
	draft: boolean;
	tags?: string[];
	type:
		| 'antipasto'
		| 'primo'
		| 'secondo'
		| 'dolce'
		| 'contorno'
		| 'pane'
		| 'salsa'
		| 'condimento'
		| 'cocktail'
		| 'liquore';
	title: string;
	description: string;
	originPlace?: OriginPlace;
	difficulty: 1 | 2 | 3 | 4 | 5;
	time: PreparationTime;
	units: number;
	ingredients: Ingredient[];
	references: Source[];
}
