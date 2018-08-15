export type DraftTFClass =
	'Scout' | 'Soldier' | 'Roamer' |
	'Pocket' | 'Pyro' | 'Demoman' |
	'Heavy' | 'Engineer' | 'Medic' |
	'Sniper' | 'Spy' | 'Flex' ;

export interface DraftTFClassList {
  name: DraftTFClass;
  numberPerTeam: number;
}
