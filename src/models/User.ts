import { Schema, model, Document } from 'mongoose';

import Password from '../services/password';

interface UserInterface extends Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new Schema<UserInterface>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})

const User = model<UserInterface>('User', userSchema);

const user = new User({
    email: 'arti.mucha@gmail.com',
    password: '12345678'
});

export default User;