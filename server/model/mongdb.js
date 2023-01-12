const mongoose = require('mongoose')

const LimitedSchema = new mongoose.Schema({
	record: { type: String, required: true },
	date: {
		type: Number,
		default: Date.now
	}
})

const model = mongoose.model('LimitedModel', LimitedSchema)

module.exports = model