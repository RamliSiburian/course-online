const listPath = {
    scheduleDetail: '/page/dashboard/tryout/schedules/detail/:scheduleID',
    test: '/'
}

export default function getPath(
    path: keyof typeof listPath,
    params: { [P: string]: string } = {}
) {
    return listPath[path]?.replace(
        /\:+[a-zA-Z]+/g,
        m => params[m?.replace(/[^a-zA-Z]+/g, '')]
    )
}