import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { brotliDecompressSync } from 'zlib';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Get requests
app.get('/jobs/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const job = await prisma.job.findMany({
        where: {
            departmentId: id
        },
        select: {
            id: true,
            title: true,
            role: true,
            description: true,
            skill: true,
            salary: true
        }
    })
    res.json(job);
});

app.get('/departments/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const departments = await prisma.department.findMany({
        where: {
            companyId: id
        },
        select: {
            id: true,
            name: true
        }
    })
    res.json(departments);
});

app.get('/employees/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const employees = await prisma.employee.findMany({
        where: {
            departmentId: id
        },
        select: {
            id: true,
            name: true,
            email_address: true,
            doj: true
        }
    })
    res.json(employees);
});

app.get('/candidates/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    const candidates = await prisma.candidate.findMany({
        where: {
            jobId: id
        },
    })
    res.json(candidates);
});

app.get('/companies', async (req: Request, res: Response) => {
    const companies = await prisma.company.findMany({ 
        include: {
            departments: true
        }
    })

    res.json(companies)
})


// POST requests
app.post('/candidate', async (req: Request, res: Response) => {
    const { body } = req;

    const candidate = await prisma.candidate.create({
        data: {
            fname: body.fname,
            lname: body.lname,
            email_address: body.email_address,
            edu_level: body.edu_level,
            city: body.city,
            region: body.region,
            job: {
                connect: {
                    id: body.jobId
                }
            }
        }
    })

    res.json(candidate)
});

app.post('/job', async (req: Request, res: Response) => {
    const { body } = req;

    const jobs = await prisma.job.create({
        data: {
            title: body.title,
            role: body.role,
            description: body.description,
            skill: body.skill,
            salary: body.salary,
            department: {
                connect: {
                    id: body.departmentId
                }
            }
        }
    })

    res.json(jobs)
});

app.post('/department', async (req: Request, res: Response) => {
    const { body } = req;

    const department = await prisma.department.create({
        data: {
            name: body.name,
            company: {
                connect: {
                    id: body.companyId
                }
            }
        }
    })

    res.json(department)
});

app.post('/company', async (req: Request, res: Response) => {
    const { body } = req;

    const company = await prisma.company.create({
        data: {
            name: body.name
        }
    })

    res.json(company)
})


// PUT requests
app.put('/department/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    const department = await prisma.department.update({
        where: { id },
        data: { 
            name: body.name
        },
    })
    res.json(department)
})

app.put('/employee/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    const employee = await prisma.employee.update({
        where: { id },
        data: { 
            name: body.name,
            email_address: body.email_address,
        },
    })
    res.json(employee)
})

app.put('/job/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    const job = await prisma.job.update({
        where: { id },
        data: { 
            title: body.title,
            role: body.role,
            description: body.description,
            skill: body.skill,
            salary: body.salary,
        },
    })
    res.json(job)
})

app.put('/candidate/:id', async (req, res) => {
    const { id } = req.params
    const { body } = req

    const candidate = await prisma.candidate.update({
        where: { id },
        data: { 
            fname: body.fname,
            lname: body.lname,
            email_address: body.email_address,
            edu_level: body.edu_level,
            city: body.city,
            region: body.region,
        },
    })
    res.json(candidate)
})

// DELETE requests
app.delete('/job/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    const job = await prisma.job.delete({
        where: {
            id: id
        }
    })

    res.json(job)
})

app.delete('/employee/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    const employee = await prisma.employee.delete({
        where: {
            id: id
        }
    })

    res.json(employee)
})

app.delete('/department/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    const department = await prisma.department.delete({
        where: {
            id: id
        }
    })

    res.json(department)
})

app.delete('/company/:id', async (req: Request, res: Response) => {
    const { id } = req.params

    const company = await prisma.company.delete({
        where: {
            id: id
        }
    })

    res.json(company)
})


const PORT = 3001;

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
