import DraftTFClass from '../Enums/DraftTFClass';

/**
 * Used to store data by class.
 * @typedef TFClassesTracker
 * @property {number} scout
 * @property {number} soldier
 * @property {number} pyro
 * @property {number} demoman
 * @property {number} engineer
 * @property {number} heavy
 * @property {number} medic
 * @property {number} sniper
 * @property {number} spy
 */
class TFClassesTracker {
  Scout: number = 0;
  Soldier: number = 0;
  Pyro: number = 0;
  Demoman: number = 0;
  Heavy: number = 0;
  Engineer: number = 0;
  Medic: number = 0;
  Sniper: number = 0;
  Spy: number = 0;
  Flex: number = 0;
  Pocket: number = 0;
  Roamer: number = 0; 
  total: number = 0;
}

export default TFClassesTracker;