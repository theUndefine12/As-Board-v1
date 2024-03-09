import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { TokenDto } from './dto/token.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(info: AuthDto) {
        const isUser = await this.prisma.user.findUnique({
            where: {
                email: info.email
            }
        })
        if(isUser) {
            throw new BadRequestException('User already exist')
        }

        const hash = bcrypt.hashSync(info.password, 7)
        const user = await this.prisma.user.create({
            data: {
                title: faker.person.firstName(),
                iamge: faker.image.avatar(),
                email: info.email,
                password: hash
            }
        })

        const tokens = await this.issueTokens(user.id)        
        return {
            user: this.userFields(user),
            ...tokens
        }
    }

    async login(data: AuthDto) {
        const user = await this.validateUser(data)
        const tokens = await this.issueTokens(user.id)

        return {
            user: this.userFields(user),
            ...tokens
        }
    }

    async refresh(info: TokenDto) {
        const result = await this.jwt.verifyAsync(info.refreshToken)
        if(!result) {
            throw new UnauthorizedException('Invalid Token')
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: result.id
            }
        })
        
        const tokens = await this.issueTokens(user.id)
        return {
            user: this.userFields(user),
            ...tokens
        }
    }

    private async issueTokens(userId: string) {
        const data = {id: userId}

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '1d'
        })

        return {accessToken, refreshToken}
    }

    private userFields(user: User) {
        return {
            id: user.id,
            title: user.title,
            image: user.iamge,
            email: user.email
        }
    }

    private async validateUser(info: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: info.email
            }
        })
        if(!user) {
            throw new NotFoundException('User is not found')
        }

        const verifyPassword = bcrypt.compareSync(info.password, user.password)
        if(!verifyPassword) {
            throw new BadRequestException('Password is not correct')
        }

        return user
    }
}
