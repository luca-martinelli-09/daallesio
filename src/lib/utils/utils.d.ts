export interface Ingredient {
	id: string;
	name: string;
	plural: string;
	vegan: boolean;
	vegetarian: boolean;
	amount?: number;
	unit?: string;
	fixed: boolean = false;
}

interface OriginPlace {
	city: string;
	region?: string;
	nation: string;
	area?:
		| 'Nord Europa'
		| 'Europa Mediterranea'
		| 'Europa Orientale'
		| 'Nord America'
		| 'Sud America'
		| 'Asia Orientale'
		| 'Asia Occidentale';
	continent: 'Asia' | 'Africa' | 'Europa' | 'Andartide' | 'America' | 'Oceania';
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
}

export interface Recipe {
	id: string;
	date: Date;
	draft: boolean;
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
	image: string;
	originPlace?: OriginPlace;
	difficulty: 1 | 2 | 3 | 4 | 5;
	time: PreparationTime;
	units: number;
	ingredients: Ingredient[];
	references: Source[];
	vegan?: boolean;
	vegetarian?: boolean;
}
