import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { DashboardDto } from './dto/dashboard.dto';
import { updateDto } from './dto/update.dto';
import { Dashboard } from '@prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}


    async createDahsboard(userId: string, data: DashboardDto) {
        const dashboard = await this.prisma.dashboard.create({
            data: {
                title: data.title,
                image: data.image,
                userId: userId
            }
        })

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                dashboardCount: {
                    increment: 1
                },
                Dashboard: {
                    connect: {id: dashboard.id}
                }
            }
        })

        return this.getFields(dashboard)
    }

    async getAllDashboards(userId: string) {
        const dashboards = await this.prisma.dashboard.findMany({
            where: {userId: userId},
            select: {id: true, title: true, image: true}
        })

        return dashboards
    }

    async getDashboardById(id: string) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {
                id: id
            },
            select: {
                title: true, image: true, Column: {
                    select: {id: true, title: true, Task: {
                        select: {id: true, title: true, time: true, isDone: true}
                    }}
                }
            }
        })
        return dashboard
    }

    async updateDashboard(userId: string, id: string, data: updateDto) {
        await this.getById(id)

        await this.prisma.dashboard.update({
            where: {id: id},
            data: {
                title: data.title,
                image: data.image
            }
        })

        const dashboard = await this.getById(id)
        return this.getFields(dashboard)
    }

    async deleteDashboard(userId: string ,id: string) {
        await this.getById(id)

        await this.prisma.dashboard.delete({
            where: {
                id: id
            }
        })

        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                dashboardCount: {
                    decrement: 1
                },
                Dashboard: {
                    disconnect: {id: id}
                }
            }
        })

        return 'Dashboard is Deleted'
    }

    private getFields(dashboard: Dashboard) {
        return {
            id: dashboard.id,
            title: dashboard.title,
            image: dashboard.image
        }
    }

    private async getById(id: string) {
        const dashboard = await this.prisma.dashboard.findUnique({
            where: {id: id}
        })
        if(!dashboard) {
            throw new BadRequestException('Dashboard is not defind')
        }

        return dashboard
    }
}
