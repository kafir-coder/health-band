export const ok = (data: any) => ({
    status: 200,
    message: data
})

export const created = (data: any) => ({
    status: 201,
    message: data
})

export const notFound = () => ({
    status: 404,
    message: 'resource not found'
})
