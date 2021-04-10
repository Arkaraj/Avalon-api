/* eslint-disable @typescript-eslint/naming-convention */

import { model, Schema, Document, Types } from 'mongoose';

export interface UserInterface extends Document {
    githubId: string | null;
    name: string | undefined;
    tasks: Array<Types.ObjectId | null>;
}

const UserSchema: Schema = new Schema({
    githubId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

// const User: Model<UserInterface> = model('User', UserSchema);
export default model<UserInterface>('User', UserSchema);