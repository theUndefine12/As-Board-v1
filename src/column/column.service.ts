import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ColumnDto } from './dto/column.dto';
import { Column } from '@prisma/client';

@Injectable()
export class ColumnService {
    constructor(private prisma: PrismaService) {}

    async addColumn(id: string, data: ColumnDto) {
        const dash = await this.getDashboard(id)
        
        const column = await this.prisma.column.create({
            data: {
                title: data.title,
                dashboardId: id
            }
        })

        await this.prisma.dashboard.update({
            where: {
                id: id
            },
            data: {
                Column: {
                    connect: {id: column.id}
                }
            }
        })

        return this.getColumnFields(column)
    }

    async updateColumn(userId: string ,id: string, data: ColumnDto) {
        await this.getById(id)
        await this.chechOwner(userId, id)

        const col = await this.prisma.column.update({
            where: {
                id: id
            },
            data: {
                title: data.title
            }
        })

        return this.getColumnFields(col)
    }

    async deletColumn(userId: string, id: string) {
        const col = await this.getById(id)
        await this.chechOwner(userId, id)

        const dash = await this.getDashboard(col.dashboardId)

        await this.prisma.column.delete({
            where: {
                id: id
            }
        })

        const a = await this.prisma.dashboard.update({
            where: {
                id: dash.id
            },
            data: {
                Column: {
                    disconnect: {id: col.id}
                }
            }
        })

        // return 'Column is deleted'
        return a
    }

    private async getById(id: string) {
        const column = await this.prisma.column.findUnique({
            where: {id: id},
            // include: {Task: true}
        })
        if (!column) {
            throw new BadRequestException('Column is not found')
        }

        return column
    }

    private async getDashboard(id: string) {
        const dash = await this.prisma.dashboard.findUnique({
            where: {
                id: id
            }
        })
        if(!dash) {
            throw new BadRequestException('Dashboard is not found')
        }

        return dash
    }

    private getColumnFields(column: Column) {
        return {
            id: column.id,
            title: column.title
        }
    }

    private async chechOwner(userId: string, id: string) {
        const column = await this.getById(id)
        const dashId = column.dashboardId

        const dashboard = await this.getDashboard(dashId)

        const isOwner = dashboard.userId === userId
        if(!isOwner) {
            throw new BadRequestException('You have not right')
        }

        // return dashboard
    }
}
