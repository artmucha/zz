import { Schema, model, Document } from 'mongoose';

interface ConversationInterface extends Document {
    date: string,
    messages: { message: string, time: string, user: { login: string, id: string } }[],
}

const conversationSchema = new Schema<ConversationInterface>({
    date: {
        type: String,
    },
    messages: [
        {
            message: String,
            time: String,
            user: {
                login: String,
                id: String
            }
        }
    ]
},
{
    timestamps: { createdAt: true, updatedAt: true }
}
);

const Conversation = model<ConversationInterface>('Conversation', conversationSchema);

export default Conversation;