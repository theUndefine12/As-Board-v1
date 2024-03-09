import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getProfile(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
        
        return this.userFields(user)
    }

    private userFields(user: User) {
        return {
            id: user.id,
            title: user.title,
            image: user.iamge,
            email: user.email,
            // dashboardsCount
        }
    }
}
