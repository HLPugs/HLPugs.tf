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
  scout: number = 0;
  soldier: number = 0;
  pyro: number = 0;
  demoman: number = 0;
  engineer: number = 0;
  heavy: number = 0;
  medic: number = 0;
  sniper: number = 0;
  spy: number = 0;
  flex: number = 0;
  roamer: number = 0;
  pocket: number = 0;
  total: number = 0;
}

export default TFClassesTracker;