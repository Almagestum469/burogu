import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

/* PetSchema will correspond to a collection in your MongoDB database. */
const BlogSchema = new mongoose.Schema({
    id: { type: String, default: nanoid() },
    cover_img: { type: String, default: '' },
    title: String,
    author: { type: String, default: 'Me' },
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    meta: {
        tag: { type: [String], default: ['Uncategorized'] },
        hidden: { type: Boolean, default: false },
        votes: { type: Number, default: 0 },
        favs: { type: Number, default: 0 },
        language: { type: String, default: 'cn' },
        readingTime: {
            minutes: { type: Number, default: 0 },
            words: { type: Number, default: 0 },
            text: { type: String, default: '' },
        },
    },
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)