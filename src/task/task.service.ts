import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TaskDto } from './dto/task.dto';
import { DesctDto } from './dto/desc.dto';
import { Task } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }


    async createTask(id: string, data: TaskDto) {
        await this.isComlumn(id)

        const task = await this.prisma.task.create({
            data: {
                title: data.title,
                time: data.time,
                columnId: id
            }
        })

        await this.prisma.column.update({
            where: {
                id: id
            },
            data: {
                Task: {
                    connect: { id: task.id }
                }
            }
        })

        return this.taskFields(task)
    }

    async getTask(id: string) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: id
            },
            select: {
                id: true, title: true, time: true, status: true, description: {
                    select: {
                        id: true, text: true
                    }
                },
                comments: {
                    select: {
                        id: true, userId: true, name: true, text: true
                    }
                }
            }
        })

        return task
    }

    async updateTask(id: string, data: TaskDto) {
        await this.getById(id)
        await this.prisma.task.update({
            where: {
                id: id
            },
            data: {
                title: data.title,
                time: data.time
            }
        })
        const task = await this.getById(id)
        return this.taskFields(task)
    }

    async deleteTask(id: string) {
        const task = await this.getById(id)
        const col = task.columnId

        await this.prisma.task.delete({
            where: {
                id: id
            }
        })

        await this.prisma.column.update({
            where: {
                id: col
            },
            data: {
                Task: {
                    disconnect: { id: id }
                }
            }
        })

        return 'Task is Deleted'
    }

    async changeStatus(id: string) {
        const task = await this.getById(id)
        let newStatus: any
        let isDone: any

        if (task.status === "notwork") {
            newStatus = "doing"
            isDone = false
        } else if (task.status === "doing") {
            newStatus = "success"
            isDone = true
        } else if (task.status === "success") {
            newStatus = "notwork"
            isDone = false
        }

        const status = await this.prisma.task.update({
            where: {
                id: id
            },
            data: {
                status: newStatus,
                isDone: isDone
            }
        })

        const done = await this.getById(id) 
        return this.taskFields(done)
    }

    async addDesc(id: string, data: DesctDto) {
        const task = await this.getById(id)

        const desc = await this.prisma.description.create({
            data: {
                text: data.text,
                taskId: id
            }
        })

        await this.prisma.task.update({
            where: {
                id: id
            },
            data: {
                description: {
                    connect: {id: desc.id}
                }
            }
        })

        return this.getTask(id)
    }

    async updateDesc(taskId: string, desc: string, data: DesctDto) {
        await this.getById(taskId)
        await this.getDesc(desc)
        
        await this.prisma.description.update({
            where: {
                id: desc
            },
            data: {
                text: data.text
            }
        })

        return this.getTask(taskId)
    }

    async deleetDesc(taskId: string, desc: string) {
        await this.getById(taskId)
        await this.getDesc(desc)

        await this.prisma.description.delete({
            where: {
                id: desc
            }
        })

        await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                description: {
                    disconnect: {id: desc}
                }
            }
        })

        return this.getTask(taskId)
    }

    async addComment(userId: string, title: string, id: string, data: CommentDto) {
        await this.getById(id)
        const user = await this.checkUser(userId)

        const message = await this.prisma.comment.create({
            data: {
                userId: userId,
                name: title,
                text: data.text,
                taskId: id
            }
        })

        await this.prisma.task.update({
            where: {
                id: id
            },
            data: {
                comments: {
                    connect: {
                        id: message.id
                    }
                }
            }
        })

        return this.getTask(id)
    }


    async updateComment(userId: string, taskId: string, msgId: string, data: CommentDto) {
        await this.checkUser(userId)
        await this.getById(taskId)
        const msg = await this.getComment(msgId)

        const isOwner = msg.userId === userId
        if (!isOwner) {
            throw new BadRequestException('You are have not rights for this')
        }

        await this.prisma.comment.update({
            where: {
                id: msgId
            },
            data: {
                text: data.text
            }
        })

        return this.getTask(taskId)
    }


    async deleteComment(userId: string, taskId: string, msgId: string) {
        await this.checkUser(userId)
        await this.getById(taskId)
        const msg = await this.getComment(msgId)

        const isOwner = msg.userId === userId
        if (!isOwner) {
            throw new BadRequestException('You are have not rights for this')
        }

        await this.prisma.comment.delete({
            where: {
                id: msgId
            }
        })

        await this.prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                comments: {
                    disconnect: { id: msgId }
                }
            }
        })

        return this.getTask(taskId)
    }



    private taskFields(task: Task) {
        return {
            id: task.id,
            title: task.title,
            time: task.time,
            status: task.status
        }
    }
    
    private async getById(id: string) {
        const task = await this.prisma.task.findUnique({
            where: {
                id: id
            }
        })
        if (!task) {
            throw new BadRequestException('Task is not found')
        }

        return task
    }

    private async getDesc(id: string) {
        const desc = await this.prisma.description.findUnique({
            where: {
                id: id
            }
        })
        if(!desc) {
            throw new BadRequestException('Description is not found')
        }
        
        return desc
    }

    private async getComment(id: string) {
        const msg = await this.prisma.comment.findUnique({
            where: {
                id: id
            }
        })
        if (!msg) {
            throw new BadRequestException('Comment is not found')
        }

        return msg
    }

    private async isComlumn(id: string) {
        const col = await this.prisma.column.findUnique({
            where: {
                id: id
            }
        })
        if (!col) {
            throw new BadRequestException('Column is not found')
        }
    }

    private async checkUser(id: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        })
        if (!user) {
            throw new BadRequestException('User is defind')
        }

        return user
    }
}
