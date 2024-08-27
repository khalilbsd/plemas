
import phaseRouter from 'routes/phase/phase.route'
import projectRouter from 'routes/project/project.route'

export const apisUrls = [
    {url: "phases",routers:phaseRouter},
    {url: "projects",routers:projectRouter},
]