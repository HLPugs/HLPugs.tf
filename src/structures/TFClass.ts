/**
 * @typedef TFClassReadable
 */
export type TFClassReadable = string | number;

/**
 * Describes a TF2 class.
 * @typedef TFClass
 * @property {number} id - The class's unique ID.
 * @property {string} name - The class's unique name.
 */
export class TFClass {
  id: number;
  name: string;

    /**
     * Creates a new DraftTFClass object.
     * @param {TFClassReadable} readable - The class id/name.
     */
  constructor(readable: TFClassReadable) {
    if (typeof readable === 'string') {
      if (readable.match(/scout/i)) {
        this.id = 0;
        this.name = 'scout';
      } if (readable.match(/sol/i)) {
        this.id = 1;
        this.name = 'soldier';
      } if (readable.match(/pyro/i)) {
        this.id = 2;
        this.name = 'pyro';
      } if (readable.match(/demo/i)) {
        this.id = 3;
        this.name = 'demoman';
      } if (readable.match(/heavy/i)) {
        this.id = 4;
        this.name = 'heavy';
      } if (readable.match(/eng/i)) {
        this.id = 5;
        this.name = 'engineer';
      } if (readable.match(/med/i)) {
        this.id = 6;
        this.name = 'medic';
      } if (readable.match(/sniper/i)) {
        this.id = 7;
        this.name = 'sniper';
      } if (readable.match(/spy/i)) {
        this.id = 8;
        this.name = 'spy';
      } else throw new Error('No class found that matches parameters.');
    } else {
      if (readable === 0) {
        this.id = 0;
        this.name = 'scout';
      } if (readable === 1) {
        this.id = 1;
        this.name = 'soldier';
      } if (readable === 2) {
        this.id = 2;
        this.name = 'pyro';
      } if (readable === 3) {
        this.id = 3;
        this.name = 'demoman';
      } if (readable === 4) {
        this.id = 4;
        this.name = 'heavy';
      } if (readable === 5) {
        this.id = 5;
        this.name = 'engineer';
      } if (readable === 6) {
        this.id = 6;
        this.name = 'medic';
      } if (readable === 7) {
        this.id = 7;
        this.name = 'sniper';
      } if (readable === 8) {
        this.id = 8;
        this.name = 'spy';
      } else throw new Error('No class found that matches parameters.');
    }
  }
}
