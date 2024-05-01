/**
 * @file This file defines the SMHI station model.
 * @module models
 * @author Fredrik Svensson
 * @version 0.1.0
 * @since 0.1.0
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'A unique station key is required.'],
    unique: true,
    trim: true,
    minLength: [1, 'The station key must be of minimum length 1 characters.'],
  },
  stationname: {
    type: String,
    required: [true, 'A station name is required.'],
    trim: true,
    minLength: [1, 'The station name must be of minimum length 1 characters.'],
  },
  location: {
    type: { 
      type: String, 
      default: 'Point',
      required: true
    },
    coordinates: { 
      type: [Number], 
      required: true
    }
  },
  owner: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

schema.index({ location: '2dsphere' })

export const SMHIStation = mongoose.model('SMHIStation', schema)
