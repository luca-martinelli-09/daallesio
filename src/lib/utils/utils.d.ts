export interface IngredientsGroup {
	name?: string;
	ingredients: Ingredient[];
}

export interface Ingredient {
	id: string;
	name: string;
	plural: string;
	vegan: boolean;
	vegetarian: boolean;
	amount?: number;
	unit?: string;
	fixed: boolean = false;
	info?: string;
}

interface OriginPlace {
	city?: string;
	region?: string;
	nation?: string;
	area?:
		| 'nord europa'
		| 'europa mediterranea'
		| 'europa orientale'
		| 'nord america'
		| 'sud america'
		| 'asia orientale'
		| 'asia occidentale';
	continent: 'asia' | 'africa' | 'europa' | 'america' | 'oceania';
	lat?: number;
	lon?: number;
}

interface PreparationTime {
	preparation: number;
	rest?: number;
	cook?: number;
}

interface Source {
	type: 'youtube' | 'tiktok' | 'instagram' | 'blog' | 'book';
	ref: string;
	name: string;
}

export type RecipeType =
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

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Recipe {
	id: string;
	date: Date;
	draft: boolean;
	type: RecipeType;
	title: string;
	description: string;
	image: string;
	originPlace?: OriginPlace;
	difficulty: Difficulty;
	time: PreparationTime;
	units: number;
	ingredients: IngredientsGroup[];
	references: Source[];
	vegan?: boolean;
	vegetarian?: boolean;
	related?: Recipe[] | string[];
}

export interface SearchOptions {
	type?: RecipeType;
	difficulty?: Difficulty;
	vegan?: boolean;
	vegetarian?: boolean;
	originPlace?: OriginPlace;
}
