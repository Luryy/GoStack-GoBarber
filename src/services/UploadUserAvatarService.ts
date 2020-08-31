import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

interface RequestDTO {
    user_id: string;
    avatarFileName: string;
}

class UpdateUserAvatarService {
    public async execute({
        user_id,
        avatarFileName,
    }: RequestDTO): Promise<User> {
        const userRepository = getRepository(User);

        const user = await userRepository.findOne(user_id);

        if (!user) {
            throw new AppError('Only authenticated users can change avatar.');
        }

        if (user.avatar) {
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );
            const userAvatarExists = await fs.promises.stat(userAvatarFilePath);
            if (userAvatarExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        user.avatar = avatarFileName;

        await userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
