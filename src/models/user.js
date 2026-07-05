import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, trim: true },
    email: { type: String, unique: true, require: true, trim: true },
    password: { type: String, require: true, min: 8 },
  },
  {
    timestamp: true,
    versionKey: false,
  },
);

// Встановлення username таким самим, як email
userSchema.pre('save', async function () {
  if (!this.username) {
    this.username = this.email;
  }
});

// Видалення пароля із об'єкта користувача перед відправкою у відповідь
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('User', userSchema);
