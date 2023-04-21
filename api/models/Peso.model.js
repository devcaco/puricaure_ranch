const { Schema, model } = require('mongoose');

const pesoSchema = new Schema(
  {
    fecha: {
      type: Date,
      required: [true, 'La fecha del peso es Requerido'],
    },
    stock: {
      type: Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    tipo: {
      type: String,
      enum: ['compra', 'venta', 'control'],
      required: true,
      default: 'control',
    },
    peso: { type: Number, required: true },
    unidad: { type: String, enum: ['kg', 'grm', 'lb'], default: 'kg' },
  },
  {
    timestamps: true,
  }
);

const Peso = model('Peso', pesoSchema);

module.exports = Peso;
