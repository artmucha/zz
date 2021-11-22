import { Schema, model, Document } from 'mongoose';

interface PostInterface extends Document {
    title: string;
    description: string;
    location: string;
    type: string,
    category: string,
    price: string;
    userId: string,
    date: string,
    slug: string,
    image: string,
}

const postSchema = new Schema<PostInterface>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: String,
    },
    userId: {
        type: String,
    },
    date: {
        type: String,
    },
    slug: {
        type: String,
    },
    image: {
        type: String,
    }
},
{
    timestamps: { createdAt: true, updatedAt: true }
}
);

const Post = model<PostInterface>('Post', postSchema);

export default Post;