import Gamemode from '../Enums/Gamemode';
import DraftTFClass from '../Enums/DraftTFClass';
import GamemodeClassScheme from '../Models/GamemodeScheme';

const GamemodeSchemes: Map<Gamemode, GamemodeClassScheme[]> = new Map();

GamemodeSchemes.set(Gamemode.Highlander, [
	new GamemodeClassScheme(1, DraftTFClass.SCOUT),
	new GamemodeClassScheme(1, DraftTFClass.SOLDIER),
	new GamemodeClassScheme(1, DraftTFClass.PYRO),
	new GamemodeClassScheme(1, DraftTFClass.DEMOMAN),
	new GamemodeClassScheme(1, DraftTFClass.HEAVY),
	new GamemodeClassScheme(1, DraftTFClass.ENGINEER),
	new GamemodeClassScheme(1, DraftTFClass.MEDIC),
	new GamemodeClassScheme(1, DraftTFClass.SNIPER),
	new GamemodeClassScheme(1, DraftTFClass.SPY)
]);

GamemodeSchemes.set(Gamemode.Prolander, [
	new GamemodeClassScheme(1, DraftTFClass.SCOUT),
	new GamemodeClassScheme(1, DraftTFClass.SOLDIER),
	new GamemodeClassScheme(1, DraftTFClass.DEMOMAN),
	new GamemodeClassScheme(1, DraftTFClass.MEDIC),
	new GamemodeClassScheme(1, DraftTFClass.SNIPER),
	new GamemodeClassScheme(2, DraftTFClass.FLEX)
]);

GamemodeSchemes.set(Gamemode.Sixes, [
	new GamemodeClassScheme(2, DraftTFClass.SCOUT),
	new GamemodeClassScheme(1, DraftTFClass.ROAMER),
	new GamemodeClassScheme(1, DraftTFClass.POCKET),
	new GamemodeClassScheme(1, DraftTFClass.DEMOMAN),
	new GamemodeClassScheme(1, DraftTFClass.MEDIC)
]);

GamemodeSchemes.set(Gamemode.Fours, [
	new GamemodeClassScheme(1, DraftTFClass.SCOUT),
	new GamemodeClassScheme(1, DraftTFClass.DEMOMAN),
	new GamemodeClassScheme(1, DraftTFClass.FLEX),
	new GamemodeClassScheme(1, DraftTFClass.MEDIC)
]);

GamemodeSchemes.set(Gamemode.Ultiduo, [
	new GamemodeClassScheme(1, DraftTFClass.SOLDIER),
	new GamemodeClassScheme(1, DraftTFClass.MEDIC)
]);

export default GamemodeSchemes;
