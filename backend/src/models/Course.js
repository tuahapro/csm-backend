import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		duration: { type: String, required: true },
		category: { type: String, required: true },
		instructorName: { type: String, required: true },
		courseImage: { type: String },
		creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
	},
	{ timestamps: true }
)

export const Course = mongoose.model('Course', courseSchema)


