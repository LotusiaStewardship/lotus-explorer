import { Schema, model } from 'mongoose';
/**
 * Tx stores transaction information used to derive:
 * - address indexes
 * - burned supply
 * - etc.
 */
export type Document = {
  txid: string,
  size: number,
  fee: number,
  vin: Array<{
    addresses: string,
    amount: number,
    num_inputs: number
  }>,
  vout: Array<{
    addresses: string,
    amount: number,
    asm?: string,
  }>,
  total?: number,
  timestamp: number,
  localeTimestamp?: string,
  blockhash: string,
  blockindex: number,
  burned: number,
  balance?: number,
};
const TxSchema = new Schema<Document>({
  txid: { type: String, lowercase: true, unique: true, index: true},
  size: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  vin: { type: <Document['vin']>[], default: [] },
  vout: { type: <Document['vout']>[], default: [] },
  total: { type: Number, default: 0, index: true },
  timestamp: { type: Number, default: 0, index: true },
  localeTimestamp: { type: String }, // for jqPlot charts
  blockhash: { type: String, index: true },
  blockindex: {type: Number, default: 0, index: true},
  burned: { type: Number, default: 0 }
}, {id: false});
TxSchema.index({ total: 1, blockindex: 1 });
export const Model = model('Tx', TxSchema);
